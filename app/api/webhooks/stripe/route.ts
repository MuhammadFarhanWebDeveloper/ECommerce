import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;

  if (!sig || !webhookSecret) {
    return new NextResponse("Missing signature or webhook secret", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const { orderId } = session.metadata || {};
    if (!orderId) {
      console.error("Missing order id in session metadata");
      return new NextResponse("Missing metadata", { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        status: "PAID",
        paymentStatus: "COMPLETED",
      },
    });
    if (!order) {
      console.error("Order not found");
      return new NextResponse("Order not found", { status: 404 });
    }

    return new NextResponse(null, { status: 200 });
  }
}
