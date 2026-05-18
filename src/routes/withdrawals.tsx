import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  Landmark,
  Plus,
  TrendingUp,
  Clock,
  Check,
  X,
  Hash,
  Calendar,
  Shield,
  Receipt,
  ChevronRight,
} from "lucide-react";
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

type Status = "success" | "pending" | "failed";
type Record = {
  id: string;
  amount: number;
  fee: number;
  net: number;
  bank: string;
  bankIcon: string;
  date: string;
  status: Status;
  ref: string;
  eta?: string;
};

const RECORDS: Record[] = [
  { id: "WD8821", amount: 1500, fee: 30, net: 1470, bank: "GCash · 0912xxx7821", bankIcon: "G", date: "2026-05-17 14:33", status: "pending", ref: "TXN-2A8F91", eta: "Approx. 2h remaining" },
  { id: "WD8810", amount: 800,  fee: 16, net: 784,  bank: "BPI · ****4421",      bankIcon: "B", date: "2026-05-15 18:42", status: "success", ref: "TXN-2A7C40" },
  { id: "WD8802", amount: 320,  fee: 6,  net: 314,  bank: "Maya · 0945xxx3320",  bankIcon: "M", date: "2026-05-12 11:09", status: "failed",  ref: "TXN-2A6B19" },
  { id: "WD8790", amount: 2500, fee: 50, net: 2450, bank: "BDO · ****8821",      bankIcon: "B", date: "2026-05-08 16:00", status: "success", ref: "TXN-2A5102" },
  { id: "WD8770", amount: 500,  fee: 10, net: 490,  bank: "GCash · 0912xxx7821", bankIcon: "G", date: "2026-05-02 09:21", status: "success", ref: "TXN-2A3877" },
];

const statusMeta: { [K in Status]: { tint: string; ring: string; icon: typeof Check; label: string } } = {
  success: { tint: "bg-shell-green/15 text-shell-green", ring: "ring-shell-green/30", icon: Check, label: "Paid" },
  pending: { tint: "bg-shell-yellow/30 text-[#8a6500]",   ring: "ring-shell-yellow/50", icon: Clock, label: "Processing" },
  failed:  { tint: "bg-shell-red/10 text-shell-red",       ring: "ring-shell-red/30",    icon: X,     label: "Failed" },
};

function WithdrawalsPage() {
  const totalPaid = RECORDS.filter((r) => r.status === "success").reduce((s, r) => s + r.net, 0);
  const totalReq = RECORDS.reduce((s, r) => s + r.amount, 0);
  const pendingCount = RECORDS.filter((r) => r.status === "pending").length;
  const successCount = RECORDS.filter((r) => r.status === "success").length;

  return (
    <SubPage title="Withdrawals" icon={<ArrowDownToLine size={26} className="text-white" />} subtitle="Your payout history & status">
      <section className="space-y-4">
        {/* Summary card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-shell-green via-[#1b9a5b] to-[#0d6b3d] p-5 text-white shadow-[0_18px_40px_-18px_rgba(13,107,61,0.5)]">
          <span className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Total Received</div>
              <div className="mt-1 text-3xl font-extrabold">₱{totalPaid.toLocaleString()}.00</div>
              <div className="mt-1 text-[11px] text-white/80">From {successCount} successful payouts</div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
              <TrendingUp size={26} />
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 divide-x divide-white/20 rounded-2xl bg-white/10 py-3 text-center">
            <MiniStat label="Requests" value={String(RECORDS.length)} />
            <MiniStat label="Pending" value={String(pendingCount)} accent />
            <MiniStat label="Volume" value={`₱${(totalReq / 1000).toFixed(1)}k`} />
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

        {/* Processing notice */}
        {pendingCount > 0 && (
          <div className="flex items-start gap-3 rounded-2xl bg-shell-yellow-soft p-3.5 ring-1 ring-shell-yellow/30">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-shell-yellow text-shell-red-dark">
              <Clock size={16} />
            </div>
            <div className="flex-1 text-[12px] leading-relaxed text-[#6a5000]">
              <b className="text-foreground">{pendingCount} withdrawal in process.</b> Most payouts arrive within 30 min – 3 hours during business hours (9 AM – 9 PM PHT).
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Recent History</h2>
            <span className="text-[11px] font-bold text-muted-foreground">{RECORDS.length} records</span>
          </div>
          <div className="space-y-2.5">
            {RECORDS.map((r) => {
              const s = statusMeta[r.status];
              const Icon = s.icon;
              return (
                <div key={r.id} className={`overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ${s.ring}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-shell-red/10 to-shell-yellow/20 text-base font-extrabold text-shell-red ring-1 ring-shell-red/20">
                        {r.bankIcon}
                      </div>
                      <span className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${s.tint} ring-2 ring-white`}>
                        <Icon size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-foreground">{r.bank}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar size={10} /> {r.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-shell-red">-₱{r.amount.toLocaleString()}</div>
                      <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${s.tint}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 px-3 py-2 text-center text-[10px]">
                    <Mini label="Fee" value={`₱${r.fee}`} />
                    <Mini label="You Got" value={`₱${r.net.toLocaleString()}`} accent={r.status === "success"} />
                    <Mini label="Ref" value={r.ref.slice(-6)} mono />
                  </div>
                  {r.eta && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-shell-yellow-soft px-2.5 py-1.5 text-[10.5px] font-semibold text-[#7a5a00]">
                      <Clock size={11} /> {r.eta}
                    </div>
                  )}
                  {r.status === "failed" && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-shell-red/10 px-2.5 py-1.5 text-[10.5px] font-semibold text-shell-red">
                      <X size={11} /> Reason: Account name mismatch — amount refunded to wallet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-shell-green/15 text-shell-green">
              <Shield size={18} />
            </div>
            <div>
              <div className="text-[12px] font-extrabold text-foreground">Bank-grade secure</div>
              <div className="text-[10px] text-muted-foreground">All payouts encrypted · BSP compliant</div>
            </div>
          </div>
          <Link to="/transactions" className="flex items-center gap-1 rounded-xl bg-shell-yellow-soft px-3 py-2 text-[11px] font-bold text-shell-red-dark">
            <Receipt size={12} /> All Txns <ChevronRight size={12} />
          </Link>
        </div>
      </section>
    </SubPage>
  );
}

function MiniStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-2">
      <div className={`text-base font-extrabold ${accent ? "text-shell-yellow" : "text-white"}`}>{value}</div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-white/70">{label}</div>
    </div>
  );
}

function Mini({ label, value, accent = false, mono = false }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`${mono ? "font-mono" : ""} text-[11px] font-extrabold ${accent ? "text-shell-green" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
