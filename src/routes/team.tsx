import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  TrendingUp,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "My Team — Shell Oil" },
      { name: "description", content: "Track your Shell Oil referral network across 3 levels." },
    ],
  }),
  component: TeamPage,
});

const REFERRAL_CODE = "SHL821047";

const levels = [
  {
    key: "1",
    label: "Level 1",
    badge: "Direct",
    count: 7,
    earn: "₱500",
    rate: "10%",
    color: "from-shell-amber to-[#d98a14]",
    chipBg: "bg-shell-amber/15 text-shell-amber",
  },
  {
    key: "2",
    label: "Level 2",
    badge: "Indirect",
    count: 14,
    earn: "₱0",
    rate: "5%",
    color: "from-shell-red to-shell-red-dark",
    chipBg: "bg-shell-red/10 text-shell-red",
  },
  {
    key: "3",
    label: "Level 3",
    badge: "Network",
    count: 134,
    earn: "₱21,765",
    rate: "2%",
    color: "from-[#7a0d10] to-[#4a0608]",
    chipBg: "bg-shell-red-dark/15 text-shell-red-dark",
  },
] as const;

type LvKey = (typeof levels)[number]["key"];

const membersByLevel: Record<LvKey, { name: string; phone: string; date: string; recharge: string; withdraw: string; status: "active" | "new" | "idle" }[]> = {
  "1": [
    { name: "Juan S.",   phone: "+63 917 ***4996", date: "13 May, 08:16 PM", recharge: "₱0.00",      withdraw: "₱0.00",   status: "idle" },
    { name: "Maria R.",  phone: "+63 918 ***7221", date: "13 May, 08:16 PM", recharge: "₱500.00",    withdraw: "₱120.00", status: "active" },
    { name: "Carlo M.",  phone: "+63 920 ***0114", date: "12 May, 04:02 PM", recharge: "₱0.00",      withdraw: "₱0.00",   status: "new" },
  ],
  "2": [
    { name: "Joy D.",    phone: "+63 923 ***8118", date: "10 May, 09:31 AM", recharge: "₱1,200.00",  withdraw: "₱300.00", status: "active" },
    { name: "Paolo L.",  phone: "+63 918 ***4452", date: "09 May, 06:14 PM", recharge: "₱0.00",      withdraw: "₱0.00",   status: "idle" },
  ],
  "3": [
    { name: "Reyna T.",  phone: "+63 920 ***0007", date: "08 May, 11:45 AM", recharge: "₱8,400.00",  withdraw: "₱2,100.00", status: "active" },
    { name: "Andres B.", phone: "+63 915 ***8899", date: "07 May, 03:22 PM", recharge: "₱13,365.00", withdraw: "₱4,200.00", status: "active" },
  ],
};

const statusStyle: Record<"active" | "new" | "idle", string> = {
  active: "bg-shell-green/15 text-shell-green",
  new: "bg-shell-yellow/30 text-shell-red-dark",
  idle: "bg-muted text-muted-foreground",
};

function TeamPage() {
  const [active, setActive] = useState<LvKey>("1");
  const [copied, setCopied] = useState(false);
  const members = membersByLevel[active];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const totalMembers = levels.reduce((sum, lv) => sum + lv.count, 0);
  const totalEarned = "₱22,265";

  return (
    <PageShell>
      {/* Header */}
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-5 pb-28 pt-6 text-white">
        <span className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-shell-yellow/10" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-[0.25em] text-shell-yellow">MY TEAM</div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Your Network</h1>
          </div>
          <button
            onClick={copy}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition active:scale-95"
            aria-label="Share referral code"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Hero stats */}
        <div className="relative mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-white/80">
              <Users size={12} /> TOTAL MEMBERS
            </div>
            <div className="mt-1 text-2xl font-extrabold">{totalMembers}</div>
          </div>
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-white/80">
              <TrendingUp size={12} /> TOTAL EARNED
            </div>
            <div className="mt-1 text-2xl font-extrabold text-shell-yellow">{totalEarned}</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 -mt-16 space-y-5 px-4">
        {/* Referral code card */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-shell-yellow via-[#FFE066] to-shell-yellow p-[2px] shadow-[0_10px_40px_-12px_rgba(255,213,0,0.5)]">
          <div className="flex items-center gap-3 rounded-[calc(1.5rem-2px)] bg-white px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white">
              <Sparkles size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold tracking-wider text-muted-foreground">YOUR REFERRAL CODE</div>
              <div className="truncate text-lg font-extrabold tracking-wider text-foreground">{REFERRAL_CODE}</div>
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-xl bg-shell-red px-3.5 py-2.5 text-xs font-bold text-white transition active:scale-95"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>

        {/* Level cards */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="h-5 w-1 rounded-full bg-shell-red" />
            <h2 className="text-lg font-extrabold text-foreground">Commission Levels</h2>
          </div>

          {levels.map((lv) => {
            const isActive = active === lv.key;
            return (
              <button
                key={lv.key}
                onClick={() => setActive(lv.key)}
                className={`group relative w-full overflow-hidden rounded-3xl bg-white text-left shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)] transition ${
                  isActive ? "ring-2 ring-shell-red" : "ring-1 ring-transparent"
                }`}
              >
                <div className="flex items-stretch">
                  <div className={`flex w-24 shrink-0 flex-col items-center justify-center gap-1 bg-gradient-to-br ${lv.color} px-2 py-4 text-white`}>
                    <Crown size={18} className="opacity-80" />
                    <div className="text-xs font-bold tracking-wider opacity-90">{lv.label.toUpperCase()}</div>
                    <div className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">{lv.rate}</div>
                  </div>
                  <div className="flex flex-1 items-center gap-3 px-4 py-3">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-extrabold text-foreground">{lv.count}</div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${lv.chipBg}`}>
                          {lv.badge}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Earned <span className="font-extrabold text-shell-red">{lv.earn}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className={`shrink-0 transition ${isActive ? "text-shell-red" : "text-muted-foreground"}`} />
                  </div>
                </div>
                {isActive && <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-shell-red via-shell-yellow to-shell-red" />}
              </button>
            );
          })}
        </section>

        {/* Members for active level */}
        <section className="space-y-3 pb-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-shell-red" />
              <h2 className="text-lg font-extrabold text-foreground">
                {levels.find((l) => l.key === active)?.label} Members
              </h2>
            </div>
            <span className="rounded-full bg-shell-red/10 px-2.5 py-1 text-xs font-bold text-shell-red">
              {members.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {members.map((m) => {
              const initials = m.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
              return (
                <article
                  key={m.phone}
                  className="overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_-12px_rgba(221,29,33,0.18)]"
                >
                  <div className="flex items-center gap-3 px-3.5 py-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-shell-red to-shell-red-dark text-sm font-extrabold text-white">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-extrabold text-foreground">{m.name}</span>
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyle[m.status]}`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{m.phone}</div>
                      <div className="text-[10px] text-muted-foreground">{m.date}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-border bg-secondary/30 py-2.5 text-center">
                    <div>
                      <div className="text-[9px] font-bold tracking-wider text-muted-foreground">RECHARGE</div>
                      <div className="text-sm font-extrabold text-shell-green">{m.recharge}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold tracking-wider text-muted-foreground">WITHDRAW</div>
                      <div className="text-sm font-extrabold text-shell-amber">{m.withdraw}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
