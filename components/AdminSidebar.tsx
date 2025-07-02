"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  LogOut,
  Notebook,
  ShoppingBag,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminSidebar() {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar variant="inset" className="py-4 shadow-lg" collapsible="offcanvas">
      <SidebarHeader className="">
        <h1>Logo</h1>
        <div className="flex my-3 items-center justify-between">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Admin Dashboard
          </h2>

          <Button
            className=" md:hidden text-center "
            size={"icon"}
            variant={"ghost"}
            onClick={() => toggleSidebar()}
          >
            <X />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton asChild>
                <Link href={"/admin/dashboard"}>
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild>
                <Link href={"/admin/dashboard/users"}>
                  <Users />
                  Users
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild>
                <Link href={"/admin/dashboard/products"}>
                  <User />
                  Products
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild>
                <Link href={"/admin/dashboard/orders"}>
                  <Notebook />
                  Orders
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild>
                <Link href={"/"}>
                  <ShoppingBag />
                  Shop
                </Link>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AdminLogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
