"use client";
import ContinueWithGoogle from "@/components/ContinueWithGoogle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { LoginWithCredentials } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(5, "Invalid Password"),
});

export default function page() {
  const router = useRouter();
  const [isSubmitting, startSubmitting] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startSubmitting(async () => {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) toast.error("Invalid email or Password");
      else {
        toast.success("Login successful!");
        router.push("/");
      }
    });
  }

  return (
    <div className="flex p-4 items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="mx-auto md:w-[50%] w-full lg:w-[30%]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="username"
                            placeholder="Enter your Email"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your Password"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
          </Form>
          <Separator className="my-6" />
          <div className="space-y-4">
            <ContinueWithGoogle />
            <div className="mt-4 text-center text-sm">
              Don't have account?{" "}
              <Link href="/signup" className="underline">
                Sign Up
              </Link>
            </div>
          </div>
        </CardContent>
        {/* <SignIn /> */}
      </Card>
    </div>
  );
}
