import { prisma } from "@/lib/prisma";
import { inngest } from "./client";
import { success } from "zod";

export const helloWorld = inngest.createFunction(
  { id: "hello-world",retries:0 },
  { event: "test/hello.world" },
  async ({ event, step }) => {
      await step.sleep("Generating context", "5s");
      await step.sleep("Generating Code", "5s");
      await step.sleep("Deploying Code", "5s");
      await step.run('create-workflow',()=>{
        return prisma.workflow.create({
            data:{
                name:'workflow-from-inngest '
            }
        })
      })
      return { success:true, message: `Job Done ${event.data.email}!` };
  },
); 