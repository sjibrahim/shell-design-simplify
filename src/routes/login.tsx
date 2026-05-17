import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import shellLogo from "@/assets/shell-logo.png";

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
  const [show, setShow] = useState(false);
  return (
    <AuthShell title="Shell Oil" subtitle="Welcome back — sign in to continue">
      <Tabs active="login" />
      <Field label="PHONE NUMBER">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3.5">
          <span className="font-extrabold text-shell-red">+63</span>
          <span className="h-5 w-px bg-border" />
          <input
            type="tel"
            inputMode="numeric"
            defaultValue="8210192247"
            className="flex-1 bg-transparent text-base font-bold text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Phone number"
          />
        </div>
      </Field>
      <Field label="PASSWORD">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 py-2 pl-2 pr-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white">
            <Lock size={18} />
          </span>
          <input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            className="flex-1 bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setShow((s) => !s)} className="text-muted-foreground" aria-label="Toggle password">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </Field>
      <button className="mt-2 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md transition active:scale-[0.99]">
        Sign In
      </button>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-bold text-shell-red underline">
          Register here
        </Link>
      </p>
    </AuthShell>
  );
}

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
    <div className="min-h-screen bg-[#FFFBF0]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#FAF4E6] shadow-xl">
        <section className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-6 pb-20 pt-12 text-center text-white">
          <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-shell-yellow/10" />
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 p-2 backdrop-blur">
              <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={96} height={96} />
            </div>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-white/80">{subtitle}</p>
          </div>
        </section>
        <div className="-mt-12 px-4 pb-10">
          <div className="space-y-4 rounded-3xl bg-white p-5 shadow-[0_10px_40px_-10px_rgba(221,29,33,0.2)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tabs({ active }: { active: "login" | "register" }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-border bg-secondary/40 p-1.5">
      <Link
        to="/login"
        className={`flex-1 rounded-xl py-2.5 text-center text-sm font-bold transition ${
          active === "login" ? "bg-shell-red text-white shadow" : "text-muted-foreground"
        }`}
      >
        Login
      </Link>
      <Link
        to="/register"
        className={`flex-1 rounded-xl py-2.5 text-center text-sm font-bold transition ${
          active === "register" ? "bg-shell-red text-white shadow" : "text-muted-foreground"
        }`}
      >
        Register
      </Link>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 px-1 text-[11px] font-bold tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
