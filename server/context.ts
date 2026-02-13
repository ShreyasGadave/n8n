import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { verifyToken } from "@/lib/jwt";

export async function createContext({ req }: CreateNextContextOptions) {
  const token = req.cookies["auth-token"];
  const user = token ? verifyToken(token) : null;

  return { user };
}

export type Context = inferAsyncReturnType<typeof createContext>;