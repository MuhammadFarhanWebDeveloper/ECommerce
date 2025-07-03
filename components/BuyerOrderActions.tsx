"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Eye, MoreVertical } from "lucide-react";
import { cancelOrder, payNowAction } from "@/lib/actions/order.actions";
import { Order } from "@prisma/client";
import Link from "next/link";
import { DeliveryOtpDialog } from "./DeliveryOtpDialog";

export default function BuyerOrderActions({ order }: { order: Order }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* View Details */}
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <Link href={`/profile/orders/${order.id}`}>
            <div className="flex items-center gap-2 ">
              <Eye className="h-4 w-4" />
              View Details
            </div>
          </Link>
        </DropdownMenuItem>

        {/* Pay Now (if unpaid Stripe order) */}
        {order.paymentMethod === "Stripe" &&
          order.status === "PENDING" &&
          order.paymentStatus !== "COMPLETED" && (
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <form action={payNowAction}>
                <input type="hidden" name="orderId" value={order.id} />
                <button
                  type="submit"
                  className="flex items-center gap-2 text-primary"
                >
                  Pay Now
                </button>
              </form>
            </DropdownMenuItem>
          )}

        {order.status === "PENDING" && order.paymentStatus !== "COMPLETED" && (
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <form action={cancelOrder}>
              <input type="hidden" name="orderId" value={order.id} />
              <button
                type="submit"
                className="flex items-center text-red-700 gap-2"
              >
                Cancel Order
              </button>
            </form>
          </DropdownMenuItem>
        )}

        {order.status === "SHIPPED" && (
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <DeliveryOtpDialog orderId={order.id} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
