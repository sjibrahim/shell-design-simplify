import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, CreditCard } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "My Team — Shell Oil" }] }),
  component: TeamPage,
});

const levels = [
  { key: "1", label: "Lv1", count: 7, earn: "₱500" },
  { key: "2", label: "Lv2", count: 14, earn: "₱0" },
  { key: "3", label: "Lv3", count: 134, earn: "₱21,765" },
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
      <AppHeader
        eyebrow="Network"
        title="My Team"
        subtitle="Track your referral network & earnings"
        icon={<Users size={22} />}
      />

      <main className="space-y-5 px-4 pt-5">
        {/* Top stats */}
        <section className="grid grid-cols-2 gap-3">
          <StatTile label="Total Team" value="155" icon={<Users size={18} />} accent="yellow" />
          <StatTile label="T Recharge" value="₱22,265" icon={<CreditCard size={18} />} accent="red" />
        </section>

        {/* Level breakdown */}
        <section className="rounded-2xl border border-shell-ink/10 bg-white">
          <div className="grid grid-cols-3 divide-x divide-shell-ink/10">
            {levels.map((lv) => (
              <div key={lv.key} className="px-3 py-4 text-center">
                <div className="mx-auto inline-block rounded-md bg-shell-ink px-3 py-1 text-xs font-extrabold text-shell-yellow">
                  {lv.label}
                </div>
                <div className="mt-2 text-2xl font-extrabold text-shell-ink">{lv.count}</div>
                <div className="text-sm font-bold text-shell-red">{lv.earn}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team members */}
        <section>
          <SectionTitle>Team Members</SectionTitle>

          <div className="mb-4 flex items-center gap-0 overflow-hidden rounded-xl border border-shell-ink/10 bg-white">
            {levels.map((lv) => {
              const isActive = active === lv.key;
              return (
                <button
                  key={lv.key}
                  onClick={() => setActive(lv.key as "1" | "2" | "3")}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-extrabold transition ${
                    isActive ? "bg-shell-ink text-shell-yellow" : "text-shell-ink/60"
                  }`}
                >
                  Lv {lv.key}
                  <span
                    className={`rounded px-1.5 text-[11px] ${
                      isActive ? "bg-shell-yellow/20 text-shell-yellow" : "bg-shell-ink/5 text-shell-ink/60"
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
                className="overflow-hidden rounded-2xl border-l-4 border-shell-yellow bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-shell-ink text-shell-yellow font-extrabold">
                    {m.phone.slice(-3)}
                  </div>
                  <div>
                    <div className="text-[15px] font-extrabold text-shell-ink">{m.phone}</div>
                    <div className="text-xs text-shell-ink/55">{m.date}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-shell-ink/5 border-t border-shell-ink/5 py-2.5 text-center">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-shell-ink/50">Recharge</div>
                    <div className="text-sm font-extrabold text-shell-green">{m.recharge}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-shell-ink/50">Withdraw</div>
                    <div className="text-sm font-extrabold text-shell-amber">{m.withdraw}</div>
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

function StatTile({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: "yellow" | "red";
}) {
  const ring = accent === "yellow" ? "border-shell-yellow" : "border-shell-red";
  const dot = accent === "yellow" ? "bg-shell-yellow text-shell-ink" : "bg-shell-red text-white";
  return (
    <div className={`rounded-2xl border-l-4 ${ring} bg-white p-4 shadow-sm`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${dot}`}>{icon}</span>
        <div className="text-[10px] font-bold uppercase tracking-wider text-shell-ink/55">{label}</div>
      </div>
      <div className="mt-2 text-2xl font-extrabold text-shell-ink">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 px-1">
      <span className="h-4 w-1 rounded-full bg-shell-red" />
      <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-shell-ink/70">{children}</h2>
    </div>
  );
}
