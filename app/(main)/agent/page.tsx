"use client";
import { AuthForm } from "@/components/costome/auth-form";
import { trpc } from "@/trpc/react";
import { toast } from "sonner";

const Page = () => {
  const utils = trpc.useUtils(); // ⭐ VERY IMPORTANT

  const geminiTest = trpc.workflow.geminiTest.useMutation({
    onSuccess: async () => {
      toast.success("AI Job Queued");
    },
    onError:()=>{
      toast.error("Something went Wrong")
    }
  });

  const createWorkflow = trpc.workflow.createWorkflow.useMutation({
    onSuccess: async () => {
      toast.success("Job Queued");
      await utils.workflow.getWorkflows.invalidate(); // 🔥 refetch workflows
    },
  });

  const { data } = trpc.workflow.getWorkflows.useQuery();

  return (
    <> 
    <AuthForm/>
    {/* <div>
      <button
        onClick={() => createWorkflow.mutate()}
        disabled={createWorkflow.isPending}
        className="p-1 bg-gray-500 text-sm border rounded-2xl"
      >
        Create Workflow
      </button>
      <button
        disabled={createWorkflow.isPending}
        onClick={() => geminiTest.mutate()}
        className="bg-amber-300 text-black text-sm rounded-2xl p-1"
      >
        Test Gemini
      </button>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div> */}
    </>
  );
};

export default Page;
