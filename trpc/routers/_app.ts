import { email, z } from 'zod';
import { ProcedureBase, createTRPCRouter } from "../init";
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';
// import { AuthRouter } from './Auth';
export const appRouter = createTRPCRouter({
  getWorkflows: ProcedureBase.query(({ ctx }) => {
  return prisma.workflow.findMany();
}),

createWorkflow: ProcedureBase.mutation(() => {
  return prisma.workflow.create({
    data: {
      name: "test-workflow",
    },
  });
}),

getUserData: ProcedureBase.query(async () => {
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
// auth:AuthRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;