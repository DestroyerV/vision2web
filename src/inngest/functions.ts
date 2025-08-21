import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
import { Sandbox } from "e2b";
import { getSandbox } from "./util";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vision2web");
      return sandbox.sandboxId;
    });
    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert Next.js developer. You write readable, maintainable code. You write simple Next.js and React snippets.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    // Run the agent with an input.  This automatically uses steps
    // to call your AI model.
    const value = String(event?.data?.value ?? "").trim();
    if (!value) {
      throw new Error("Missing required payload: event.data.value");
    }
    const prompt =
      `Write the following snippets. Reply with code blocks only:\n\n` +
      value.slice(0, 4000); // keep within token/cost bounds

    const { output } = await codeAgent.run(prompt);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {
      output,
      sandboxUrl,
    };
  }
);
