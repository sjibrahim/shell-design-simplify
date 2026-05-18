import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Users, User as UserIcon, UserPlus, LogIn } from "lucide-react";
import { AuthShell, Field, PhoneInput } from "@/components/AuthShell";
import { registerUser } from "@/lib/user-api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Shell Company Philippines" },
      { name: "description", content: "Create your Shell Company Philippines account." },
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
      <h2 className="text-center text-[28px] font-extrabold text-foreground">Create Account</h2>
      <p className="mt-1 text-center text-[14px] text-muted-foreground">Join Shell Company Philippines today</p>

      {err && (
        <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-700 ring-1 ring-rose-200">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <PhoneInput value={phone} onChange={setPhone} />

        <Field icon={<UserIcon size={22} strokeWidth={2.2} />}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name (optional)"
            autoComplete="name"
            className="flex-1 bg-transparent text-[15.5px] font-medium text-foreground outline-none placeholder:text-muted-foreground/80"
          />
        </Field>

        <Field icon={<Lock size={22} strokeWidth={2.2} />}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 4 characters)"
            required
            autoComplete="new-password"
            className="flex-1 bg-transparent text-[15.5px] font-medium text-foreground outline-none placeholder:text-muted-foreground/80"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="px-1 text-muted-foreground" aria-label="Toggle password">
            {show ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </Field>

        <Field icon={<Users size={22} strokeWidth={2.2} />}>
          <input
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            placeholder="Invitation code (optional)"
            className="flex-1 bg-transparent text-[15.5px] font-extrabold tracking-widest text-foreground outline-none placeholder:font-medium placeholder:tracking-normal placeholder:text-muted-foreground/80"
          />
        </Field>

        <button
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#E72428] to-[#A8161A] py-4 text-[14.5px] font-extrabold tracking-[0.22em] text-white shadow-[0_14px_30px_-12px_rgba(168,22,26,0.6)] transition active:scale-[0.99] disabled:opacity-60"
        >
          <UserPlus size={16} />
          {loading ? "CREATING…" : "REGISTER"}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          By signing up you agree to our Terms & Privacy Policy.
        </p>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-bold tracking-[0.25em] text-muted-foreground">OR</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          to="/login"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-shell-red bg-white py-4 text-[13.5px] font-extrabold tracking-[0.2em] text-shell-red transition hover:bg-shell-red/5"
        >
          <LogIn size={16} />
          SIGN IN INSTEAD
        </Link>
      </form>
    </AuthShell>
  );
}
