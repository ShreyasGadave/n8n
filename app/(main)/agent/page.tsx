"use client";
import { trpc } from "@/trpc/react";
import { toast } from "sonner";

const Page = () => {
  const utils = trpc.useUtils(); // ⭐ VERY IMPORTANT

  const createWorkflow = trpc.workflow.createWorkflow.useMutation({
    onSuccess: async () => {
      toast.success('Job Queued')
      await utils.workflow.getWorkflows.invalidate(); // 🔥 refetch workflows
    },
  });
  
  const { data } = trpc.workflow.getWorkflows.useQuery();

  return (
    <div>
      <button
        onClick={() => createWorkflow.mutate()}
        disabled={createWorkflow.isPending}
        className="p-2 bg-green-400 border rounded-2xl"
      >
        Create Workflow
      </button>

      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
};

export default Page;
