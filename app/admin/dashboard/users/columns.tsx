"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ChangeUserRole } from "@/components/ChangeUserRole";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Role, User } from "@prisma/client";

interface TokenUser {
  email: string;
  role: Role;
}

export function getUserColumns(tokenUser: TokenUser): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        const isEditable = user.role === "USER" || user.email === tokenUser.email;

        return isEditable ? (
          <ChangeUserRole user={user} currentRole={user.role} />
        ) : (
          <Badge variant="outline">{user.role}</Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Intl.DateTimeFormat("en-US").format(new Date(row.original.createdAt)),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return user.role === "USER" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    },
  ];
}
