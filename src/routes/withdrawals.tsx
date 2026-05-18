import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownToLine, Landmark, Plus, TrendingUp, Clock, Check, X } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/withdrawals")({
  head: () => ({
    meta: [
      { title: "Withdrawal History — Shell Oil" },
      { name: "description", content: "All your Shell Oil withdrawal requests and bank transfers." },
    ],
  }),
  component: WithdrawalsPage,
});

const RECORDS = [
  { id: "WD8821", amount: 1500, bank: "GCash · 0912",      date: "2026-05-17 14:33", status: "pending" as const },
  { id: "WD8810", amount: 800,  bank: "BPI · ****4421",     date: "2026-05-15 18:42", status: "success" as const },
  { id: "WD8802", amount: 320,  bank: "Maya · 0945",        date: "2026-05-12 11:09", status: "failed"  as const },
  { id: "WD8790", amount: 2500, bank: "BDO · ****8821",     date: "2026-05-08 16:00", status: "success" as const },
  { id: "WD8770", amount: 500,  bank: "GCash · 0912",      date: "2026-05-02 09:21", status: "success" as const },
];

const statusMeta = {
  success: { tint: "bg-shell-green/15 text-shell-green", icon: Check, label: "Paid" },
  pending: { tint: "bg-shell-yellow/30 text-[#8a6500]",  icon: Clock, label: "Pending" },
  failed:  { tint: "bg-shell-red/10 text-shell-red",      icon: X,     label: "Failed" },
};

function WithdrawalsPage() {
  const total = RECORDS.filter((r) => r.status === "success").reduce((s, r) => s + r.amount, 0);

  return (
    <SubPage title="Withdrawals" icon={<ArrowDownToLine size={26} className="text-white" />} subtitle="Your payout history">
      <section className="space-y-4">
        {/* Summary */}
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Withdrawn</div>
              <div className="mt-1 text-3xl font-extrabold text-shell-green">₱{total.toLocaleString()}.00</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-shell-green/15 text-shell-green">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/withdraw" className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark p-4 text-white shadow-md active:scale-[0.99]">
            <Plus size={18} />
            <span className="text-sm font-bold">New Withdrawal</span>
          </Link>
          <Link to="/add-bank" className="flex items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm active:scale-[0.99]">
            <Landmark size={18} className="text-shell-red" />
            <span className="text-sm font-bold text-foreground">Bank Accounts</span>
          </Link>
        </div>

        {/* History */}
        <div>
          <h2 className="mb-2 px-1 text-sm font-extrabold uppercase tracking-wider text-foreground">History</h2>
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
            {RECORDS.map((r, i) => {
              const s = statusMeta[r.status];
              const Icon = s.icon;
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i !== RECORDS.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.tint}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-foreground">{r.bank}</div>
                    <div className="text-[11px] text-muted-foreground">{r.date} · {r.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-shell-red">-₱{r.amount.toLocaleString()}</div>
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${s.tint}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SubPage>
  );
}
