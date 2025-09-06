import { messageRouter } from "@/modules/messages/server/procedures";
import { createTRPCRouter } from "../init";
import { projectRouter } from "@/modules/projects/server/procedures";

export const appRouter = createTRPCRouter({
  projects: projectRouter,
  messages: messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
