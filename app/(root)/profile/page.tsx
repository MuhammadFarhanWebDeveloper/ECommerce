// app/profile/page.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const req = {
    headers: {
      cookie: cookieStore.toString(),
    },
  } as any;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const user = {
    name: token?.name,
    email: token?.email,
    image: token?.picture,
    role: token?.role,
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar > 
            <AvatarImage width={64} height={64}  src={user.image || "/images/noavatar.png"} />
            <AvatarFallback>{user.name?.at(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">
              {user.name || "Unnamed User"}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href="/profile/orders">
            <Button variant="outline" className="w-full">
              View Orders
            </Button>
          </Link>
          {user.role === "ADMIN" && (
            <Link href="/admin/dashboard">
              <Button variant="outline" className="w-full">
                Admin Dashboard
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      
    </div>
  );
}
