"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import Stripe from "stripe";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  sendOrderCancelledEmail,
  sendOrderCreatedEmail,
  sendOrderDeliveredEmail,
  sendOrderShippedEmail,
} from "../email/order-emails";
import { generateOTP } from "../utils";
import { OrderStatus, PaymentStatus } from "@prisma/client";

type CreateOrderParams = {
  userId: string;
  items: {
    productId: number;
    variantId: number;
    quantity: number;
    priceAtTime: number;
  }[];
  shippingAddress: string;
  city: string;
  postalCode: string;
  total: number;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
};

export async function createOrder(data: CreateOrderParams) {
  try {
    const otp = generateOTP();
    const session = await auth();
    if (!session || !session.user?.email) {
      redirect("/login");
    }
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
        status: "PENDING",
        shippingAddress: data.shippingAddress,
        city: data.city,
        postalCode: data.postalCode,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus || "PENDING",
        deliveryOtp: otp,
        updatedAt: new Date(),
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    await sendOrderCreatedEmail(
      session.user.email,
      order.id.toString(),
      order.deliveryOtp!
    );

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function createStripeSession(
  orderId: number,
  amount: number,
  userEmail: string
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: `Order #${orderId}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?orderId=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    metadata: {
      orderId,
    },
  });

  redirect(session.url!);
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          ProductVariant: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderDetails(orderId: number) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      User: true,
      items: {
        include: {
          product: true,
          ProductVariant: true,
        },
      },
    },
  });
}

export async function deleteOrder(formData: FormData) {
  const orderId = Number(formData.get("orderId"));
  if (!orderId) {
    throw new Error("Order ID is required.");
  }
  await prisma.order.delete({
    where: { id: orderId },
  });
  revalidatePath("/admin/dashboard/orders");
}

export async function payNowAction(formData: FormData) {
  const orderId = Number(formData.get("orderId"));

  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus === "COMPLETED") {
    throw new Error("Order already paid.");
  }

  if (!session.user.email) {
    throw new Error("User email not found.");
  }

  return createStripeSession(order.id, order.total, session.user.email);
}

export async function verifyDeliveryOtp(orderId: number, enteredOtp: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      User: true,
    },
  });

  if (!order) {
    return { success: false, message: "Order not found." };
  }

  if (order.deliveryOtp !== enteredOtp) {
    return {
      success: false,
      message: "Invalid OTP. Please check and try again.",
    };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "DELIVERED",
      ...(order.paymentMethod === "CashOnDelivery" && {
        paymentStatus: "COMPLETED",
      }),
      deliveryOtp: null,
    },
  });
  await sendOrderDeliveredEmail(order.User.email, order.id.toString());

  return { success: true, message: "Order marked as delivered." };
}

export async function cancelOrder(formData: FormData) {
  const orderId = Number(formData.get("orderId"));
  if (!orderId) {
    throw new Error("Order ID is required.");
  }
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Check if user owns the order and order is cancellable
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      User: true,
    },
  });

  if (!order) {
    throw new Error("Order not found or access denied.");
  }

  if (order.status !== "PENDING" || order.paymentStatus !== "COMPLETED") {
    throw new Error("Only pending and not paid orders can be cancelled.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/profile/orders");
  await sendOrderCancelledEmail(order.User.email, order.id.toString());
}

export async function cancelOrderAdmin(formData: FormData) {
  const orderId = Number(formData.get("orderId"));

  if (!orderId) {
    throw new Error("Order ID is required.");
  }
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      User: true,
    },
  });

  if (!order) {
    return;
  }
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  await sendOrderCancelledEmail(order.User.email, order.id.toString());
}

// orderId: number, status: OrderStatus
export async function updateOrderStatus(formData: FormData) {
  const orderId = Number(formData.get("orderId"));
  const status = formData.get("status") as OrderStatus;
  if (!orderId || !status) {
    throw new Error("Order ID and status are required.");
  }
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      User: true,
    },
  });

  if (status === "SHIPPED" && order) {
    await sendOrderShippedEmail(order.User.email, orderId.toString());
  }

  revalidatePath("/admin/dashboard/orders");
}
