import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { AuthShell, FieldBox, PhoneField } from "@/components/AuthShell";
import { loginUser } from "@/lib/user-api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Shell Company Philippines" },
      { name: "description", content: "Sign in to your Shell Company Philippines account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const u = await loginUser(phone.trim(), password);
      setUser(u);
      navigate({ to: "/" });
    } catch (e) { setErr((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell>
      <h2 className="text-center text-[26px] font-extrabold text-shell-red">Welcome Back</h2>
      <p className="mt-1 text-center text-[14px] text-muted-foreground">Please login to your account</p>

      {err && (
        <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-700 ring-1 ring-rose-200">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <PhoneField value={phone} onChange={setPhone} />

        <FieldBox icon={<Lock size={20} className="text-shell-red" />}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
            className="flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="px-1 text-muted-foreground" aria-label="Toggle password">
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </FieldBox>

        <div className="flex items-center justify-between pt-0.5">
          <label className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground/80">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-shell-red"
            />
            Remember me
          </label>
          <button type="button" className="text-[13px] font-bold text-shell-red hover:underline">
            Forgot Password?
          </button>
        </div>

        <button
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-shell-red to-shell-red-dark py-4 text-[15px] font-extrabold tracking-[0.22em] text-white shadow-lg shadow-shell-red/30 transition active:scale-[0.99] disabled:opacity-60"
        >
          <Lock size={16} />
          {loading ? "SIGNING IN…" : "LOGIN"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-bold tracking-[0.25em] text-muted-foreground">OR</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          to="/register"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-shell-red bg-white py-4 text-[13.5px] font-extrabold tracking-[0.2em] text-shell-red transition hover:bg-shell-red/5"
        >
          <Building2 size={15} />
          CREATE NEW ACCOUNT
        </Link>
      </form>
    </AuthShell>
  );
}
