import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { AdminOrderActions } from "@/components/AdminOrderActions";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      User: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders (Admin)</h1>

      {orders.length === 0 ? (
        <div className="text-muted-foreground">No orders found.</div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
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
                  <TableCell>{order.User?.email || "Unknown"}</TableCell>
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
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <AdminOrderActions
                      orderId={order.id}
                      orderStatus={order.status}
                      paymentStatus={order.paymentStatus!}
                    />
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
