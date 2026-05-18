import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Users, User as UserIcon, UserPlus, ShieldCheck } from "lucide-react";
import { AuthShell, FieldBox, PhoneField } from "./login";
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
      <div className="px-5 pt-4">
        <h2 className="text-[20px] font-extrabold text-shell-red-dark">Create account</h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Join Shell Company Philippines today</p>
      </div>

      <form onSubmit={submit} className="space-y-3 p-5 pt-4">
        {err && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">
            {err}
          </div>
        )}

        <PhoneField value={phone} onChange={setPhone} />

        <FieldBox icon={<UserIcon size={17} className="text-shell-red" />}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name (optional)"
            autoComplete="name"
            className="flex-1 bg-transparent text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
        </FieldBox>

        <FieldBox icon={<Lock size={17} className="text-shell-red" />}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 4 characters)"
            required
            autoComplete="new-password"
            className="flex-1 bg-transparent text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="px-1 text-muted-foreground" aria-label="Toggle password">
            {show ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
        </FieldBox>

        <FieldBox icon={<Users size={17} className="text-shell-red" />}>
          <input
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            placeholder="Invitation code (optional)"
            className="flex-1 bg-transparent text-[14px] font-extrabold tracking-widest text-foreground outline-none placeholder:text-muted-foreground placeholder:font-medium placeholder:tracking-normal"
          />
        </FieldBox>

        <button
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-shell-red to-shell-red-dark py-3 text-[14px] font-extrabold tracking-wider text-white shadow-md shadow-shell-red/30 transition active:scale-[0.99] disabled:opacity-60"
        >
          <UserPlus size={15} />
          {loading ? "CREATING…" : "REGISTER"}
        </button>

        <p className="text-center text-[10.5px] text-muted-foreground">
          By signing up you agree to our Terms & Privacy Policy.
        </p>

        <div className="flex items-center gap-3 py-0.5">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">have account</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          to="/login"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-shell-red/80 bg-white py-3 text-[13px] font-extrabold tracking-wider text-shell-red transition hover:bg-shell-red/5"
        >
          SIGN IN INSTEAD
        </Link>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[10.5px] font-semibold text-muted-foreground">
          <ShieldCheck size={12} className="text-shell-green" />
          Secured by Shell Company Philippines
        </div>
      </form>
    </AuthShell>
  );
}
