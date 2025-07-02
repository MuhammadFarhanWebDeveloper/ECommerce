"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { clearCart } from "@/lib/store/features/cart/cart-slice";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const orderId = searchParams.get("orderId");

  function handleClearCart() {
    dispatch(clearCart());
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle2 className="text-green-500 h-16 w-16" />
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>
        <p className="text-muted-foreground">
          Your order {orderId ? `#${orderId}` : ""} has been placed
          successfully.
        </p>

        <div className="flex flex-col gap-2 mt-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            Continue Shopping
          </Button>
          <Button onClick={() => router.push("/profile/orders")}>
            View My Orders
          </Button>
          <Button variant="destructive" onClick={handleClearCart}>
            🗑️ Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
