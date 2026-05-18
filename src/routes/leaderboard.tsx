import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Crown, Medal, Flame, TrendingUp, Sparkles } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Shell Oil" },
      { name: "description", content: "Top inviters and earners on Shell Oil — compete for the ₱50,000 monthly prize pool." },
    ],
  }),
  component: LeaderboardPage,
});

type Row = { rank: number; name: string; team: number; earned: number };

const MONTHLY: Row[] = [
  { rank: 1, name: "Carlos M.", team: 412, earned: 184500 },
  { rank: 2, name: "Maria S.",  team: 365, earned: 162300 },
  { rank: 3, name: "Jose L.",   team: 298, earned: 128900 },
  { rank: 4, name: "Anna R.",   team: 245, earned: 98200 },
  { rank: 5, name: "Pedro G.",  team: 221, earned: 87400 },
  { rank: 6, name: "Lisa T.",   team: 188, earned: 71200 },
  { rank: 7, name: "Mark D.",   team: 165, earned: 64500 },
  { rank: 8, name: "Sofia P.",  team: 152, earned: 58900 },
  { rank: 9, name: "Juan D.",   team: 155, earned: 22265 },
  { rank: 10, name: "Eric V.",  team: 138, earned: 49800 },
];

const WEEKLY: Row[] = MONTHLY.map((r) => ({ ...r, team: Math.round(r.team / 4), earned: Math.round(r.earned / 4) }));

const PRIZES = [
  { rank: "1st", amount: 15000, tone: "from-shell-yellow to-[#caa416]" },
  { rank: "2nd", amount: 10000, tone: "from-[#cbd5e1] to-[#64748b]" },
  { rank: "3rd", amount: 6000,  tone: "from-shell-amber to-[#b46a1e]" },
  { rank: "4-10", amount: 2000, tone: "from-shell-red to-shell-red-dark" },
];

function LeaderboardPage() {
  const [tab, setTab] = useState<"week" | "month">("month");
  const list = tab === "month" ? MONTHLY : WEEKLY;
  const top3 = list.slice(0, 3);
  const rest = list.slice(3);

  return (
    <SubPage title="Leaderboard" icon={<Trophy size={26} className="text-white" />} subtitle="Top inviters · Win cash prizes">
      <section className="space-y-4">
        {/* Prize pool banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-shell-red via-shell-red-dark to-[#7a0f12] p-5 text-white shadow-[0_18px_40px_-18px_rgba(221,29,33,0.55)]">
          <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-shell-yellow/30 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
              <Sparkles size={22} className="text-shell-yellow" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-shell-yellow">Monthly Prize Pool</div>
              <div className="text-3xl font-extrabold">₱50,000</div>
            </div>
            <div className="rounded-full bg-shell-yellow px-2.5 py-1 text-[10px] font-extrabold text-shell-red-dark">
              <Flame size={10} className="mr-0.5 inline" /> LIVE
            </div>
          </div>
          <div className="relative mt-3 grid grid-cols-4 gap-2">
            {PRIZES.map((p) => (
              <div key={p.rank} className={`rounded-xl bg-gradient-to-br ${p.tone} p-2 text-center shadow`}>
                <div className="text-[9px] font-bold uppercase tracking-wide text-white/90">{p.rank}</div>
                <div className="text-xs font-extrabold text-white">₱{p.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-white p-1.5 ring-1 ring-black/5 shadow-sm">
          {([
            { k: "week" as const, label: "This Week" },
            { k: "month" as const, label: "This Month" },
          ]).map((t) => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`rounded-xl py-2 text-xs font-bold transition ${active ? "bg-shell-red text-white shadow" : "text-muted-foreground"}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 items-end gap-2">
          {[top3[1], top3[0], top3[2]].map((p, idx) => {
            const isFirst = p.rank === 1;
            const heights = isFirst ? "h-32" : p.rank === 2 ? "h-24" : "h-20";
            const icons = { 1: Crown, 2: Medal, 3: Medal } as const;
            const Icon = icons[p.rank as 1 | 2 | 3];
            const tones = {
              1: "from-shell-yellow to-[#caa416]",
              2: "from-[#cbd5e1] to-[#64748b]",
              3: "from-shell-amber to-[#b46a1e]",
            }[p.rank as 1 | 2 | 3];
            return (
              <div key={p.rank} className={`flex flex-col items-center ${idx === 1 ? "order-2" : idx === 0 ? "order-1" : "order-3"}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tones} text-white shadow-md`}>
                  <Icon size={22} />
                </div>
                <div className="mt-1 text-xs font-extrabold text-foreground">{p.name}</div>
                <div className="text-[10px] text-muted-foreground">₱{p.earned.toLocaleString()}</div>
                <div className={`mt-1.5 flex w-full items-center justify-center rounded-t-xl bg-gradient-to-b ${tones} ${heights} text-2xl font-black text-white shadow-inner`}>
                  {p.rank}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest */}
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
          {rest.map((r, i) => {
            const isYou = r.name === "Juan D.";
            return (
              <div
                key={r.rank}
                className={`flex items-center gap-3 px-4 py-3 ${i !== rest.length - 1 ? "border-b border-border" : ""} ${isYou ? "bg-shell-yellow-soft/50" : ""}`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-extrabold text-foreground">
                  {r.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
                    {r.name} {isYou && <span className="rounded-full bg-shell-red px-2 py-0.5 text-[9px] font-bold text-white">YOU</span>}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{r.team} members</div>
                </div>
                <div className="flex items-center gap-1 text-sm font-extrabold text-shell-green">
                  <TrendingUp size={12} /> ₱{r.earned.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        <p className="px-1 text-center text-[11px] text-muted-foreground">
          Rankings update every 5 minutes. Prizes paid out on the 1st of every month.
        </p>
      </section>
    </SubPage>
  );
}
