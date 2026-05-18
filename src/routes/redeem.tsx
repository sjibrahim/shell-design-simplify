import { createFileRoute } from "@tanstack/react-router";
import { Ticket, Gift, Check } from "lucide-react";
import { useState } from "react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/redeem")({
  head: () => ({
    meta: [
      { title: "Redeem Code — Shell Oil" },
      { name: "description", content: "Redeem your Shell promo code for instant rewards." },
    ],
  }),
  component: RedeemPage,
});

function RedeemPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const redeem = () => {
    if (!code.trim()) return;
    setStatus("err");
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <SubPage title="Redeem Code" icon={<Ticket size={26} className="text-white" />} subtitle="Enter your promo code">
      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Promo Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="SHELL-XXXX-XXXX"
            className="mt-2 w-full rounded-2xl border-2 border-dashed border-shell-red/30 bg-shell-yellow-soft/40 px-4 py-4 text-center font-mono text-xl font-extrabold tracking-[0.2em] text-shell-red-dark outline-none"
          />
          <button
            onClick={redeem}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md active:scale-[0.99]"
          >
            Redeem Now
          </button>
          {status === "err" && (
            <div className="mt-3 rounded-xl bg-shell-red/10 px-3 py-2 text-center text-xs font-bold text-shell-red">
              Invalid or expired code
            </div>
          )}
          {status === "ok" && (
            <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-shell-green/10 px-3 py-2 text-xs font-bold text-shell-green">
              <Check size={14} /> Redeemed successfully
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-shell-yellow-soft to-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-shell-red" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">How it works</h2>
          </div>
          <ol className="mt-3 space-y-2 text-sm text-foreground/80">
            <li>1. Get a promo code from Shell campaigns or your inviter.</li>
            <li>2. Enter the code exactly as received.</li>
            <li>3. Rewards credit to your balance instantly.</li>
          </ol>
        </div>
      </section>
    </SubPage>
  );
}
