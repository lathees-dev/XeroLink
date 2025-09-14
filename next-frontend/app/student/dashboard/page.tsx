"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/store/authStore";

export default function StudentDashboard() {
  return (
    <AuthGuard roles={["student"]}>
      <StudentContent />
    </AuthGuard>
  );
}

function StudentContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data.orders))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hi {user?.email}</h1>
        <Link
          href="/student/orders/new"
          className="text-sm bg-blue-600 text-white px-3 py-2 rounded"
        >
          New Order
        </Link>
      </div>
      <div className="grid gap-3">
        {orders.map((o) => (
          <Link
            key={o._id}
            href={`/student/orders/${o._id}`}
            className="border rounded p-3 bg-white hover:shadow text-sm"
          >
            <p className="font-medium">{o.documentName || "Order"}</p>
            <p className="text-xs text-gray-500">Status: {o.status}</p>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-gray-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
