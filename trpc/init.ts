import { initTRPC, TRPCError } from "@trpc/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import SuperJSON from "superjson"; // ✅ Add this import

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const token = opts.req.cookies.get("auth-token")?.value;

  let user = null;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
    } catch {
      user = null;
    }
  }

  return { user, req: opts.req };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON, // ✅ Add this — must match the client
});

export const createTRPCRouter = t.router;
export const BaseProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in.",
    });
  }
  return next({ ctx: { user: ctx.user } });
});

export const ProtectedProcedure = t.procedure.use(isAuthed);