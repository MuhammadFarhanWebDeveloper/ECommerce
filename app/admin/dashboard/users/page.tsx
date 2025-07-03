import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { DataTable } from "./data-table";
import { getUserColumns } from "./columns";
import { auth } from "@/auth";
import { use } from "react";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const req = {
    headers: {
      cookie: cookieStore.toString(),
    },
  } as any;

  const session = await auth();

  const user = session?.user;

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
      </div>
    );
  }

  const users = await prisma.user.findMany();

  const columns = getUserColumns({
    email: user.email!,
    role: user.role,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
