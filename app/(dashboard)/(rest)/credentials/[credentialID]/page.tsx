import { promises } from "dns";

interface ProProps {
  params: Promise<{
    credentialID: string;
  }>;
}

const page = async ({ params }: ProProps) => {
  const { credentialID } = await params;
  return (
    <div>
      <p>Credentials ID:{credentialID}</p>
    </div>
  );
};

export default page;
