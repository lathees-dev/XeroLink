"use client";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import Link from "next/link";

export default function ShopDashboard() {
  return (
    <AuthGuard roles={["shop"]}>
      <ShopContent />
    </AuthGuard>
  );
}

function ShopContent() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // If you add a shop-specific orders endpoint later, update here.
    api
      .get("/orders") // Might need a shop filter endpoint eventually
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Shop Dashboard</h1>
      <Link
        href="/shop/services"
        className="inline-block text-sm bg-green-600 text-white px-3 py-2 rounded"
      >
        Manage Services
      </Link>
      <div className="space-y-2">
        <p className="font-medium text-sm">Recent Orders:</p>
        {orders.map((o) => (
          <div key={o._id} className="border rounded p-3 bg-white text-xs">
            <p>{o.documentName || "Order"}</p>
            <p>Status: {o.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
