"use client";
import { useState } from "react";
import { api } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow rounded p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-lg font-semibold">Register</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          className="border w-full rounded px-3 py-2 text-sm"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          type="password"
          className="border w-full rounded px-3 py-2 text-sm"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <select
          className="border w-full rounded px-3 py-2 text-sm"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
        >
          <option value="student">Student</option>
          <option value="shop">Shop</option>
        </select>
        <button className="bg-green-600 text-white w-full py-2 rounded text-sm hover:bg-green-700">
          Create Account
        </button>
      </form>
    </main>
  );
}
