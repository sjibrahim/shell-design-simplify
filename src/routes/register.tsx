import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Users, Phone, User as UserIcon } from "lucide-react";
import { AuthShell, Tabs, Field, TrustBar } from "./login";
import { registerUser } from "@/lib/user-api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Shell Oil" },
      { name: "description", content: "Create your Shell Oil investment account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [refCode, setRefCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) { setErr("Password must be at least 4 characters"); return; }
    setErr(null); setLoading(true);
    try {
      const u = await registerUser(phone.trim(), password, name.trim() || undefined, refCode.trim() || undefined);
      setUser(u);
      navigate({ to: "/" });
    } catch (e) { setErr((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell>
      <Tabs active="register" />
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
            type="tel" inputMode="numeric" value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="9XX XXX XXXX" required autoComplete="tel"
            className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground"
          />
        </Field>
        <Field label="Full Name (optional)" icon={<UserIcon size={18} />}>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Juan Dela Cruz" autoComplete="name"
            className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground"
          />
        </Field>
        <Field label="Password" icon={<Lock size={18} />}>
          <input
            type={show ? "text" : "password"} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 4 characters" required autoComplete="new-password"
            className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground" aria-label="Toggle password">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </Field>
        <Field label="Invitation Code (optional)" icon={<Users size={18} />}>
          <input
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            placeholder="SHELL…"
            className="flex-1 bg-transparent text-base font-extrabold tracking-widest text-foreground outline-none placeholder:text-muted-foreground"
          />
        </Field>

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-extrabold tracking-wide text-white shadow-lg shadow-shell-red/30 transition active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          By signing up you agree to our Terms & Privacy Policy.
        </p>
      </form>

      <TrustBar />
    </AuthShell>
  );
}
