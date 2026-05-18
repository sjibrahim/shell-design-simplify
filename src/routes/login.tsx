import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Phone, ShieldCheck, Sparkles } from "lucide-react";
import shellLogo from "@/assets/shell-logo.png";
import { loginUser } from "@/lib/user-api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Shell Oil" },
      { name: "description", content: "Sign in to your Shell Oil investment account." },
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
      <Tabs active="login" />
      <form onSubmit={submit} className="mt-5 space-y-4">
        {err && (
          <div className="rounded-2xl bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
            {err}
          </div>
        )}
        <Field label="Phone Number" icon={<Phone size={18} />}>
          <span className="pl-2 pr-1 text-sm font-extrabold text-shell-red">+63</span>
          <span className="mr-2 h-5 w-px bg-border" />
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="9XX XXX XXXX"
            required
            autoComplete="tel"
          />
        </Field>
        <Field label="Password" icon={<Lock size={18} />}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            required
            autoComplete="current-password"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground" aria-label="Toggle password">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </Field>

        <button
          disabled={loading}
          className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-extrabold tracking-wide text-white shadow-lg shadow-shell-red/30 transition active:scale-[0.99] disabled:opacity-60"
        >
          <span className="relative">{loading ? "Signing in…" : "Sign In"}</span>
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        New to Shell Oil?{" "}
        <Link to="/register" className="font-extrabold text-shell-red underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>

      <TrustBar />
    </AuthShell>
  );
}

/* ---------- shared shell + bits ---------- */

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-[#FAF4E6] shadow-xl">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-b-[2.75rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_60%,#7d0f12_100%)] px-6 pb-24 pt-10 text-white">
          <span className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <span className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-shell-yellow/15 blur-2xl" />
          <span className="pointer-events-none absolute right-10 top-6 h-2 w-2 rounded-full bg-shell-yellow/80" />
          <span className="pointer-events-none absolute left-12 top-16 h-1.5 w-1.5 rounded-full bg-white/60" />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/15 p-2.5 backdrop-blur-md ring-1 ring-white/20">
              <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={96} height={96} />
              <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-shell-yellow text-shell-red-dark shadow-md">
                <Sparkles size={14} strokeWidth={2.6} />
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
              Shell<span className="text-shell-yellow">Oil</span>
            </h1>
            <p className="mt-1 text-sm text-white/85">Fueling progress · Earning every day</p>
          </div>
        </section>

        {/* CARD */}
        <div className="-mt-16 px-4 pb-10">
          <div className="space-y-1 rounded-[28px] bg-white p-5 shadow-[0_18px_50px_-12px_rgba(221,29,33,0.25)] ring-1 ring-black/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tabs({ active }: { active: "login" | "register" }) {
  return (
    <div className="relative flex items-center rounded-2xl border border-border bg-secondary/50 p-1.5">
      <Link
        to="/login"
        className={`relative z-10 flex-1 rounded-xl py-2.5 text-center text-sm font-extrabold tracking-wide transition ${
          active === "login" ? "bg-gradient-to-r from-shell-red to-shell-red-dark text-white shadow-md" : "text-muted-foreground"
        }`}
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className={`relative z-10 flex-1 rounded-xl py-2.5 text-center text-sm font-extrabold tracking-wide transition ${
          active === "register" ? "bg-gradient-to-r from-shell-red to-shell-red-dark text-white shadow-md" : "text-muted-foreground"
        }`}
      >
        Register
      </Link>
    </div>
  );
}

export function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 px-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="group flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 py-2.5 pl-2 pr-3 transition focus-within:border-shell-red/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-shell-red/15">
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white shadow-sm">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export function TrustBar() {
  return (
    <div className="mt-5 flex items-center justify-center gap-1.5 rounded-2xl bg-shell-yellow-soft py-2.5 text-[11px] font-bold text-[#8a6500]">
      <ShieldCheck size={13} /> Secured by Shell Pilipinas · 256-bit SSL
    </div>
  );
}
