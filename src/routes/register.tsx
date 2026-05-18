import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Users } from "lucide-react";
import { AuthShell, Tabs, Field } from "./login";
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
    if (password.length < 4) { setErr("Password min 4 characters"); return; }
    setErr(null); setLoading(true);
    try {
      const u = await registerUser(phone.trim(), password, name.trim() || undefined, refCode.trim() || undefined);
      setUser(u);
      navigate({ to: "/" });
    } catch (e) { setErr((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell title="Shell Oil" subtitle="Create your investment account">
      <Tabs active="register" />
      <form onSubmit={submit} className="space-y-4">
        {err && <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{err}</div>}
        <Field label="PHONE NUMBER">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3.5">
            <span className="font-extrabold text-shell-red">+63</span>
            <span className="h-5 w-px bg-border" />
            <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number" required
              className="flex-1 bg-transparent text-base font-bold text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
        </Field>
        <Field label="FULL NAME (OPTIONAL)">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3.5">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
              className="flex-1 bg-transparent text-base font-bold text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
        </Field>
        <Field label="PASSWORD">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 py-2 pl-2 pr-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white">
              <Lock size={18} />
            </span>
            <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" required
              className="flex-1 bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted-foreground" />
            <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground" aria-label="Toggle password">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <Field label="INVITATION CODE (OPTIONAL)">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 py-2 pl-2 pr-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white">
              <Users size={18} />
            </span>
            <input value={refCode} onChange={(e) => setRefCode(e.target.value.toUpperCase())}
              placeholder="SHELL…" className="flex-1 bg-transparent py-2 text-base font-bold tracking-widest text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
        </Field>
        <button disabled={loading} className="mt-2 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md transition active:scale-[0.99] disabled:opacity-60">
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}
