"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function PaymentPageWrapper() {
  return (
    <AuthGuard roles={["student"]}>
      <PaymentPage />
    </AuthGuard>
  );
}

function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [payments, setPayments] = useState<any[]>([]);
  const [order, setOrder] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  function load() {
    api
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => {});
    api
      .get(`/payments/order/${orderId}`)
      .then((res) => setPayments(res.data))
      .catch(() => {});
  }

  useEffect(() => {
    load();
  }, [orderId]);

  async function createPayment() {
    if (!order) return;
    setCreating(true);
    setError("");
    try {
      await api.post("/payments/create", {
        orderId,
        userId: order.userId,
        amount: order.amount || 0,
        method: "UPI",
        transactionId: `TXN_${Date.now()}`,
      });
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || "Payment creation failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold">Payments for Order #{orderId}</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {order && (
        <p className="text-sm">
          Order Status: {order.status} | Payment Status: {order.paymentStatus}
        </p>
      )}
      <button
        onClick={createPayment}
        disabled={creating}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {creating ? "Creating..." : "Initiate Payment"}
      </button>
      <div className="space-y-2">
        <p className="font-medium text-sm">Payment Records:</p>
        {payments.length === 0 && (
          <p className="text-xs text-gray-500">No payments yet.</p>
        )}
        {payments.map((p) => (
          <div
            key={p._id}
            className="border rounded p-3 bg-white text-xs space-y-1"
          >
            <p>ID: {p._id}</p>
            <p>Amount: {p.amount}</p>
            <p>Status: {p.status}</p>
            <p>Method: {p.method}</p>
            <p>Txn: {p.transactionId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
