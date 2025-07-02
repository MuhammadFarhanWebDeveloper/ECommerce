import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CancelOrderButton } from "@/components/CancelOrderButton";
import { DeliveryOtpDialog } from "@/components/DeliveryOtpDialog";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const { id } = await params;
  const orderId = Number(id);
  if (isNaN(orderId)) {
    return <div>Invalid Order ID.</div>;
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
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
    return (
      <div>
        Order not found or you don't have permission to view this order.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Order #{order.id} Details</h1>

      {/* Order Status */}
      <div className="flex items-center gap-4">
        <Badge variant="secondary">{order.status}</Badge>
        <Badge variant="outline">{order.paymentStatus}</Badge>
        <Badge variant="outline">{order.paymentMethod}</Badge>
      </div>

      {/* Address */}
      <div>
        <h2 className="font-semibold text-lg mt-4 mb-2">Shipping Address</h2>
        <p>
          {order.shippingAddress}, {order.city}, {order.postalCode}
        </p>
      </div>

      <Separator />

      {/* Items */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Items:</h2>
        <div className="space-y-4">
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
                  Color: {item.ProductVariant.color.name} | Size:{" "}
                  {item.ProductVariant.size} | Qty: {item.quantity}
                </p>
              </div>

              {/* Price */}
              <p className="font-semibold">
                PKR{" "}
                {(item.product.price * item.quantity).toLocaleString("en-PK")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Total */}
      <div className="text-right text-lg font-bold">
        Total: PKR {order.total.toLocaleString("en-PK")}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Link href="/profile/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
        {order.status === "PENDING" && <CancelOrderButton orderId={order.id} />}

        {order.status === "PENDING" &&
          order.paymentMethod === "Stripe" &&
          order.paymentStatus !== "COMPLETED" && (
            <form action="/actions/pay-now" method="POST">
              <input type="hidden" name="orderId" value={order.id} />
              <Button variant="default">💳 Pay Now</Button>
            </form>
          )}
        {order.status === "SHIPPED" && (
          <div className="">
            <DeliveryOtpDialog orderId={order.id} />
          </div>
        )}
      </div>
    </div>
  );
}
