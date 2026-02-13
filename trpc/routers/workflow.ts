import { prisma } from "@/lib/prisma";
import { BaseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";

export const WorkFlowRouter = createTRPCRouter({
  getWorkflows: BaseProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: BaseProcedure.mutation(async() => {
    await inngest.send({name:'test/hello.world',
        data:{
            email: 'shreyasgadave@gmail.com'
        }
    })
    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),
});
