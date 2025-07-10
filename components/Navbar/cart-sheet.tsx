"use client";

import { Minus, Plus, Router, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/lib/store/features/cart/cart-slice";
import ColorCircle from "../ColorCircle";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

// Types for our cart

interface CartSheetProps {
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartSheet({ onUpdateQuantity, onRemoveItem }: CartSheetProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { status } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {cartItemCount}
            </Badge>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg p-2">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center mt-4 px-4 justify-between">
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Your Cart</span>
              <Badge variant="outline" className="ml-1">
                {cartItemCount}
              </Badge>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                dispatch(clearCart());
              }}
              className="text-xs px-3 py-1"
            >
              Clear Cart
            </Button>
          </SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 py-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 py-2">
                    <div className="h-16 w-16 rounded-md bg-muted relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        // fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            Color: {item.variant.color.name}{" "}
                            <ColorCircle color={item.variant.color.hex} /> |
                            Size: {item.variant.size}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            dispatch(
                              removeFromCart({
                                id: item.id,
                                variantId: item.variant.id,
                              })
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Remove {item.name}</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => {
                              dispatch(
                                decreaseQuantity({
                                  id: item.id,
                                  variantId: item.variant.id,
                                })
                              );
                            }}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => {
                              dispatch(
                                increaseQuantity({
                                  id: item.id,
                                  variantId: item.variant.id,
                                })
                              );
                            }}
                            disabled={item.quantity >= item.variant.quantity}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <span className="font-medium">
                          PKR:{" "}
                          {(item.price * item.quantity).toLocaleString("en-PK")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>PKR:{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping == 0 ? "Free" : `PKR:${shipping}`}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>PKR:{total.toLocaleString()}</span>
                </div>
              </div>
              <SheetFooter>
                {status === "authenticated" ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      router.push("/checkout");
                      setIsOpen(false);
                    }}
                  >
                    Checkout{" "}
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={"/login"}>Login</Link>
                  </Button>
                )}
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <div className="relative mb-4 h-40 w-40 text-muted-foreground">
              <ShoppingCart
                className="absolute inset-0 h-full w-full"
                strokeWidth={1}
              />
            </div>
            <div className="text-xl font-medium">Your cart is empty</div>
            <div className="text-center text-sm text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </div>
            <Button onClick={() => setIsOpen(false)} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
