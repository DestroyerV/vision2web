import { TRPCError } from "@trpc/server";
import z from "zod";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { consumeCredits } from "@/modules/usage/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

// Helper function to generate a project name from user input
function generateProjectName(input: string): string {
  // Take first 5 words, convert to lowercase, remove special chars, and join with hyphens
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .split(/\s+/) // Split by whitespace
    .filter((word) => word.length > 0) // Remove empty strings
    .slice(0, 4); // Take first 4 words

  // If we have words, join them with hyphens and add "...", otherwise use a default name
  return words.length > 0 ? `${words.join("-")}...` : "untitled-project";
}

export const projectRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Project ID is required"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
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
  getMany: protectedProcedure.query(async ({ ctx }) => {
    return prisma.project.findMany({
      where: { userId: ctx.auth.userId },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, "Value is required")
          .max(1000, "Value must be at most 1000 characters long"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have run out of credits",
          });
        }
      }

      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateProjectName(input.value),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
