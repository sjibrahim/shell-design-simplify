import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Wallet, ArrowDownToLine, Receipt, TrendingUp, Package } from "lucide-react";
import { AdminCard, PageTitle } from "@/components/AdminLayout";
import { apiGet } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

interface Stats {
  users: number; active: number; inactive: number; plans: number; txns: number;
  withdrawals: Record<"pending"|"processing"|"success"|"failed", { count: number; amount: number }>;
  recharge_success: number; recharge_pending: number; payout_success: number;
  chart: { d: string; recharge: number; withdraw: number }[];
}

function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { apiGet<{ ok: true } & Stats>("/api/dashboard/stats").then(setS).catch((e) => setErr((e as Error).message)); }, []);

  if (err) return <div className="rounded-md bg-rose-50 p-4 text-sm text-rose-700">{err}</div>;
  if (!s) return <div className="text-sm text-slate-500">Loading…</div>;

  const cards = [
    { label: "Total Members", value: s.users,  sub: `${s.active} active`, icon: Users,         tint: "bg-shell-red/10 text-shell-red" },
    { label: "Active Plans",  value: s.plans,  sub: "Investment products", icon: Package,      tint: "bg-amber-100 text-amber-700" },
    { label: "Transactions",  value: s.txns,   sub: "All time",            icon: Receipt,      tint: "bg-sky-100 text-sky-700" },
    { label: "Recharge ₱",    value: `₱${s.recharge_success.toLocaleString()}`, sub: `Pending ₱${s.recharge_pending.toLocaleString()}`, icon: Wallet, tint: "bg-emerald-100 text-emerald-700" },
    { label: "Payouts ₱",     value: `₱${s.payout_success.toLocaleString()}`, sub: "Success", icon: TrendingUp, tint: "bg-indigo-100 text-indigo-700" },
    { label: "Withdrawals",   value: s.withdrawals.success.count + s.withdrawals.pending.count + s.withdrawals.failed.count + s.withdrawals.processing.count, sub: `₱${s.withdrawals.success.amount.toLocaleString()} paid`, icon: ArrowDownToLine, tint: "bg-rose-100 text-rose-700" },
  ];

  const wd = s.withdrawals;
  const wdRows = [
    { k: "Pending",    v: wd.pending },
    { k: "Processing", v: wd.processing },
    { k: "Success",    v: wd.success },
    { k: "Failed",     v: wd.failed },
  ];

  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Overview of all platform activity" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <AdminCard key={c.label} className="!p-4">
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${c.tint}`}><c.icon size={18} /></div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{c.label}</div>
            <div className="text-xl font-extrabold">{c.value}</div>
            <div className="text-[10.5px] text-slate-400">{c.sub}</div>
          </AdminCard>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-sm font-extrabold">Withdrawals breakdown</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase text-slate-500"><th className="py-1">Status</th><th>Count</th><th>Amount</th></tr></thead>
            <tbody>
              {wdRows.map((r) => (
                <tr key={r.k} className="border-t border-slate-100">
                  <td className="py-1.5 font-semibold">{r.k}</td>
                  <td>{r.v.count}</td>
                  <td>₱{r.v.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
        <AdminCard>
          <h2 className="mb-3 text-sm font-extrabold">Last 7 days (success)</h2>
          {s.chart.length === 0 ? (
            <p className="text-xs text-slate-400">No data yet.</p>
          ) : (
            <div className="space-y-2">
              {s.chart.map((c) => (
                <div key={c.d}>
                  <div className="flex justify-between text-[11px] text-slate-500"><span>{c.d}</span><span>R ₱{Number(c.recharge).toLocaleString()} · W ₱{Number(c.withdraw).toLocaleString()}</span></div>
                  <div className="flex h-2 gap-0.5">
                    <div className="rounded-sm bg-emerald-400" style={{ width: `${Math.min(100, Number(c.recharge) / 100)}%` }} />
                    <div className="rounded-sm bg-rose-400"    style={{ width: `${Math.min(100, Number(c.withdraw) / 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
