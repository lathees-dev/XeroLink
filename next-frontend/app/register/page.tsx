"use client";

import { useState } from "react";
import { api } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

type Role = "student" | "shop";

type ServiceInput = {
  name: string;
  price: string; // keep as string in state; convert to number on submit
};

type ServiceDTO = {
  name: string;
  price: number;
};

type BasePayload = {
  name: string;
  email: string;
  phone: string; // must be string for backend
  password: string;
  role: Role;
};

type StudentPayload = BasePayload & {
  role: "student";
};

type ShopPayload = BasePayload & {
  role: "shop";
  location: string;
  isOpen: boolean;
  services: ServiceDTO[];
};

type ExpressValidatorError = {
  type?: string;
  msg: string;
  path?: string;
  location?: string;
  value?: unknown;
};

type ValidationResponse = {
  errors: ExpressValidatorError[];
};

function isValidationResponse(x: unknown): x is ValidationResponse {
  if (typeof x !== "object" || x === null) return false;
  const maybe = x as { errors?: unknown };
  if (!Array.isArray(maybe.errors)) return false;
  // Basic shape check for each error entry
  return maybe.errors.every((e) => {
    if (typeof e !== "object" || e === null) return false;
    const entry = e as Record<string, unknown>;
    return typeof entry.msg === "string";
  });
}

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [role, setRole] = useState<Role>("student");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Shop-only fields
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [services, setServices] = useState<ServiceInput[]>([
    { name: "", price: "" },
  ]);

  function addServiceRow() {
    setServices((prev) => [...prev, { name: "", price: "" }]);
  }

  function removeServiceRow(index: number) {
    setServices((prev) => prev.filter((_, i) => i !== index));
  }

  function updateService(
    index: number,
    key: keyof ServiceInput,
    value: string
  ) {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Base payload
      const base: Omit<BasePayload, "role"> = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      };

      let payload: StudentPayload | ShopPayload;

      if (role === "shop") {
        const cleanedServices: ServiceDTO[] = services
          .map((s) => {
            const priceNumber = Number(s.price);
            return {
              name: s.name.trim(),
              price: priceNumber,
            };
          })
          .filter((s) => s.name.length > 0);

        // Client-side checks to avoid easy 400s
        if (!location.trim()) {
          throw new Error("location: Shop location required");
        }
        if (cleanedServices.length < 1) {
          throw new Error("services: At least one service is required");
        }
        if (
          cleanedServices.some((s) => !Number.isFinite(s.price) || s.price < 0)
        ) {
          throw new Error(
            "services.price: Each service needs a non-negative price"
          );
        }

        payload = {
          ...base,
          role: "shop",
          location: location.trim(),
          isOpen: Boolean(isOpen),
          services: cleanedServices,
        };
      } else {
        payload = {
          ...base,
          role: "student",
        };
      }

      await api.post("/auth/register", payload);
      router.push("/login");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data;

        if (isValidationResponse(data)) {
          const messages = data.errors.map((e) =>
            e.path ? `${e.path}: ${e.msg}` : e.msg
          );
          setError(messages.join("\n"));
        } else if (typeof data === "object" && data !== null) {
          const maybe = data as { error?: unknown; message?: unknown };
          const msg =
            (typeof maybe.error === "string" && maybe.error) ||
            (typeof maybe.message === "string" && maybe.message) ||
            "Registration failed. Please check your inputs.";
          setError(msg);
        } else {
          setError("Registration failed. Please check your inputs.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow rounded p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-lg font-semibold">Register</h1>

        {error && (
          <pre className="whitespace-pre-wrap text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </pre>
        )}

        <div className="grid gap-3">
          <input
            className="border w-full rounded px-3 py-2 text-sm"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="border w-full rounded px-3 py-2 text-sm"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="border w-full rounded px-3 py-2 text-sm"
            placeholder="Phone (as digits)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="password"
            className="border w-full rounded px-3 py-2 text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">
            Password must be strong: at least 8 characters with uppercase,
            lowercase, number, and symbol.
          </p>

          <select
            className="border w-full rounded px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="student">Student</option>
            <option value="shop">Shop</option>
          </select>
        </div>

        {role === "shop" && (
          <div className="space-y-3 border-t pt-4">
            <h2 className="text-sm font-medium">Shop Details</h2>

            <input
              className="border w-full rounded px-3 py-2 text-sm"
              placeholder="Shop location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required={role === "shop"}
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
              />
              Currently open
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Services</span>
                <button
                  type="button"
                  onClick={addServiceRow}
                  className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                >
                  + Add Service
                </button>
              </div>

              <div className="space-y-2">
                {services.map((svc, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_120px_32px] gap-2 items-center"
                  >
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Service name"
                      value={svc.name}
                      onChange={(e) =>
                        updateService(idx, "name", e.target.value)
                      }
                    />
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Price"
                      type="number"
                      min={0}
                      step="0.01"
                      value={svc.price}
                      onChange={(e) =>
                        updateService(idx, "price", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeServiceRow(idx)}
                      className="text-red-600 text-sm"
                      aria-label="Remove service"
                      title="Remove service"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Add at least one service. Each service needs a name and a
                non-negative price.
              </p>
            </div>
          </div>
        )}

        <button
          disabled={submitting}
          className="bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white w-full py-2 rounded text-sm hover:bg-green-700"
        >
          {submitting ? "Creating..." : "Create Account"}
        </button>
      </form>
    </main>
  );
}
