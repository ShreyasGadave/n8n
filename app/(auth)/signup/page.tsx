import { AuthForm } from "@/components/costome/auth-form";
import { requireUnAuth } from "@/lib/auth-utils";

const page = async () => {
  await requireUnAuth();
  return (
    <div>
      <AuthForm />
    </div>
  );
};

export default page;
