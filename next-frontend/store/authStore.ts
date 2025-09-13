import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "student" | "shop" | "admin";

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
  shopId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (payload: { user: User; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ user, token }) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("xl_token", token);
        }
        set({ user, token });
      },
      logout: () => {
        if (typeof window !== "undefined") localStorage.removeItem("xl_token");
        set({ user: null, token: null });
      }
    }),
    { name: "xl-auth" }
  )
);