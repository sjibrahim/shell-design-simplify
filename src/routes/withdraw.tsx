import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Landmark, History, ChevronRight, Shield, Clock, Info } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/withdraw")({
  head: () => ({
    meta: [
      { title: "Withdraw — Shell Oil" },
      { name: "description", content: "Withdraw your Shell Oil earnings to GCash or PayMaya within 24 hours." },
    ],
  }),
  component: WithdrawPage,
});

const PRESETS = [100, 500, 1000, 2000, 5000];
const FEE_PCT = 2; // 2% service fee

function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const n = Number(amount) || 0;
  const fee = +(n * FEE_PCT / 100).toFixed(2);
  const receive = +(n - fee).toFixed(2);

  return (
    <SubPage title="Withdraw" icon={<CreditCard size={26} className="text-white" />} subtitle="Cash out your earnings to GCash or PayMaya">
      <section className="space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-shell-yellow-soft to-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] ring-1 ring-black/5">
          <div className="text-[11px] font-bold tracking-wider text-muted-foreground">AVAILABLE TO WITHDRAW</div>
          <div className="mt-1 text-3xl font-extrabold text-shell-green">₱358.00</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock size={11} /> Cut-off 9:00 PM · Paid out within 24h
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/add-bank" className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm active:scale-[0.99]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-shell-red/10 text-shell-red">
              <Landmark size={18} />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-sm font-extrabold text-foreground">Add Wallet</span>
              <span className="block text-[11px] text-muted-foreground">GCash / PayMaya</span>
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
          <Link to="/withdrawals" className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm active:scale-[0.99]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-shell-yellow/30 text-[#8a6500]">
              <History size={18} />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-sm font-extrabold text-foreground">History</span>
              <span className="block text-[11px] text-muted-foreground">Past payouts</span>
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] ring-1 ring-black/5">
          <div className="text-[11px] font-bold tracking-wider text-muted-foreground">AMOUNT</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="₱ 0.00"
            className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-2xl font-extrabold text-foreground outline-none focus:border-shell-red"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-foreground transition active:bg-shell-yellow-soft"
              >
                ₱{p.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Fee summary */}
          {n > 0 && (
            <div className="mt-4 rounded-2xl bg-muted/60 p-3 text-[12px]">
              <div className="flex justify-between text-muted-foreground">
                <span>Amount</span>
                <span className="font-bold text-foreground">₱{n.toLocaleString()}</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>Service fee ({FEE_PCT}%)</span>
                <span className="font-bold text-foreground">-₱{fee.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2">
                <span className="font-bold text-foreground">You receive</span>
                <span className="font-extrabold text-shell-green">₱{receive.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="mt-4 text-[11px] font-bold tracking-wider text-muted-foreground">WITHDRAWAL PASSWORD</div>
          <input
            type="password"
            placeholder="Enter withdrawal password"
            className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-base text-foreground outline-none focus:border-shell-red"
          />
          <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md active:scale-[0.99]">
            Request Withdrawal
          </button>
        </div>

        {/* Terms */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-shell-red" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Withdrawal Terms</h2>
          </div>
          <ul className="mt-2 space-y-1.5 text-[12px] text-muted-foreground">
            <li>• Minimum withdrawal: <b className="text-foreground">₱100</b>. Maximum: <b className="text-foreground">₱50,000</b>/day.</li>
            <li>• Service fee of <b className="text-foreground">{FEE_PCT}%</b> applies to every withdrawal.</li>
            <li>• Cut-off 9:00 PM. Requests after cut-off are processed next business day.</li>
            <li>• Make sure your linked GCash / PayMaya name matches your KYC name.</li>
          </ul>
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-shell-yellow-soft p-3 text-[11px] text-[#8a6500]">
          <Shield size={14} className="mt-0.5 shrink-0" />
          <p>Every withdrawal is verified with your withdrawal password and 256-bit SSL encryption.</p>
        </div>
      </section>
    </SubPage>
  );
}
