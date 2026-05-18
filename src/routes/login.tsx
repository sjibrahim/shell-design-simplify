import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, User as UserIcon, ChevronDown, LogIn, ShieldCheck } from "lucide-react";
import shellLogo from "@/assets/shell-logo.png";
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
  const [remember, setRemember] = useState(true);
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
      <div className="px-5 pt-4">
        <h2 className="text-[20px] font-extrabold text-shell-red-dark">Welcome back</h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Sign in to continue to your account</p>
      </div>

      <form onSubmit={submit} className="space-y-3 p-5 pt-4">
        {err && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">
            {err}
          </div>
        )}

        <PhoneField value={phone} onChange={setPhone} />

        <FieldBox icon={<Lock size={17} className="text-shell-red" />}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
            className="flex-1 bg-transparent text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="px-1 text-muted-foreground" aria-label="Toggle password">
            {show ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
        </FieldBox>

        <div className="flex items-center justify-between pt-0.5">
          <label className="inline-flex items-center gap-2 text-[12px] font-medium text-foreground/80">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-shell-red"
            />
            Remember me
          </label>
          <button type="button" className="text-[12px] font-semibold text-shell-red hover:underline">
            Forgot password?
          </button>
        </div>

        <button
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-shell-red to-shell-red-dark py-3 text-[14px] font-extrabold tracking-wider text-white shadow-md shadow-shell-red/30 transition active:scale-[0.99] disabled:opacity-60"
        >
          <LogIn size={15} />
          {loading ? "SIGNING IN…" : "LOGIN"}
        </button>

        <div className="flex items-center gap-3 py-0.5">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">new here</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          to="/register"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-shell-red/80 bg-white py-3 text-[13px] font-extrabold tracking-wider text-shell-red transition hover:bg-shell-red/5"
        >
          CREATE NEW ACCOUNT
        </Link>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[10.5px] font-semibold text-muted-foreground">
          <ShieldCheck size={12} className="text-shell-green" />
          Secured by Shell Company Philippines
        </div>
      </form>
    </AuthShell>
  );
}

/* ---------------------------- Shared shell ---------------------------- */

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-shell-red-dark">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-shell-red-dark">
        {/* compact hero (fixed height, no overlap with card) */}
        <section className="relative shrink-0 overflow-hidden bg-[linear-gradient(180deg,#7d0f12_0%,#A8161A_60%,#DD1D21_100%)] px-6 pb-8 pt-9 text-white">
          <span className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-shell-yellow/10" />
          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 p-2 ring-1 ring-white/25 backdrop-blur-sm">
              <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={64} height={64} />
            </div>
            <h1 className="mt-3 text-[18px] font-extrabold tracking-[0.06em]">SHELL COMPANY</h1>
            <div className="mt-0.5 flex items-center gap-2 text-[9.5px] font-bold tracking-[0.32em] text-shell-yellow">
              <span className="h-px w-5 bg-shell-yellow/60" />
              PHILIPPINES
              <span className="h-px w-5 bg-shell-yellow/60" />
            </div>
          </div>
        </section>

        {/* card pinned below hero — NO negative margin → no overlap */}
        <main className="flex-1 rounded-t-[1.75rem] bg-white shadow-[0_-12px_30px_-15px_rgba(0,0,0,0.25)]">
          {children}
        </main>

        <footer className="px-6 py-3 text-center text-[9.5px] font-semibold tracking-wider text-white/70">
          © {new Date().getFullYear()} SHELL COMPANY PHILIPPINES
        </footer>
      </div>
    </div>
  );
}

/* ----------------------------- Form bits ----------------------------- */

export function FieldBox({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      {children}
    </div>
  );
}

export function PhoneField({ value, onChange, placeholder = "Mobile number" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-white pl-3 pr-3 py-2 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <UserIcon size={17} className="text-shell-red" />
      <div className="ml-2 flex items-center gap-0.5 text-[14px] font-bold text-shell-red-dark">
        +63 <ChevronDown size={13} className="text-shell-red/70" />
      </div>
      <span className="mx-2 h-5 w-px bg-border" />
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        required
        autoComplete="tel"
        className="flex-1 bg-transparent text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
