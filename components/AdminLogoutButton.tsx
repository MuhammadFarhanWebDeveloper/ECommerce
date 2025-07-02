"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  const [isLoggingOut, startLoggingOut] = useTransition();
  const handleLogout = () => {
    startLoggingOut(async () => {
      await signOut();
    });
  };
  return (
    <Button
      disabled={isLoggingOut}
      onClick={handleLogout}
      variant={"destructive"}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <LogOut />
          Logging out...
        </>
      ) : (
        <>
          <LogOut />
          Logout
        </>
      )}
    </Button>
  );
}
