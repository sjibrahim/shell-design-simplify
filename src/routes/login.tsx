import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, User as UserIcon, MapPin, Phone as PhoneIcon, Mail, ChevronDown } from "lucide-react";
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
    <AuthShell title="Welcome Back" subtitle="Please login to your account">
      <form onSubmit={submit} className="mt-5 space-y-3.5">
        {err && (
          <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
            {err}
          </div>
        )}

        <PhoneField value={phone} onChange={setPhone} placeholder="Mobile number" />

        <FieldBox icon={<Lock size={18} className="text-shell-red" />}>
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

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground/80">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-shell-red"
            />
            Remember me
          </label>
          <button type="button" className="text-[13px] font-semibold text-shell-red hover:underline">
            Forgot Password?
          </button>
        </div>

        <button
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-shell-red to-shell-red-dark py-3.5 text-[15px] font-extrabold tracking-wider text-white shadow-lg shadow-shell-red/30 transition active:scale-[0.99] disabled:opacity-60"
        >
          <Lock size={16} />
          {loading ? "SIGNING IN…" : "LOGIN"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          to="/register"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-shell-red/90 bg-white py-3.5 text-[14px] font-extrabold tracking-wider text-shell-red transition hover:bg-shell-red/5"
        >
          <UserIcon size={16} />
          CREATE NEW ACCOUNT
        </Link>
      </form>
    </AuthShell>
  );
}

/* ---------------------------- Shared shell ---------------------------- */

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-shell-red-dark">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-shell-red-dark">
        {/* HERO with cityscape silhouette */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#7d0f12_0%,#A8161A_55%,#DD1D21_100%)] px-6 pb-20 pt-12 text-white">
          <Cityscape />
          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 p-3 backdrop-blur-sm ring-1 ring-white/20">
              <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={96} height={96} />
            </div>
            <h1 className="mt-5 text-[26px] font-extrabold tracking-[0.04em]">SHELL COMPANY</h1>
            <div className="mt-1 flex items-center gap-2 text-[12px] font-bold tracking-[0.32em] text-shell-yellow">
              <span className="h-px w-6 bg-shell-yellow/70" />
              PHILIPPINES
              <span className="h-px w-6 bg-shell-yellow/70" />
            </div>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
              Building Trust · Delivering Value
            </p>
          </div>
        </section>

        {/* WHITE CARD */}
        <div className="-mt-14 px-4">
          <div className="rounded-2xl bg-white p-6 shadow-[0_22px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
            <h2 className="text-center text-[22px] font-extrabold text-shell-red-dark">{title}</h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">{subtitle}</p>
            {children}
          </div>
        </div>

        {/* FOOTER CONTACT */}
        <ContactFooter />
      </div>
    </div>
  );
}

function Cityscape() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 480 200"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-44 w-full opacity-25"
    >
      <defs>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        fill="url(#bldg)"
        d="M0,200 L0,120 L30,120 L30,90 L60,90 L60,60 L95,60 L95,100 L120,100 L120,70 L150,70 L150,40 L185,40 L185,80 L215,80 L215,55 L245,55 L245,30 L275,30 L275,75 L305,75 L305,50 L340,50 L340,90 L370,90 L370,65 L400,65 L400,110 L430,110 L430,85 L460,85 L460,120 L480,120 L480,200 Z"
      />
      {/* window dots */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 37) % 470 + 6;
        const y = 110 + ((i * 13) % 70);
        return <rect key={i} x={x} y={y} width="2" height="3" fill="#ffd34a" opacity={(i % 4) === 0 ? 0.9 : 0.35} />;
      })}
    </svg>
  );
}

function ContactFooter() {
  return (
    <div className="mt-6 px-6 pb-8 text-white/90">
      <div className="grid grid-cols-3 gap-3 text-center text-[11px] leading-tight">
        <FootItem icon={<MapPin size={16} />} label="25th Floor, Ayala Triangle, Makati City" />
        <FootItem icon={<PhoneIcon size={16} />} label="+63 2 8123 4567" />
        <FootItem icon={<Mail size={16} />} label="info@shellcompany.ph" />
      </div>
      <div className="mt-5 border-t border-shell-yellow/30 pt-3 text-center text-[10px] font-semibold tracking-wider text-white/70">
        © {new Date().getFullYear()} SHELL COMPANY PHILIPPINES · ALL RIGHTS RESERVED
      </div>
    </div>
  );
}

function FootItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-shell-yellow text-shell-red-dark shadow">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

/* ----------------------------- Form bits ----------------------------- */

export function FieldBox({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-3 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <span className="flex h-7 w-7 items-center justify-center">{icon}</span>
      {children}
    </div>
  );
}

export function PhoneField({ value, onChange, placeholder = "Mobile number" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-white pl-3 pr-3 py-2.5 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <UserIcon size={18} className="text-shell-red" />
      <div className="ml-2 flex items-center gap-0.5 text-[15px] font-bold text-shell-red-dark">
        +63 <ChevronDown size={14} className="text-shell-red/70" />
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
        className="flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
