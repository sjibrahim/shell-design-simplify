import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthShell, Field, PhoneInput, PrimaryButton } from "@/components/AuthShell";
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
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your Shell account."
      footer={
        <p className="text-center text-[13px] text-foreground/70">
          New here?{" "}
          <Link to="/register" className="font-bold text-shell-red hover:underline">
            Create an account
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

        <Field label="Password" icon={<Lock size={16} />}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="px-1 text-muted-foreground" aria-label="Toggle password">
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </Field>

        <div className="flex justify-end pt-0.5">
          <button type="button" className="text-[12.5px] font-semibold text-shell-red hover:underline">
            Forgot password?
          </button>
        </div>

        <PrimaryButton loading={loading}>
          <span className="inline-flex items-center gap-2">
            SIGN IN <ArrowRight size={14} />
          </span>
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
