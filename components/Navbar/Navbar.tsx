"use client";

import { Loader2, LogOut, Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { startTransition, useEffect, useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheet } from "./cart-sheet";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SearchBar from "../SearchBar";

// Sample cart data

export default function Navbar() {
  const [isLoggingOut, startLoggingOut] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { data: session, status } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart);
  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/collections?gender=men", label: "Men" },
    { href: "/collections?gender=women", label: "Women" },
    { href: "/collections?category=topwear", label: "Top Wear" },
    { href: "/collections?category=bottomwear", label: "Bottom Wear" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  E
                </span>
              </div>
              <span className="hidden font-bold text-xl sm:inline-block">
                EcoShop
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Mobile/Tablet */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* User Avatar */}
            {status == "loading" ? (
              <div>
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
              </div>
            ) : status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    {session?.user?.image ? (
                      <Image
                        width={60}
                        height={60}
                        src={session.user.image}
                        alt={session.user.name || "User Avatar"}
                      />
                    ) : null}
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={"/profile"}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-1">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="sm:px-3 py-1 text-xs md:text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="sm:px-3 py-1 text-xs md:text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Logout confirmation dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action will log you out of your account.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setShowLogoutDialog(false)}
                    disabled={isLoggingOut}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isLoggingOut}
                    onClick={() => {
                      startLoggingOut(async () => {
                        await signOut();
                        setShowLogoutDialog(false);
                      });
                    }}
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      "Logout"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Cart Sheet */}
            <CartSheet onUpdateQuantity={() => {}} onRemoveItem={() => {}} />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-3 sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">
                        E
                      </span>
                    </div>
                    <span>EcoShop</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="mt-6">
                  <SearchBar />
                </div>

                {/* Mobile Navigation Links */}
                <div className="mt-6 flex flex-col space-y-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile User Actions */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
