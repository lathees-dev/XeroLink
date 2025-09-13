"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (roles && !roles.includes(user.role)) router.replace("/login");
  }, [user, roles, router]);

  if (!user) return <div className="p-6 text-sm">Authenticating...</div>;
  if (roles && !roles.includes(user.role))
    return <div className="p-6 text-sm">Unauthorized</div>;

  return <>{children}</>;
}
