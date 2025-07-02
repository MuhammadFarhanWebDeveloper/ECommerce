import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <SidebarProvider>
        <AdminSidebar />
      <div className="w-full p-3">
        {children}
      </div>
    </SidebarProvider>
  );
}
