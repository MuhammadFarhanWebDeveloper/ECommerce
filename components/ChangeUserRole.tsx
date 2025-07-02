"use client";

import { useTransition } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateUserAction } from "@/lib/actions/auth.actions";
import { Role, User } from "@prisma/client";

interface UserRoleSelectProps {
  user: User;
  currentRole: Role;
}

export function ChangeUserRole({ user, currentRole }: UserRoleSelectProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const handleRoleChange = (newRole: Role) => {
    startTransition(async () => {
      try {
        await updateUserAction({
          id: user.id,
          email: user.email ?? "",
          role: newRole,
        });

        const isSelf = session?.user?.id === user.id;

        toast.success("User role updated!");

        if (isSelf) {
          toast.info("You changed your own role. Logging out...");
          await signOut({ callbackUrl: "/login" });
        }
      } catch (error) {
        toast.error("Failed to update role.");
      }
    });
  };

  return (
    <Select
      defaultValue={currentRole}
      onValueChange={(value) => handleRoleChange(value as Role)}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USER">USER</SelectItem>
        <SelectItem value="ADMIN">ADMIN</SelectItem>
      </SelectContent>
    </Select>
  );
}
