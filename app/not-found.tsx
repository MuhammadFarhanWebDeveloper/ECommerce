"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // (Optional: ShadCN button)
import { Ban } from "lucide-react"; // (Optional: Lucide icon)

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 dark:bg-gray-900">
      <Ban className="w-16 h-16 text-red-500 mb-4" /> {/* Optional icon */}
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Oops... The page you're looking for doesn't exist.
      </p>
      <Link href="/">
        <Button variant="outline" className="hover:bg-gray-200 dark:hover:bg-gray-800">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
