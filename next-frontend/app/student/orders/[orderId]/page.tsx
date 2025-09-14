"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Link from "next/link";

export default function OrderDetailWrapper() {
  return (
    <AuthGuard roles={["student"]}>
      <OrderDetail />
    </AuthGuard>
  );
}

function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data.order))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-6 text-sm">Loading...</div>;
  if (!order) return <div className="p-6 text-sm">Order not found.</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">Order #{order._id}</h1>
      <p className="text-sm">Status: {order.status}</p>
      {order.services?.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium text-sm">Services:</p>
          <ul className="list-disc pl-5 text-xs">
            {order.services.map((s: any, idx: number) => (
              <li key={idx}>
                {s.name} x {s.quantity} @ {s.price}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link
        href={`/student/orders/${order._id}/payments`}
        className="text-sm text-blue-600 underline"
      >
        View / Make Payment
      </Link>
    </div>
  );
}
