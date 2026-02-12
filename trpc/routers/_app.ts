import { email, z } from 'zod';
import { ProcedureBase, router } from '@/trpc/trpc';
import { prisma } from '@/lib/prisma';
export const appRouter = router({
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

});
// export type definition of API
export type AppRouter = typeof appRouter;