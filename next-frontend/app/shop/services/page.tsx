"use client";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";

export default function ServicesPage() {
  return (
    <AuthGuard roles={["shop"]}>
      <ServicesContent />
    </AuthGuard>
  );
}

function ServicesContent() {
  const user = useAuthStore((s) => s.user);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [error, setError] = useState("");

  async function load() {
    if (!user?.shopId) return;
    api
      .get(`/shops/${user.shopId}`)
      .then((res) => setServices(res.data.shop?.services || []))
      .catch(() => {});
  }

  useEffect(() => {
    load();
  }, [user?.shopId]);

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.shopId) return;
    setError("");
    try {
      await api.post(`/shops/${user.shopId}/services`, {
        name: form.name,
        price: Number(form.price),
      });
      setForm({ name: "", price: "" });
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add service");
    }
  }

  async function removeService(id: string) {
    if (!user?.shopId) return;
    try {
      await api.delete(`/shops/${user.shopId}/services/${id}`);
      load();
    } catch {
      setError("Failed to remove service");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold">Services</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={addService} className="flex gap-2 items-end">
        <div className="flex flex-col">
          <label className="text-xs mb-1">Name</label>
          <input
            className="border rounded px-2 py-1 text-sm"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs mb-1">Price</label>
          <input
            className="border rounded px-2 py-1 text-sm"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>
        <button className="bg-blue-600 text-white text-sm px-3 py-2 rounded">
          Add
        </button>
      </form>

      <div className="space-y-2">
        {services.map((svc) => (
          <div
            key={svc._id}
            className="flex items-center justify-between border rounded p-3 bg-white text-sm"
          >
            <div>
              <p className="font-medium">{svc.name}</p>
              <p className="text-xs text-gray-500">Price: {svc.price}</p>
            </div>
            <button
              onClick={() => removeService(svc._id)}
              className="text-xs text-red-600 underline"
            >
              Delete
            </button>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-xs text-gray-500">No services yet.</p>
        )}
      </div>
    </div>
  );
}
