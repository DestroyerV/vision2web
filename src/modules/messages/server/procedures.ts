import { runCodeAgent } from "@/ai/agent";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, "Project ID is required"),
      })
    )
    .query(async ({ input }) => {
      return prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          fragment: true,
        },
      });
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, "Value is required")
          .max(1000, "Value must be at most 1000 characters long"),
        projectId: z.string().min(1, "Project ID is required"),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      // Run the AI agent directly instead of using Inngest
      try {
        await runCodeAgent(input.value, input.projectId);
      } catch (error) {
        console.error("Error running code agent:", error);
        // Create error message
        await prisma.message.create({
          data: {
            projectId: input.projectId,
            content: "Something went wrong. Please try again later.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return createdMessage;
    }),
});
