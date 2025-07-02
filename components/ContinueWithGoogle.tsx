"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { LoginAction } from "@/lib/actions/auth.actions";
import { Loader2 } from "lucide-react"; // or any spinner icon you use

export default function ContinueWithGoogle() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(() => {
      LoginAction(); // triggers your server action
    });
  };

  return (
    <form action={handleSubmit}>
      <Button
        type="submit"
        variant="outline"
        disabled={isPending}
        className="w-full bg-white text-black hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <Image alt="G" width={20} height={20} src="/images/google.png" />
        )}
        {isPending ? "Logging in..." : "Continue with Google"}
      </Button>
    </form>
  );
}
