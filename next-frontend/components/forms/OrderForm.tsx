"use client";
import { useState } from "react";
import { api } from "@/lib/apiClient";
import { endpoints } from "@/lib/endpoints";
import { useRouter } from "next/navigation";

interface OrderFormProps {
  shops: any[];
  services: any[];
  onShopChange: (id: string) => void;
}

export function OrderForm({ shops, services, onShopChange }: OrderFormProps) {
  const router = useRouter();
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedServices, setSelectedServices] = useState<
    { serviceId: string; quantity: number }[]
  >([]);
  const [form, setForm] = useState({
    copies: 1,
    colorMode: "black_white",
    outputType: "plain",
    specialInstructions: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleService(serviceId: string) {
    setSelectedServices((prev) => {
      const existing = prev.find((p) => p.serviceId === serviceId);
      if (existing) {
        return prev.filter((p) => p.serviceId !== serviceId);
      }
      return [...prev, { serviceId, quantity: 1 }];
    });
  }

  function updateQuantity(serviceId: string, qty: number) {
    setSelectedServices((prev) =>
      prev.map((p) => (p.serviceId === serviceId ? { ...p, quantity: qty } : p))
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShop) return setError("Select a shop");
    if (!files || files.length === 0)
      return setError("At least one document is required");
    if (selectedServices.length === 0)
      return setError("Select at least one service");

    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("shopId", selectedShop);
      fd.append("copies", String(form.copies));
      fd.append("colorMode", form.colorMode);
      fd.append("outputType", form.outputType);
      fd.append("specialInstructions", form.specialInstructions);
      fd.append("services", JSON.stringify(selectedServices));
      Array.from(files).forEach((file) => fd.append("documents", file));

      const res = await api.post(endpoints.orders.create, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push(`/student/orders/${res.data.order._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Order creation failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 bg-white p-5 rounded shadow text-sm"
    >
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="font-medium block mb-1">Shop</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedShop}
          onChange={(e) => {
            setSelectedShop(e.target.value);
            onShopChange(e.target.value);
          }}
        >
          <option value="">Select shop</option>
          {shops.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium block mb-1">Documents</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Copies</label>
          <input
            type="number"
            min={1}
            className="border rounded px-2 py-1 w-full"
            value={form.copies}
            onChange={(e) =>
              setForm((f) => ({ ...f, copies: Number(e.target.value) }))
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Color Mode</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={form.colorMode}
            onChange={(e) =>
              setForm((f) => ({ ...f, colorMode: e.target.value }))
            }
          >
            <option value="black_white">Black & White</option>
            <option value="color">Color</option>
            <option value="grayscale">Grayscale</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Output Type</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={form.outputType}
          onChange={(e) =>
            setForm((f) => ({ ...f, outputType: e.target.value }))
          }
        >
          <option value="plain">Plain</option>
          <option value="spiral">Spiral</option>
          <option value="calico">Calico</option>
          <option value="stapled">Stapled</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Services</label>
        <div className="space-y-2">
          {services.map((svc) => {
            const selected = selectedServices.find(
              (s) => s.serviceId === svc._id
            );
            return (
              <div
                key={svc._id}
                className="flex items-center justify-between border rounded p-2"
              >
                <div>
                  <p className="font-medium">{svc.name}</p>
                  <p className="text-xs text-gray-500">Price: {svc.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selected && (
                    <input
                      type="number"
                      min={1}
                      className="w-16 border rounded px-1 py-0.5"
                      value={selected.quantity}
                      onChange={(e) =>
                        updateQuantity(svc._id, Number(e.target.value))
                      }
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => toggleService(svc._id)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    {selected ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
            );
          })}
          {services.length === 0 && (
            <p className="text-xs text-gray-500">
              Select a shop to load services.
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Special Instructions</label>
        <textarea
          className="border rounded w-full px-2 py-2"
          rows={3}
          value={form.specialInstructions}
          onChange={(e) =>
            setForm((f) => ({ ...f, specialInstructions: e.target.value }))
          }
        />
      </div>

      <button
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        {submitting ? "Submitting..." : "Submit Order"}
      </button>
    </form>
  );
}
