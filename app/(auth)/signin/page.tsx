import { AuthForm } from "@/components/costome/auth-form";
import Index from "@/components/ui/travel-connect-signin-1";
import { requireUnAuth } from "@/lib/auth-utils";

const page = async () => { 
  return (
    <div>
         <AuthForm />
    </div>
  );
};

export default page;
