import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/db/client";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AuthRouter = createTRPCRouter({
  signup: baseProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        mobile: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);

        await prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            mobile: input.mobile,
            password: passwordHash,
          },
        });

        return {
          success: true,
          message: `User created successfully. Password :${passwordHash}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already exists",
            });
          }
        }

        console.error("Database error:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user. Please try again.",
        });
      }
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string(),
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

      console.log("User from DB:", user);
      console.log("Input password:", input.password);
      console.log("Stored hash:", user.password);

      const isValid = await bcrypt.compare(input.password, user.password);

      console.log("Password valid:", isValid);

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: `User Authorized successfully`,
      };
    }),
});