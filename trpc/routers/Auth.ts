import z from "zod";
import { BaseProcedure, ProtectedProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/db/client";
import { Prisma } from "@/app/generated/prisma";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // ✅ import Next.js cookie handler

export const AuthRouter = createTRPCRouter({
  signup: BaseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);

        await prisma.user.create({
          data: {
            email: input.email,
            password: passwordHash,
          },
        });

        return {
          success: true,
          message: "User created successfully.",
          // ❌ Removed: never return the hash to the client
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already exists",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user. Please try again.",
        });
      }
    }),

  login: BaseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const isValid = await bcrypt.compare(input.password, user.password);

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // ✅ Set httpOnly cookie — JS can't read this (XSS safe)
      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // ✅ Only return safe user info, never the token in the body
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: "User authorized successfully",
      };
    }),

  // ✅ New: verify who's logged in
  me: ProtectedProcedure.query(({ ctx }) => {
    return { userId: ctx.user.userId };
  }),

  // ✅ New: logout by clearing the cookie
  logout: ProtectedProcedure.mutation(async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return { success: true, message: "Logged out successfully" };
  }),
});