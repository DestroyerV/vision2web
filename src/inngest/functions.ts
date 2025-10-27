import {
  type AnyZodType,
  createAgent,
  createNetwork,
  createState,
  createTool,
  gemini,
  type Message,
  type Tool,
} from "@inngest/agent-kit";
import { Sandbox } from "e2b";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { inngest } from "./client";
import { getSandbox, lastAssistantTextMessageContent } from "./util";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const TOTAL_STEPS = 7;
    let currentStep = 0;

    // Helper function to update progress
    const updateProgress = async (stepName: string) => {
      currentStep++;
      await prisma.message.updateMany({
        where: {
          projectId: event.data.projectId,
          role: "ASSISTANT",
          type: "IN_PROGRESS",
        },
        data: {
          progressStep: stepName,
          progressCurrent: currentStep,
          progressTotal: TOTAL_STEPS,
        },
      });
    };

    // Create initial progress message
    await step.run("create-progress-message", async () => {
      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: "Starting generation...",
          role: "ASSISTANT",
          type: "IN_PROGRESS",
          progressStep: "Initializing",
          progressCurrent: 0,
          progressTotal: TOTAL_STEPS,
        },
      });
    });

    await updateProgress("Creating sandbox environment");
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vision2web", {
        timeoutMs: 30 * 60 * 1000,
      });
      return sandbox.sandboxId;
    });

    await updateProgress("Loading conversation history");
    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];

        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
            // Only include actual conversation messages, not progress indicators
            type: {
              in: ["RESULT"],
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 10, // Get last 10 messages (5 exchanges)
          include: {
            fragment: true, // Include fragment data with files
          },
        });

        for (const message of messages) {
          let content = message.content;
          
          // If this is an assistant message with a fragment, include the code files
          if (message.role === "ASSISTANT" && message.fragment?.files) {
            const filesJson = message.fragment.files as { [path: string]: string };
            const filesContext = Object.entries(filesJson)
              .map(([path, fileContent]) => `\n\nFile: ${path}\n\`\`\`\n${fileContent}\n\`\`\``)
              .join("\n");
            content = `${content}${filesContext}`;
          }
          
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: content,
          });
        }
        return formattedMessages;
      },
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      },
    );

    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An agent for writing and executing code",
      system: PROMPT,
      model: gemini({ model: "gemini-2.5-flash" }),
      tools: [
        createTool({
          name: "terminal",
          description: "A tool for interacting with the terminal",
          parameters: z.object({
            command: z.string(),
          }) as unknown as AnyZodType,
          handler: async (input, { step }) => {
            const { command } = input as { command: string };
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                console.error(
                  `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`,
                );
                return `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "A tool for creating or updating files",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }) as unknown as AnyZodType,
          handler: async (
            input,
            { step, network }: Tool.Options<AgentState>,
          ) => {
            const { files } = input as { files: Array<{ path: string; content: string }> };
            const newFiles = await step?.run(
              "create-or-update-files",
              async () => {
                try {
                  const updateFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updateFiles[file.path] = file.content;
                  }

                  return updateFiles;
                } catch (error) {
                  console.error(`Error creating/updating files: ${error}`);
                  return `Error creating/updating files: ${error}`;
                }
              },
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "A tool for reading files",
          parameters: z.object({
            files: z.array(z.string()),
          }) as unknown as AnyZodType,
          handler: async (input, { step }) => {
            const { files } = input as { files: string[] };
            return await step?.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                return JSON.stringify(contents, null, 2);
              } catch (error) {
                console.error(`Error reading files: ${error}`);
                return `Error reading files: ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    // Run the agent with an input.  This automatically uses steps
    // to call your AI model.
    const value = String(event?.data?.value ?? "").trim();
    if (!value) {
      throw new Error("Missing required payload: event.data.value");
    }

    await updateProgress("Analyzing your request and generating code");
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(value, { state });

    await updateProgress("Generating title for your project");
    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "An agent for generating titles for code fragments",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({ model: "gemini-2.5-flash-lite" }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "An agent for generating responses based on code fragments",
      system: RESPONSE_PROMPT,
      model: gemini({ model: "gemini-2.5-flash-lite" }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary,
    );

    await updateProgress("Preparing response");
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary,
    );

    const parseAgentOutput = (value: Message[]) => {
      const output = value[0];

      if (output.type !== "text") {
        return "Fragment";
      }

      if (Array.isArray(output.content)) {
        return output.content.map((text) => text).join("");
      } else {
        return output.content;
      }
    };

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    await updateProgress("Deploying to sandbox");
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      // Delete the progress message
      await prisma.message.deleteMany({
        where: {
          projectId: event.data.projectId,
          role: "ASSISTANT",
          type: "IN_PROGRESS",
        },
      });

      if (isError) {
        await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again later.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
