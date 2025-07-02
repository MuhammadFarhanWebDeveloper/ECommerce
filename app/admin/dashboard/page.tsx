import { getAdminDashboardStats } from "@/lib/actions/products";
import React from "react";

export default async function AdminDashboardPage() {
  const { totalRevenue, totalOrders, totalProducts } = await getAdminDashboardStats();

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="p-3 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-2 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Revenue</h2>
          <h2 className="text-lg font-semibold">PKR {totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="p-2 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <h2 className="text-lg font-semibold">{totalOrders}</h2>
        </div>
        <div className="p-2 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Total Products</h2>
          <h2 className="text-lg font-semibold">{totalProducts}</h2>
        </div>
      </div>
    </div>
  );
}
