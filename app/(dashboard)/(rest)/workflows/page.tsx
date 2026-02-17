import { requireAuth } from "@/lib/auth-utils";
import { trpc } from "@/trpc/client";
import { caller } from "@/trpc/server";

const page = async () => {
  await requireAuth();
  const data = caller.getUserData();
  return (
    <div>
      <p>Workflow</p>
      {JSON.stringify(data)}
    </div>
  );
};

export default page;
