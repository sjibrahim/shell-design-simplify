import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Crown, Medal, Flame, TrendingUp, Sparkles, Timer, Users } from "lucide-react";
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

type Row = { rank: number; name: string; team: number; earned: number; seed: string };

const MONTHLY: Row[] = [
  { rank: 1, name: "Carlos M.", team: 412, earned: 184500, seed: "carlos" },
  { rank: 2, name: "Maria S.",  team: 365, earned: 162300, seed: "maria" },
  { rank: 3, name: "Jose L.",   team: 298, earned: 128900, seed: "jose" },
  { rank: 4, name: "Anna R.",   team: 245, earned: 98200,  seed: "anna" },
  { rank: 5, name: "Pedro G.",  team: 221, earned: 87400,  seed: "pedro" },
  { rank: 6, name: "Lisa T.",   team: 188, earned: 71200,  seed: "lisa" },
  { rank: 7, name: "Mark D.",   team: 165, earned: 64500,  seed: "mark" },
  { rank: 8, name: "Sofia P.",  team: 152, earned: 58900,  seed: "sofia" },
  { rank: 9, name: "Juan D.",   team: 155, earned: 22265,  seed: "juan" },
  { rank: 10, name: "Eric V.",  team: 138, earned: 49800,  seed: "eric" },
];

const avatarUrl = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=ffd54f,ffb74d,ff8a65,e57373,f48fb1,ce93d8,9fa8da,90caf9,80deea,80cbc4,a5d6a7`;

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

        {/* Live countdown bar */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
            <Timer size={14} className="text-shell-red" /> Season ends in
          </div>
          <div className="flex items-center gap-1 font-mono text-[12px] font-extrabold text-shell-red">
            <span className="rounded-md bg-shell-red/10 px-1.5 py-0.5">12d</span>
            <span className="rounded-md bg-shell-red/10 px-1.5 py-0.5">08h</span>
            <span className="rounded-md bg-shell-red/10 px-1.5 py-0.5">43m</span>
          </div>
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
                <div className="relative">
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-br ${tones} p-1 shadow-lg ${isFirst ? "h-20 w-20" : "h-16 w-16"}`}>
                    <img src={avatarUrl(p.seed)} alt={p.name} className={`rounded-full bg-white object-cover ${isFirst ? "h-[72px] w-[72px]" : "h-[56px] w-[56px]"}`} />
                  </div>
                  <div className={`absolute -top-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${tones} text-white shadow ring-2 ring-white`}>
                    <Icon size={14} strokeWidth={2.6} />
                  </div>
                  {isFirst && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-shell-red px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white shadow ring-2 ring-white">
                      Champion
                    </span>
                  )}
                </div>
                <div className="mt-2.5 text-xs font-extrabold text-foreground">{p.name}</div>
                <div className="text-[10px] font-bold text-shell-green">₱{p.earned.toLocaleString()}</div>
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
            const movement = (r.rank * 7) % 5 - 2; // fake delta -2..+2
            return (
              <div
                key={r.rank}
                className={`flex items-center gap-3 px-3.5 py-3 ${i !== rest.length - 1 ? "border-b border-border" : ""} ${isYou ? "bg-shell-yellow-soft/60" : ""}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold ${isYou ? "bg-shell-red text-white" : "bg-muted text-foreground"}`}>
                  {r.rank}
                </div>
                <div className="relative shrink-0">
                  <img src={avatarUrl(r.seed)} alt={r.name} className="h-10 w-10 rounded-full bg-muted object-cover ring-2 ring-white shadow-sm" />
                  {isYou && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-shell-green ring-2 ring-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
                    {r.name}
                    {isYou && <span className="rounded-full bg-shell-red px-2 py-0.5 text-[9px] font-bold text-white">YOU</span>}
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
                    <Users size={10} /> {r.team} members
                    <span className={`ml-1 rounded-full px-1.5 font-bold ${movement > 0 ? "bg-shell-green/15 text-shell-green" : movement < 0 ? "bg-shell-red/10 text-shell-red" : "bg-muted text-muted-foreground"}`}>
                      {movement > 0 ? `▲${movement}` : movement < 0 ? `▼${Math.abs(movement)}` : "—"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-sm font-extrabold text-shell-green">
                    <TrendingUp size={11} /> ₱{r.earned.toLocaleString()}
                  </div>
                  <div className="text-[9.5px] font-bold uppercase tracking-wide text-muted-foreground">earned</div>
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
