import { createTRPCRouter, ProtectedProcedure } from "../init";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
// import { AuthRouter } from "./Auth";
export const appRouter = createTRPCRouter({
  getUserData: ProtectedProcedure.query(({ ctx }) => {
    try {
      return prisma.user.findMany({
        where: {
          id: ctx.auth.user.id,
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user data",
      });
    }
  }),
  // auth: AuthRouter,
  // workflow: WorkFlowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
