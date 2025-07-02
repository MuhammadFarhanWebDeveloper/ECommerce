import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import BuyerOrderActions from "@/components/BuyerOrderActions";

export default async function OrdersPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
          ProductVariant: {
            include: {
              color: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-muted-foreground">You have no orders yet.</div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "PENDING"
                          ? "outline"
                          : order.status === "PAID"
                          ? "secondary"
                          : order.status === "SHIPPED" ||
                            order.status === "DELIVERED"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  {/* Payment Status Column */}
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "COMPLETED"
                          ? "secondary"
                          : order.paymentStatus === "PENDING"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {order.paymentStatus || "N/A"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {order.paymentMethod || "N/A"}
                    </Badge>
                  </TableCell>

                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <BuyerOrderActions order={{ ...order, paymentStatus: order.paymentStatus ?? "PENDING" }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
