import { createFileRoute } from "@tanstack/react-router";
import {
  Headphones,
  CheckCircle2,
  Flame,
  Calendar,
  Users,
  Wallet,
  Share2,
  Gift,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";
import { SubPage } from "@/components/SubPage";

type Mission = {
  title: string;
  desc: string;
  reward: string;
  done: boolean;
  icon: typeof Calendar;
  tint: string;
  progress?: { current: number; total: number };
};

const missions: Mission[] = [
  { title: "Daily Sign-in",        desc: "Open the app and check in", reward: "₱5",   done: true,  icon: Calendar, tint: "bg-shell-yellow/30 text-[#8a6500]" },
  { title: "Invite 1 friend today",desc: "Share your referral link",  reward: "₱50",  done: false, icon: Users,    tint: "bg-shell-red/10 text-shell-red", progress: { current: 0, total: 1 } },
  { title: "Recharge ₱500+",       desc: "Top up your wallet",        reward: "₱20",  done: false, icon: Wallet,   tint: "bg-shell-green/15 text-shell-green", progress: { current: 200, total: 500 } },
  { title: "Purchase any plan",    desc: "Activate daily earnings",   reward: "₱100", done: false, icon: Target,   tint: "bg-shell-amber/15 text-shell-amber" },
  { title: "Share referral link",  desc: "On Messenger, FB or WA",    reward: "₱10",  done: true,  icon: Share2,   tint: "bg-shell-red/10 text-shell-red" },
  { title: "Reach Lv2 team",       desc: "Invite 3 active members",   reward: "₱200", done: false, icon: Trophy,   tint: "bg-shell-yellow/30 text-[#8a6500]", progress: { current: 1, total: 3 } },
];

export const Route = createFileRoute("/mission")({
  head: () => ({ meta: [{ title: "Missions — Shell Oil" }] }),
  component: MissionPage,
});

function MissionPage() {
  const done = missions.filter((m) => m.done).length;
  const total = missions.length;
  const earned = missions.filter((m) => m.done).reduce((s, m) => s + parseInt(m.reward.replace(/\D/g, "")), 0);
  const possible = missions.reduce((s, m) => s + parseInt(m.reward.replace(/\D/g, "")), 0);
  const pct = Math.round((done / total) * 100);

  return (
    <SubPage title="Mission" icon={<Headphones size={24} className="text-white" />} subtitle="Complete tasks to earn bonus rewards">
      <section className="space-y-4">
        {/* Progress hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-shell-red via-shell-red-dark to-[#7a0f12] p-5 text-white shadow-[0_18px_40px_-18px_rgba(221,29,33,0.55)]">
          <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-shell-yellow/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
              <Sparkles size={22} className="text-shell-yellow" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-shell-yellow">Today's Progress</div>
              <div className="text-xl font-extrabold">{done} of {total} completed</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-shell-yellow">₱{earned}</div>
              <div className="text-[10px] text-white/80">of ₱{possible}</div>
            </div>
          </div>
          <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-shell-yellow to-[#ffd84a] shadow-[0_0_12px_rgba(255,193,7,0.6)]" style={{ width: `${pct}%` }} />
          </div>
          <div className="relative mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold ring-1 ring-white/20">
              <Flame size={12} className="text-shell-yellow" /> 7-day streak
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold ring-1 ring-white/20">
              <Gift size={12} className="text-shell-yellow" /> +₱500 weekly bonus
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Daily Tasks</h2>
          <span className="text-[11px] font-bold text-muted-foreground">Resets in 08:43:12</span>
        </div>

        {/* Missions */}
        <div className="space-y-2.5">
          {missions.map((m) => (
            <div
              key={m.title}
              className={`flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 transition ${m.done ? "ring-shell-green/30 opacity-90" : "ring-black/5"}`}
            >
              <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${m.tint}`}>
                <m.icon size={20} strokeWidth={2.2} />
                {m.done && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-shell-green text-white ring-2 ring-white">
                    <CheckCircle2 size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-foreground">{m.title}</span>
                  <span className="rounded-full bg-shell-yellow-soft px-1.5 py-0.5 text-[9px] font-extrabold text-shell-red-dark">+{m.reward}</span>
                </div>
                <div className="truncate text-[11px] text-muted-foreground">{m.desc}</div>
                {m.progress && !m.done && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-shell-red to-shell-yellow" style={{ width: `${(m.progress.current / m.progress.total) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{m.progress.current}/{m.progress.total}</span>
                  </div>
                )}
              </div>
              <button
                disabled={m.done}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
                  m.done
                    ? "bg-shell-green/10 text-shell-green"
                    : "bg-gradient-to-r from-shell-red to-shell-red-dark text-white shadow active:scale-95"
                }`}
              >
                {m.done ? "Claimed" : "Claim"}
              </button>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="flex items-start gap-3 rounded-2xl bg-shell-yellow-soft p-3.5 ring-1 ring-shell-yellow/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-shell-yellow text-shell-red-dark">
            <Trophy size={16} />
          </div>
          <div className="text-[12px] leading-relaxed text-[#6a5000]">
            <b className="text-foreground">Complete all 6 tasks daily</b> to unlock a <b className="text-shell-red">+₱500 weekly streak bonus</b> on Sunday.
          </div>
        </div>
      </section>
    </SubPage>
  );
}
