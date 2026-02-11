import { api } from "@/trpc/server";

const Page = async () => {

  const User = await api.getUser();
  console.log(User);
  
  return (
    <div>
      <p>{User.name}</p>
    </div>
  );
};

export default Page;
