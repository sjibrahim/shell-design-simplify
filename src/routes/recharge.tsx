import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, Shield, Zap, Gift, Smartphone, Check } from "lucide-react";
import { SubPage } from "@/components/SubPage";
import { useAuth } from "@/lib/auth";
import { fmtPeso, uPost } from "@/lib/user-api";
import { toast } from "sonner";

export const Route = createFileRoute("/recharge")({
  head: () => ({
    meta: [
      { title: "Recharge — Shell Oil" },
      { name: "description", content: "Top up your Shell Oil wallet via GCash or PayMaya. Instant credit." },
    ],
  }),
  component: RechargePage,
});

const METHODS = [
  { id: "WatchPay", name: "WatchPay", color: "bg-shell-red" },
  { id: "HeyPay",   name: "HeyPay",   color: "bg-indigo-500" },
  { id: "GCash",    name: "GCash",    color: "bg-sky-500" },
  { id: "PayMaya",  name: "PayMaya",  color: "bg-emerald-500" },
] as const;

const PRESETS = [500, 1000, 2500, 5000, 10000, 20000];

function RechargePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [method, setMethod] = useState<typeof METHODS[number]["id"]>("WatchPay");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) { navigate({ to: "/login" }); return; }
    const amt = Number(amount);
    if (!amt || amt < 100) { toast.error("Minimum recharge is ₱100"); return; }
    setLoading(true);
    try {
      const r = await uPost<{ ok: true; id: number; pay_url?: string | null }>("/api/u/recharge", { amount: amt, gateway: method });
      if (r.pay_url) {
        toast.success("Redirecting to payment…");
        window.location.href = r.pay_url;
        return;
      }
      toast.success("Recharge request submitted", { description: "Awaiting admin confirmation." });
      navigate({ to: "/transactions" });
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <SubPage title="Recharge" icon={<Wallet size={26} className="text-white" />} subtitle="Top up your Shell Oil balance">
      <section className="space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-shell-yellow-soft to-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Current Balance</div>
              <div className="mt-1 text-3xl font-extrabold text-foreground">{user ? fmtPeso(user.balance) : "—"}</div>
            </div>
            <span className="rounded-full bg-shell-red px-2.5 py-1 text-[10px] font-extrabold text-white">
              <Zap size={10} className="mr-0.5 inline" /> INSTANT
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-shell-red/10 px-3 py-2">
            <Gift size={14} className="text-shell-red" />
            <p className="text-[11px] font-semibold text-shell-red">
              First recharge bonus: <b>+20% extra</b> on top of any amount up to ₱5,000.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] ring-1 ring-black/5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payment Method</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {METHODS.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`relative flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 transition active:scale-[0.98] ${
                    active ? "ring-2 ring-shell-red shadow-md" : "ring-black/5"
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.color} text-white`}>
                    <Smartphone size={18} />
                  </span>
                  <span className="text-sm font-extrabold text-foreground">{m.name}</span>
                  {active && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-shell-red text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Amount</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="₱ 0.00"
            className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-2xl font-extrabold text-foreground outline-none focus:border-shell-red"
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {PRESETS.map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="rounded-xl border border-shell-red/20 bg-shell-yellow/15 py-2 text-sm font-bold text-shell-red active:scale-95"
              >
                ₱{v.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            disabled={loading}
            onClick={submit}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Continue to Pay"}
          </button>
        </div>

        {/* How it works */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">How it works</h2>
          <ol className="mt-2 space-y-1.5 text-[12px] text-muted-foreground">
            <li>1. Choose GCash or PayMaya and enter the amount.</li>
            <li>2. You'll be redirected to confirm the payment in the wallet app.</li>
            <li>3. Funds credit to your Shell balance within <b className="text-foreground">5 seconds</b>.</li>
            <li>4. Start an investment plan or join the team to start earning daily income.</li>
          </ol>
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-shell-yellow-soft p-3 text-[11px] text-[#8a6500]">
          <Shield size={14} className="mt-0.5 shrink-0" />
          <p>
            Minimum recharge ₱100. All transactions are encrypted with 256-bit SSL and processed by GCash/PayMaya
            secure servers.
          </p>
        </div>
      </section>
    </SubPage>
  );
}
