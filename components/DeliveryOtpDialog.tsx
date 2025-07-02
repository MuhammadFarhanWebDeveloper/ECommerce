"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { Loader2 } from "lucide-react";
import { verifyDeliveryOtp } from "@/lib/actions/order.actions";

export function DeliveryOtpDialog({ orderId }: { orderId: number }) {
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (otp.length !== 6) {
          toast.error("OTP must be exactly 6 digits.");
          return;
        }

        const msg = await verifyDeliveryOtp(orderId, otp);

        if (!msg.success) {
          toast.error(msg.message);
          return;
        }

        setOpen(false);
        setOtp("");
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value))) {
      setOtp(value);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">
        🚚 Enter Delivery OTP
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter 6-Digit Delivery OTP</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
          />

          <DialogFooter>
            <Button
              variant="default"
              disabled={isPending || otp.length !== 6}
              onClick={handleSubmit}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Submit OTP"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
