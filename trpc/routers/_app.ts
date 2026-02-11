import { email, z } from 'zod';
import { ProcedureBase, router } from '@/trpc/trpc';
export const appRouter = router({
  getUser : ProcedureBase.query(() => {
      return {
       name:'Shreyas Gadave',
       email:'shreyasgadave@gmail.com'
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;