import { trpc } from '@/trpc/server';
import { ClientGreeting } from '';

export default async function Home() {
  void trpc.hello.prefetch();

  return (
    <HydrateClient>
      <ClientGreeting />
    </HydrateClient>
  );
}
