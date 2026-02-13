'use client'

import { ModeToggle } from "@/components/costome/button-theam";

const Page = () => {
console.log('Shreyas');


  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      <ModeToggle/>
    </div>
  );
};


export default Page;
