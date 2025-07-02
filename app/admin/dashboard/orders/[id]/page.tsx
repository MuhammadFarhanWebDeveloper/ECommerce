import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ActionSubmittingButton } from "@/components/ActionSubmittingButton";
import {
  cancelOrderAdmin,
  updateOrderStatus,
} from "@/lib/actions/order.actions";

interface AdminOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { id } = await params;
  const orderId = parseInt(id);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      User: true,
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
          ProductVariant: {
            include: {
              color: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return <div className="p-6 text-destructive">Order not found 🚫</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order #{order.id} Details</h1>

      <div className="space-y-2">
        <p>
          <strong>User:</strong> {order.User.email}
        </p>
        <p>
          <strong>Status:</strong> <Badge>{order.status}</Badge>
        </p>
        <p>
          <strong>Payment Status:</strong>{" "}
          <Badge>{order.paymentStatus || "N/A"}</Badge>
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
        </p>
        <p>
          <strong>Total:</strong>PKR:{order.total.toFixed(2)}
        </p>
        <p>
          <strong>Shipping Address:</strong> {order.shippingAddress},{" "}
          {order.city}, {order.postalCode}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-4 mb-2">Items:</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border p-3 rounded-md gap-4"
            >
              {/* Product Image */}
              {item.product.images.length > 0 ? (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Color: {item.ProductVariant.color.name} | Size: {item.ProductVariant.size} |
                  Qty: {item.quantity}
                </p>
              </div>

              {/* Price */}
              <p className="font-semibold">
                PKR {(item.product.price * item.quantity).toLocaleString("en-PK")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/orders">Back to Orders</Link>
        </Button>
        {order.status === "PENDING" && order.paymentStatus !== "COMPLETED" && (
          <form action={cancelOrderAdmin}>
            <input type="hidden" name="orderId" value={orderId} />
            <ActionSubmittingButton
              className="border rounded-md p-2 font-semibold cursor-pointer"
              text="Cancel Order"
            />
          </form>
        )}

        {(order.status === "PAID" ||
          order.paymentMethod === "CashOnDelivery") && (
          <form action={updateOrderStatus}>
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="status" value={"SHIPPED"} />
            <ActionSubmittingButton
              className="border rounded-md p-2 font-semibold cursor-pointer"
              text="Mark as Shipped"
            />
          </form>
        )}
      </div>
    </div>
  );
}
