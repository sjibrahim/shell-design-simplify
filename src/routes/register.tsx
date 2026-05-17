import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Users } from "lucide-react";
import { AuthShell, Tabs, Field } from "./login";

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
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  return (
    <AuthShell title="Shell Oil" subtitle="Create your investment account">
      <Tabs active="register" />
      <Field label="PHONE NUMBER">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3.5">
          <span className="font-extrabold text-shell-red">+63</span>
          <span className="h-5 w-px bg-border" />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Phone number"
            className="flex-1 bg-transparent text-base font-bold text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </Field>
      <Field label="PASSWORD">
        <PasswordRow icon={<Lock size={18} />} show={show1} setShow={setShow1} placeholder="Enter password" />
      </Field>
      <Field label="WITHDRAWAL PASSWORD">
        <PasswordRow icon={<ShieldCheck size={18} />} show={show2} setShow={setShow2} placeholder="Set withdrawal password" />
      </Field>
      <Field label="INVITATION CODE">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 py-2 pl-2 pr-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white">
            <Users size={18} />
          </span>
          <input
            defaultValue="SHL821047"
            className="flex-1 bg-transparent py-2 text-base font-bold tracking-widest text-foreground outline-none"
          />
        </div>
      </Field>
      <button className="mt-2 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md transition active:scale-[0.99]">
        Create Account
      </button>
    </AuthShell>
  );
}

function PasswordRow({
  icon,
  show,
  setShow,
  placeholder,
}: {
  icon: React.ReactNode;
  show: boolean;
  setShow: (v: boolean) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 py-2 pl-2 pr-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white">
        {icon}
      </span>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button onClick={() => setShow(!show)} className="text-muted-foreground" aria-label="Toggle password">
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
