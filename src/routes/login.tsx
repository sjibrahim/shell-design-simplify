import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, User as UserIcon, ChevronDown, Building2, MapPin, Phone as PhoneIcon, Mail } from "lucide-react";
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
      <h2 className="text-center text-[28px] font-extrabold text-shell-red-dark">Welcome Back</h2>
      <p className="mt-1 text-center text-[14px] text-muted-foreground">Please login to your account</p>

      {err && (
        <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">
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

/* ---------------------------- Shared shell ---------------------------- */

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-shell-red-dark">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col bg-shell-red-dark">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#5a0c0f_0%,#7d1014_45%,#A8161A_100%)] px-6 pb-20 pt-12 text-white">
          <Cityscape />
          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={96} height={96} />
            </div>
            <h1 className="mt-3 text-[28px] font-extrabold leading-none tracking-[0.04em] text-white">
              SHELL COMPANY
            </h1>
            <div className="mt-3 flex items-center gap-3 text-[12px] font-bold tracking-[0.4em] text-shell-yellow">
              <span className="h-px w-8 bg-shell-yellow" />
              PHILIPPINES
              <span className="h-px w-8 bg-shell-yellow" />
            </div>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
              Building Trust. Delivering Value.
            </p>
          </div>
          {/* Bottom wave divider into white card */}
          <WaveDivider position="bottom" fill="#ffffff" accent />
        </section>

        {/* WHITE CARD */}
        <div className="relative -mt-10 px-5">
          <div className="rounded-2xl bg-white p-7 shadow-[0_22px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
            {children}
          </div>
        </div>

        {/* RED FOOTER with wave top */}
        <div className="relative mt-10 flex-1 bg-[linear-gradient(180deg,#7d1014_0%,#5a0c0f_100%)] pt-12">
          <div className="absolute inset-x-0 -top-1 rotate-180">
            <WaveDivider position="bottom" fill="#7d1014" accent />
          </div>
          <ContactFooter />
        </div>
      </div>
    </div>
  );
}

function WaveDivider({ fill, accent }: { position: "top" | "bottom"; fill: string; accent?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 leading-[0]">
      {accent && (
        <svg viewBox="0 0 500 30" preserveAspectRatio="none" className="absolute inset-x-0 bottom-3 h-3 w-full">
          <path d="M0,15 Q125,0 250,15 T500,15" stroke="#FFD500" strokeWidth="1.5" fill="none" opacity="0.85" />
        </svg>
      )}
      <svg viewBox="0 0 500 60" preserveAspectRatio="none" className="block h-10 w-full">
        <path d="M0,40 Q125,0 250,30 T500,20 L500,60 L0,60 Z" fill={fill} />
      </svg>
    </div>
  );
}

function Cityscape() {
  return (
    <svg aria-hidden viewBox="0 0 480 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-52 w-full opacity-20">
      <defs>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path fill="url(#bldg)" d="M0,200 L0,120 L30,120 L30,90 L60,90 L60,60 L95,60 L95,100 L120,100 L120,70 L150,70 L150,40 L185,40 L185,80 L215,80 L215,55 L245,55 L245,30 L275,30 L275,75 L305,75 L305,50 L340,50 L340,90 L370,90 L370,65 L400,65 L400,110 L430,110 L430,85 L460,85 L460,120 L480,120 L480,200 Z" />
      {Array.from({ length: 70 }).map((_, i) => {
        const x = ((i * 37) % 470) + 6;
        const y = 100 + ((i * 13) % 80);
        return <rect key={i} x={x} y={y} width="2" height="3" fill="#ffd34a" opacity={i % 4 === 0 ? 0.95 : 0.4} />;
      })}
    </svg>
  );
}

function ContactFooter() {
  return (
    <div className="px-6 pb-8 text-white/95">
      <div className="grid grid-cols-3 gap-3 text-center text-[11px] leading-snug">
        <FootItem icon={<MapPin size={18} />} label={<>25th Floor, Ayala<br/>Triangle Gardens<br/>Makati City,<br/>Philippines</>} />
        <FootItem icon={<PhoneIcon size={18} />} label={<>+63 2 8123 4567</>} />
        <FootItem icon={<Mail size={18} />} label={<>info@shellcompany.ph</>} />
      </div>
      <div className="mt-6 border-t border-white/15 pt-3 text-center text-[10px] font-semibold tracking-[0.18em] text-white/70">
        © {new Date().getFullYear()} SHELL COMPANY PHILIPPINES.
        <br />ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}

function FootItem({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-shell-yellow text-shell-red-dark shadow-md">
        {icon}
      </span>
      <span className="leading-tight">{label}</span>
    </div>
  );
}

/* ----------------------------- Form bits ----------------------------- */

export function FieldBox({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      {children}
    </div>
  );
}

export function PhoneField({ value, onChange, placeholder = "Mobile number" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-white pl-4 pr-3 py-3 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <UserIcon size={20} className="text-shell-red" />
      <div className="ml-1 flex items-center gap-0.5 text-[15px] font-extrabold text-shell-red">
        +63 <ChevronDown size={14} className="text-shell-red/70" />
      </div>
      <span className="mx-2 h-6 w-px bg-border" />
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
