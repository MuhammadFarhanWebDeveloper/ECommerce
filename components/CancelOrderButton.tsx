"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from 'nextjs-toploader/app';
import { Loader2 } from "lucide-react";
import { cancelOrder } from "@/lib/actions/order.actions";

export function CancelOrderButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("orderId", orderId.toString());
        await cancelOrder(formData);
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={handleCancel}
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Cancelling...
        </>
      ) : (
        "Cancel Order"
      )}
    </Button>
  );
}
