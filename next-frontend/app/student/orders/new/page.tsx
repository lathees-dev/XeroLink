"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrderForm } from "@/components/forms/OrderForm";

export default function NewOrderPage() {
  return (
    <AuthGuard roles={["student"]}>
      <OrderFormLoader />
    </AuthGuard>
  );
}

function OrderFormLoader() {
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/shops")
      .then((res) => setShops(res.data.shops || res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedShop) {
      setServices([]);
      return;
    }
    api
      .get(`/shops/${selectedShop}`)
      .then((res) => setServices(res.data.shop?.services || []))
      .catch(() => setServices([]));
  }, [selectedShop]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Create Order</h1>
      <OrderForm
        shops={shops}
        services={services}
        onShopChange={(id) => setSelectedShop(id)}
      />
    </div>
  );
}
