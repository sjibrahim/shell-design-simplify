import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getToken } from "@/lib/admin-api";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getToken()) {
      navigate({ to: "/admin/login" });
    } else {
      setReady(true);
    }
  }, [navigate]);
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking session…
      </div>
    );
  }
  return <>{children}</>;
}
