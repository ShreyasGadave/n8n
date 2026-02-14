import { promises } from "dns";

interface ProProps {
  params: Promise<{
    executionsID: string;
  }>;
}

const page = async ({ params }: ProProps) => {
  const { executionsID } = await params;
  return (
    <div>
      <p>Executions ID:{executionsID}</p>
    </div>
  );
};

export default page;
