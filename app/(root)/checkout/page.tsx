"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { createOrder, createStripeSession } from "@/lib/actions/order.actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const cartItems = useSelector((state: RootState) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const router = useRouter();
  const { data: session, status: userSessionStatus } = useSession();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 5.0;
  const total = subtotal + shippingCost;

  async function handlePlaceOrder() {
    if (!session?.user?.id) {
      setStatus("User not logged in.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setStatus("");

    try {
      const order = await createOrder({
        userId: session.user.id,
        total,
        shippingAddress: address,
        city,
        postalCode,
        paymentMethod: paymentMethod,
        paymentStatus:
          paymentMethod === "CashOnDelivery" ? "PENDING" : "UNPAID",
        items: cartItems.map((item) => ({
          productId: item.id,
          variantId: item.variant.id,
          quantity: item.quantity,
          priceAtTime: item.price,
        })),
      });

      console.log("Order created:", order);

      if (paymentMethod === "CashOnDelivery") {
        router.push(`/order-success?orderId=${order.id}`);
      } else if (paymentMethod === "Stripe") {
        if (!session.user.email) {
          setStatus("User email not found. Cannot create Stripe session.");
          setIsLoading(false);
          return;
        }
        const stripeSession = await createStripeSession(
          order.id,
          total,
          session.user.email
        );
      }
    } catch (error: any) {
      console.error(error);
      setStatus(`Error placing order: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              Review your items before placing the order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Color: {item.variant.color.name} | Size:{" "}
                          {item.variant.size} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        PKR{" "}
                        {(item.price * item.quantity).toLocaleString("en-PK")}
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">
                      PKR {subtotal.toLocaleString("en-PK")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-medium">
                      PKR {shippingCost.toLocaleString("en-PK")}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <p>Total</p>
                    <p>PKR {total.toLocaleString("en-PK")}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your shipping details to complete the order.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Lahore / Karachi / etc."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="54000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Select your preferred payment option.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-4"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CashOnDelivery" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Stripe" id="stripe" />
                  <Label htmlFor="stripe">Stripe</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                disabled={
                  isLoading ||
                  cartItems.length === 0 ||
                  !address.trim() ||
                  !city.trim() ||
                  !postalCode.trim()
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Place Order
              </Button>
              {status && (
                <p
                  className={`text-sm ${
                    status.includes("Error") ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {status}
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
