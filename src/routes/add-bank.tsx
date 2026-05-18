import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, Shield, Check, Smartphone } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/add-bank")({
  head: () => ({
    meta: [
      { title: "Add Payout Method — Shell Oil" },
      { name: "description", content: "Link your GCash or PayMaya wallet to receive withdrawals." },
    ],
  }),
  component: AddBankPage,
});

const WALLETS = [
  { id: "gcash",   name: "GCash",    color: "bg-sky-500",    text: "text-sky-500",    desc: "Instant transfer · 0 fees" },
  { id: "paymaya", name: "PayMaya",  color: "bg-emerald-500", text: "text-emerald-500", desc: "Instant transfer · 0 fees" },
] as const;

function AddBankPage() {
  const [wallet, setWallet] = useState<typeof WALLETS[number]["id"]>("gcash");
  const [name, setName] = useState("");
  const [acc, setAcc] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!name || !acc) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SubPage title="Add Payout Method" icon={<Landmark size={26} className="text-white" />} subtitle="Link GCash or PayMaya">
      <section className="space-y-4">
        {/* Wallet picker */}
        <div className="grid grid-cols-2 gap-3">
          {WALLETS.map((w) => {
            const active = wallet === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setWallet(w.id)}
                className={`relative overflow-hidden rounded-2xl bg-white p-4 text-left ring-1 transition active:scale-[0.98] ${
                  active ? "ring-2 ring-shell-red shadow-md" : "ring-black/5 shadow-sm"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${w.color} text-white`}>
                  <Smartphone size={18} />
                </div>
                <div className="mt-2 text-sm font-extrabold text-foreground">{w.name}</div>
                <div className="text-[10px] text-muted-foreground">{w.desc}</div>
                {active && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-shell-red text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] ring-1 ring-black/5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {WALLETS.find((w) => w.id === wallet)?.name} Account Details
          </div>
          <div className="mt-3 space-y-3">
            <Field label="Account Holder Name" placeholder="Juan Dela Cruz" value={name} onChange={setName} />
            <Field
              label={`${WALLETS.find((w) => w.id === wallet)?.name} Mobile Number`}
              placeholder="+63 9XX XXX XXXX"
              value={acc}
              onChange={setAcc}
            />
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground">
            Make sure the name matches your verified {WALLETS.find((w) => w.id === wallet)?.name} account. Mismatched details
            will cause your withdrawal to fail.
          </p>

          <button
            onClick={save}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md active:scale-[0.99]"
          >
            Save Account
          </button>
          {saved && (
            <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-shell-green/10 px-3 py-2 text-xs font-bold text-shell-green">
              <Check size={14} /> Payout account saved successfully
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-shell-yellow-soft p-4 text-[12px] text-[#8a6500]">
          <Shield size={16} className="mt-0.5 shrink-0" />
          <p>
            Your wallet details are encrypted with 256-bit SSL and only used to process withdrawals. We never share your
            info with third parties.
          </p>
        </div>
      </section>
    </SubPage>
  );
}

function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3.5 text-sm font-semibold text-foreground outline-none focus:border-shell-red"
      />
    </div>
  );
}
