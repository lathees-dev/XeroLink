"use client";
import { useState } from "react";
import { api } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      login({ user: res.data.user, token: res.data.token });
      router.push(
        res.data.user.role === "shop" ? "/shop/dashboard" : "/student/dashboard"
      );
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "error" in err.response.data) {
        setError((err as { response: { data: { error: string } } }).response.data.error);
      } else {
        setError("Login failed");
      }
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow rounded p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-lg font-semibold">Login</h1>
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
        <button className="bg-blue-600 text-white w-full py-2 rounded text-sm hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </main>
  );
}
