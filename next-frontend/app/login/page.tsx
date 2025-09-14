"use client";

import { useState } from "react";
import { api } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

type Role = "student" | "shop";

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
  return maybe.errors.every((e) => {
    if (typeof e !== "object" || e === null) return false;
    return typeof (e as { msg?: unknown }).msg === "string";
  });
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload: { email: string; password: string; role: Role } = {
        email: email.trim(),
        password,
        role,
      };

      const res = await api.post("/auth/login", payload);
      login({ user: res.data.user, token: res.data.token });

      router.push(
        res.data.user.role === "shop" ? "/shop/dashboard" : "/student/dashboard"
      );
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
            (err.response?.status === 401
              ? "Invalid credentials"
              : "Login failed. Please check your inputs.");
          setError(msg);
        } else {
          setError(
            err.response?.status === 401
              ? "Invalid credentials"
              : "Login failed. Please try again."
          );
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow rounded p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-lg font-semibold">Login</h1>

        {error && (
          <pre className="whitespace-pre-wrap text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </pre>
        )}

        <input
          className="border w-full rounded px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <select
          className="border w-full rounded px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="student">Student</option>
          <option value="shop">Shop</option>
        </select>

        <button
          disabled={submitting}
          className="bg-blue-600 text-white w-full py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
