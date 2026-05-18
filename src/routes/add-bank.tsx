import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, Shield, Check } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/add-bank")({
  head: () => ({
    meta: [
      { title: "Add Bank Account — Shell Oil" },
      { name: "description", content: "Link your bank or e-wallet to withdraw earnings safely." },
    ],
  }),
  component: AddBankPage,
});

const BANKS = ["GCash", "Maya", "BPI", "BDO", "Metrobank", "UnionBank", "Landbank", "RCBC"];

function AddBankPage() {
  const [bank, setBank] = useState("GCash");
  const [name, setName] = useState("");
  const [acc, setAcc] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!name || !acc) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SubPage title="Add Bank Account" icon={<Landmark size={26} className="text-white" />} subtitle="Link your payout method">
      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] ring-1 ring-black/5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Bank / Wallet</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {BANKS.map((b) => {
              const active = b === bank;
              return (
                <button
                  key={b}
                  onClick={() => setBank(b)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    active ? "bg-shell-red text-white shadow" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-3">
            <Field label="Account Holder Name" placeholder="Juan Dela Cruz" value={name} onChange={setName} />
            <Field label="Account Number" placeholder="0000-0000-0000" value={acc} onChange={setAcc} />
            <Field label="Phone Number" placeholder="+63 9XX XXX XXXX" value={phone} onChange={setPhone} />
          </div>

          <button
            onClick={save}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md active:scale-[0.99]"
          >
            Save Bank Account
          </button>
          {saved && (
            <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-shell-green/10 px-3 py-2 text-xs font-bold text-shell-green">
              <Check size={14} /> Bank account saved
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-shell-yellow-soft p-4 text-[12px] text-[#8a6500]">
          <Shield size={16} className="mt-0.5 shrink-0" />
          <p>
            Your bank details are encrypted with 256-bit SSL and only used for withdrawals. We never share your info
            with third parties.
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
