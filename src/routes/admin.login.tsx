import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { apiPost, setToken, setStoredAdmin, type AdminUser } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Shell Oil" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@shell.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const res = await apiPost<{ ok: true; token: string; admin: AdminUser }>("/api/auth/login", { email, password });
      setToken(res.token); setStoredAdmin(res.admin);
      navigate({ to: "/admin" });
    } catch (e) { setErr((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white shadow">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-lg font-extrabold">Shell Admin Panel</h1>
          <p className="text-xs text-slate-500">Sign in to manage your platform</p>
        </div>
        {err && <div className="mb-3 rounded-md bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{err}</div>}
        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required />
        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required />
        <button disabled={loading} className="w-full rounded-md bg-shell-red py-2.5 text-sm font-bold text-white hover:bg-shell-red-dark disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-3 text-center text-[10px] text-slate-400">Default: admin@shell.com / admin123</p>
      </form>
    </div>
  );
}
