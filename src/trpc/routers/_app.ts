import { messageRouter } from "@/modules/messages/server/procedures";
import { createTRPCRouter } from "../init";
import { projectRouter } from "@/modules/projects/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedure";

export const appRouter = createTRPCRouter({
  projects: projectRouter,
  messages: messageRouter,
  usage: usageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
