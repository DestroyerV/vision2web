import { runCodeAgent } from "@/ai/agent";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, "Project ID is required"),
      })
    )
    .query(async ({ input }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return existingProject;
    }),
  getMany: baseProcedure.query(async () => {
    return prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
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
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      // Run the AI agent directly instead of using Inngest
      try {
        await runCodeAgent(input.value, createdProject.id);
      } catch (error) {
        console.error("Error running code agent:", error);
        // Create error message
        await prisma.message.create({
          data: {
            projectId: createdProject.id,
            content: "Something went wrong. Please try again later.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return createdProject;
    }),
});
