"use client";

import { MoreVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ActionSubmittingButton } from "@/components/ActionSubmittingButton";
import {
  cancelOrderAdmin,
  deleteOrder,
  updateOrderStatus,
} from "@/lib/actions/order.actions";

interface AdminOrderActionsProps {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
}

export function AdminOrderActions({
  orderId,
  orderStatus,
  paymentStatus,
  paymentMethod,
}: AdminOrderActionsProps) {
  const handleSelect = (e: Event) => {
    e.preventDefault();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <Link href={`/admin/dashboard/orders/${orderId}`}>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </div>
          </Link>
        </DropdownMenuItem>

        {orderStatus === "PENDING" && paymentStatus !== "COMPLETED" && (
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <form action={cancelOrderAdmin}>
              <input type="hidden" name="orderId" value={orderId} />
              <ActionSubmittingButton text="Cancel Order" />
            </form>
          </DropdownMenuItem>
        )}

        {(orderStatus === "PAID" || paymentMethod === "CashOnDelivery") && (
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <form action={updateOrderStatus}>
              <input type="hidden" name="orderId" value={orderId} />
              <input type="hidden" name="status" value={"SHIPPED"} />
              <ActionSubmittingButton text="Mark as Shipped" />
            </form>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <form action={deleteOrder}>
            <input type="hidden" name="orderId" value={orderId} />

            <ActionSubmittingButton text="Delete" />
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
