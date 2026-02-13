import { BaseProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { AuthRouter } from "./Auth";
import { WorkFlowRouter } from "./workflow";
export const appRouter = createTRPCRouter({


  getUserData: BaseProcedure.query(async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user data",
      });
    }
  }),
  auth: AuthRouter,
  workflow:WorkFlowRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
