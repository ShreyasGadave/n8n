"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { trpc } from "@/trpc/client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { requireUnAuth } from "@/lib/auth-utils";

// ✅ Fix 1: refine() must be chained on the full object, not after the closing brace
const loginSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmpassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only validate if confirmpassword has a value (i.e. on signup)
      if (!data.confirmpassword) return true;
      return data.password === data.confirmpassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmpassword"],
    },
  );

type LoginFormValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const pathname = usePathname();
  const router = useRouter();
  const isSignup = pathname === "/signup";
  const route = isSignup ? "/signin" : "/signup";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    // ✅ Fix 3: Swapped — signup page should call signupMutation, signin should call loginMutation
    if (isSignup) {
      await authClient.signUp.email(
        {
          name: values.email,
          password: values.password,
          callbackURL: "/",
          email: values.email,
        },
        {
          onSuccess: () => {
            router.push("/signin");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } else {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/workflows");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 dark:bg-black">
      <div className="flex ">
        <Image src="/logos/logo.svg" alt="logo" height={40} width={40} />
        <p>Nodebase</p>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            {isSignup ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignup
              ? "Sign up to start your journey with us"
              : "Sign in to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                {/* OAuth Buttons */}
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full" type="button">
                    <Image
                      src="/logos/github.svg"
                      alt="github"
                      height={20}
                      width={20}
                    />
                    Continue with GitHub
                  </Button>
                  <Button variant="outline" className="w-full" type="button">
                    <Image
                      src="/logos/google.svg"
                      alt="google"
                      height={20}
                      width={20}
                    />
                    Continue with Google
                  </Button>
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="***********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ✅ Fix 4: Confirm Password — only shown on signup, uses correct field name */}
                {isSignup && (
                  <FormField
                    control={form.control}
                    name="confirmpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="***********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* ✅ Fix 5: disabled uses the combined isPending, not the deleted Login ref */}
                <Button type="submit" className="w-full">
                  {isSignup ? "Create Account" : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                  {!isSignup && (
                    <Link
                      href="/forgot-password"
                      className="text-sm transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  )}
                  <Link href={route} className="text-sm transition-colors">
                    {isSignup ? "Already have an account?" : "Create Account"}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
