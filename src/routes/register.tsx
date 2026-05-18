import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Users, User as UserIcon, ArrowRight } from "lucide-react";
import { AuthShell, Field, PhoneInput, PrimaryButton } from "@/components/AuthShell";
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
    <AuthShell
      title="Create your account"
      subtitle="Join Shell Company Philippines in under a minute."
      footer={
        <p className="text-center text-[13px] text-foreground/70">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-shell-red hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      {err && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-700 ring-1 ring-rose-200">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <PhoneInput value={phone} onChange={setPhone} />

        <Field label="Full name" icon={<UserIcon size={16} />}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
            autoComplete="name"
            className="flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </Field>

        <Field label="Password" icon={<Lock size={16} />}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 4 characters"
            required
            autoComplete="new-password"
            className="flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="px-1 text-muted-foreground" aria-label="Toggle password">
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </Field>

        <Field label="Invitation code" icon={<Users size={16} />}>
          <input
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            placeholder="Optional"
            className="flex-1 bg-transparent text-[15px] font-extrabold tracking-widest text-foreground outline-none placeholder:font-medium placeholder:tracking-normal placeholder:text-muted-foreground/70"
          />
        </Field>

        <PrimaryButton loading={loading}>
          <span className="inline-flex items-center gap-2">
            CREATE ACCOUNT <ArrowRight size={14} />
          </span>
        </PrimaryButton>

        <p className="text-center text-[11px] text-muted-foreground">
          By signing up you agree to our Terms & Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}
