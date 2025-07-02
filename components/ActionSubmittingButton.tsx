"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react"; // Optional: Using Lucide for a nice spinner icon
import { cn } from "@/lib/utils";

interface ActionSubmittingButtonProps {
  text?: string;
  className?: string;
}

export function ActionSubmittingButton({
  className = "",
  text = "Submit",
}: ActionSubmittingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn("flex cursor-pointer items-center gap-2", className)}
    >
      {pending && <Loader2 className="animate-spin h-4 w-4" />}
      {pending ? "Processing..." : text}
    </button>
  );
}
