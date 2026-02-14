import { promises } from "dns";

interface ProProps {
  params: Promise<{
    workflowID: string;
  }>;
}

const page = async ({ params }: ProProps) => {
  const { workflowID } = await params;
  return (
    <div>
      <p>Workflow ID:{workflowID}</p>
    </div>
  );
};

export default page;
