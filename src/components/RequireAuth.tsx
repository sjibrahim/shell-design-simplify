import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { getUserToken } from "@/lib/user-api";

// Routes that do NOT require user login
const PUBLIC = new Set<string>(["/login", "/register", "/about", "/app-download"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const isAdmin = pathname.startsWith("/admin");
  const isPublic = PUBLIC.has(pathname) || isAdmin;

  useEffect(() => {
    if (isPublic) return;
    // No token at all → redirect immediately
    if (!getUserToken()) {
      navigate({ to: "/login" });
      return;
    }
    // Token present but session check finished and user is null → redirect
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [pathname, isPublic, loading, user, navigate]);

  if (!isPublic && !getUserToken()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBF0] text-sm text-muted-foreground">
        Redirecting to sign in…
      </div>
    );
  }

  return <>{children}</>;
}
