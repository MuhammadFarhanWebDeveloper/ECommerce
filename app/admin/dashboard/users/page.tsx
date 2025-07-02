import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { DataTable } from "./data-table";
import { getUserColumns } from "./columns";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const req = {
    headers: {
      cookie: cookieStore.toString(),
    },
  } as any;

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
      </div>
    );
  }

  const users = await prisma.user.findMany();

  const columns = getUserColumns({
    email: token.email!,
    role: token.role,
  });

  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
