import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Layers, TrendingUp, Wallet, Calendar, Gift, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/income-details")({
  head: () => ({
    meta: [
      { title: "Income Details — Shell Oil" },
      { name: "description", content: "Track when your next daily Shell Oil income is credited." },
    ],
  }),
  component: IncomePage,
});

function useCountdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const next = new Date(now);
  next.setHours(24, 1, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

function IncomePage() {
  const { h, m, s } = useCountdown();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-[#FAF4E6] pb-10 shadow-xl">
        <header className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-4 pb-24 pt-5 text-white">
          <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-shell-yellow/10" />
          <div className="relative flex items-center justify-between">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-xl font-extrabold">Income Details</h1>
            <span className="w-10" />
          </div>
        </header>

        <main className="relative z-10 -mt-12 space-y-4 px-4">
          {/* Countdown */}
          <section className="rounded-3xl bg-white p-6 text-center shadow-[0_10px_40px_-10px_rgba(221,29,33,0.2)]">
            <div className="flex items-center justify-center gap-2 text-shell-red">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-shell-green" />
              <span className="text-xs font-bold tracking-wider">NEXT INCOME CREDIT</span>
            </div>
            <div className="mt-4 inline-flex items-end justify-center gap-3 rounded-2xl bg-gradient-to-br from-shell-red to-shell-red-dark px-6 py-4 text-white shadow-inner">
              <TimeBlock value={pad(h)} label="HRS" />
              <span className="pb-5 text-3xl font-bold text-shell-yellow/80">:</span>
              <TimeBlock value={pad(m)} label="MIN" />
              <span className="pb-5 text-3xl font-bold text-shell-yellow/80">:</span>
              <TimeBlock value={pad(s)} label="SEC" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Income credited daily at 12:01 AM</p>
          </section>

          {/* Earnings summary */}
          <section className="rounded-3xl bg-gradient-to-br from-shell-green via-[#1b9a5b] to-[#0d6b3d] p-5 text-white shadow-[0_18px_40px_-18px_rgba(13,107,61,0.45)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Total Earned</div>
                <div className="mt-1 text-3xl font-extrabold">₱14,820.50</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
                <Wallet size={22} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-white/20 rounded-2xl bg-white/10 py-3 text-center">
              <SummaryStat label="Today" value="₱358" />
              <SummaryStat label="This Week" value="₱2,140" />
              <SummaryStat label="This Month" value="₱8,420" />
            </div>
          </section>

          {/* Breakdown */}
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Income Breakdown</h2>
            <div className="mt-3 space-y-2.5">
              <BreakdownRow icon={TrendingUp} tint="bg-shell-green/15 text-shell-green" label="Daily Plan Returns" value="₱9,240" pct={62} />
              <BreakdownRow icon={Layers}     tint="bg-shell-red/10 text-shell-red"      label="Team Commission"     value="₱3,810" pct={26} />
              <BreakdownRow icon={Gift}       tint="bg-shell-yellow/30 text-[#8a6500]"  label="Bonus & Rewards"     value="₱1,770" pct={12} />
            </div>
          </section>

          {/* Recent credits */}
          <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between px-1 pb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Recent Credits</h2>
              <span className="text-[11px] font-bold text-muted-foreground">Last 5 days</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { day: "Today",      date: "May 18", amount: 358, type: "Daily + Bonus" },
                { day: "Yesterday",  date: "May 17", amount: 312, type: "Daily Return" },
                { day: "Sat",        date: "May 16", amount: 295, type: "Daily Return" },
                { day: "Fri",        date: "May 15", amount: 410, type: "Daily + Team" },
                { day: "Thu",        date: "May 14", amount: 288, type: "Daily Return" },
              ].map((r) => (
                <div key={r.date} className="flex items-center gap-3 py-2.5">
                  <div className="flex h-9 w-9 flex-col items-center justify-center rounded-xl bg-shell-yellow-soft text-[9px] font-bold text-shell-red-dark">
                    <Calendar size={12} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-foreground">{r.day}</div>
                    <div className="text-[10.5px] text-muted-foreground">{r.date} · {r.type}</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-extrabold text-shell-green">
                    <ArrowUpRight size={12} /> +₱{r.amount}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-shell-yellow-soft to-white p-6 text-center shadow-sm ring-1 ring-shell-yellow/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-shell-yellow/40 text-shell-red">
              <Layers size={26} />
            </div>
            <h2 className="mt-3 text-lg font-extrabold">Boost Your Daily Income</h2>
            <p className="mt-1 max-w-xs text-[12px] text-muted-foreground">
              Upgrade to a higher plan and earn up to 8% daily on your investment.
            </p>
            <Link
              to="/"
              className="mt-4 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark px-8 py-3 text-sm font-bold text-white shadow-md"
            >
              Browse Plans
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2">
      <div className="text-base font-extrabold">{value}</div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-white/75">{label}</div>
    </div>
  );
}

function BreakdownRow({ icon: Icon, tint, label, value, pct }: { icon: typeof Layers; tint: string; label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tint}`}>
          <Icon size={16} />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm font-extrabold text-foreground">
            <span>{label}</span>
            <span>{value}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-shell-red to-shell-yellow" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-4xl font-bold leading-none tabular-nums">{value}</span>
      <span className="mt-1 text-[10px] font-bold tracking-widest text-white/60">{label}</span>
    </div>
  );
}
