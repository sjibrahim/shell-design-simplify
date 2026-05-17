import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, CreditCard } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GradientHeader } from "@/components/GradientHeader";
import shellLogo from "@/assets/shell-logo.png";

export const Route = createFileRoute("/team")({
  component: TeamPage,
});

const levels = [
  { key: "1", label: "Lv1", count: 7, earn: "₱500", color: "bg-shell-amber" },
  { key: "2", label: "Lv2", count: 14, earn: "₱0", color: "bg-shell-red" },
  { key: "3", label: "Lv3", count: 134, earn: "₱21,765", color: "bg-shell-red-dark" },
] as const;

const membersByLevel: Record<string, { phone: string; date: string; recharge: string; withdraw: string }[]> = {
  "1": [
    { phone: "999****996", date: "13 May 2026, 08:16 PM", recharge: "₱0.00", withdraw: "₱0.00" },
    { phone: "999****997", date: "13 May 2026, 08:16 PM", recharge: "₱500.00", withdraw: "₱120.00" },
    { phone: "917****221", date: "12 May 2026, 04:02 PM", recharge: "₱0.00", withdraw: "₱0.00" },
  ],
  "2": [
    { phone: "923****118", date: "10 May 2026, 09:31 AM", recharge: "₱1,200.00", withdraw: "₱300.00" },
    { phone: "918****452", date: "09 May 2026, 06:14 PM", recharge: "₱0.00", withdraw: "₱0.00" },
  ],
  "3": [
    { phone: "920****007", date: "08 May 2026, 11:45 AM", recharge: "₱8,400.00", withdraw: "₱2,100.00" },
    { phone: "915****889", date: "07 May 2026, 03:22 PM", recharge: "₱13,365.00", withdraw: "₱4,200.00" },
  ],
};

function TeamPage() {
  const [active, setActive] = useState<"1" | "2" | "3">("1");
  const members = membersByLevel[active];

  return (
    <PageShell>
      <GradientHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Users size={28} className="text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Team</h1>
            <p className="mt-1 text-sm text-white/80">Track your referral network & earnings</p>
          </div>
        </div>
      </GradientHeader>

      <main className="relative z-10 -mt-10 space-y-5 px-4">
        {/* Top stats */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-shell-red/10 text-shell-red">
                <Users size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-muted-foreground">TOTAL TEAM</div>
                <div className="text-xl font-extrabold">155</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-shell-amber/15 text-shell-amber">
                <CreditCard size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-muted-foreground">T RECHARGE</div>
                <div className="text-xl font-extrabold">₱22,265</div>
              </div>
            </div>
          </div>
        </section>

        {/* Level breakdown */}
        <section className="overflow-hidden rounded-3xl bg-white pb-4 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="grid grid-cols-3 divide-x divide-border">
            {levels.map((lv) => (
              <div key={lv.key} className="px-3 pt-0 text-center">
                <div className={`mx-auto -mt-0 mb-3 w-fit rounded-b-2xl px-5 py-1.5 text-white shadow ${lv.color}`}>
                  <span className="text-base font-extrabold">{lv.label}</span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">{lv.count}</div>
                <div className="mt-1 text-base font-bold text-shell-red">{lv.earn}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team members */}
        <section>
          <div className="mb-3 flex items-center gap-2 px-1">
            <span className="h-5 w-1 rounded-full bg-shell-red" />
            <h2 className="text-lg font-extrabold text-foreground">Team Members</h2>
          </div>

          {/* Level tabs */}
          <div className="mb-4 flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]">
            {levels.map((lv) => {
              const isActive = active === lv.key;
              return (
                <button
                  key={lv.key}
                  onClick={() => setActive(lv.key as "1" | "2" | "3")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                    isActive ? "bg-shell-red text-white shadow" : "text-muted-foreground"
                  }`}
                >
                  Level {lv.key}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive ? "bg-white/20 text-white" : "bg-shell-red/10 text-shell-red"
                    }`}
                  >
                    {lv.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.phone}
                className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]"
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-shell-yellow/30 p-1">
                    <img src={shellLogo} alt="" className="h-full w-full object-contain" width={48} height={48} loading="lazy" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold">{m.phone}</div>
                    <div className="text-sm text-muted-foreground">{m.date}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-border border-t border-border py-3 text-center">
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground">TOTAL RECHARGE</div>
                    <div className="text-base font-extrabold text-shell-green">{m.recharge}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground">TOTAL WITHDRAW</div>
                    <div className="text-base font-extrabold text-shell-amber">{m.withdraw}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
