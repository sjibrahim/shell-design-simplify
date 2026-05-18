import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { getUserToken } from "@/lib/user-api";

// Routes that do NOT require user login
const PUBLIC = new Set<string>(["/login", "/register", "/about", "/app-download"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const isAdmin = pathname.startsWith("/admin");
  const isPublic = PUBLIC.has(pathname) || isAdmin;

  useEffect(() => {
    if (!hydrated || isPublic) return;
    const hasToken = !!getUserToken();
    if (!hasToken && !user) {
      navigate({ to: "/login" });
    }
  }, [hydrated, pathname, isPublic, loading, user, navigate]);

  return <>{children}</>;
}
