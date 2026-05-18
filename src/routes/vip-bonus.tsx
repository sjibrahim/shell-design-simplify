import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Check, Lock, Gift, Sparkles, Trophy, Flame, Star, Users, Clock } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/vip-bonus")({
  head: () => ({
    meta: [
      { title: "VIP Bonus — Shell Oil" },
      { name: "description", content: "Earn massive bonuses as your team investment grows. Up to ₱4,000 on ₱50K." },
    ],
  }),
  component: VipBonusPage,
});

const CURRENT_TEAM = 12500; // demo: user's current team investment

const TIERS = [
  { invest: 5000,  bonus: 400,  label: "Starter",  tone: "from-shell-amber/80 to-shell-amber" },
  { invest: 10000, bonus: 800,  label: "Bronze",   tone: "from-shell-amber to-[#b46a1e]" },
  { invest: 20000, bonus: 1600, label: "Silver",   tone: "from-[#9ca3af] to-[#4b5563]" },
  { invest: 30000, bonus: 2400, label: "Gold",     tone: "from-shell-yellow to-[#caa416]" },
  { invest: 40000, bonus: 3200, label: "Platinum", tone: "from-shell-red to-shell-red-dark" },
  { invest: 50000, bonus: 4000, label: "Diamond",  tone: "from-[#7c3aed] to-[#4c1d95]" },
];

const EXTRA_OFFERS = [
  { icon: Flame,    title: "First Recharge Bonus",   desc: "Get +20% extra credit on your first ₱5,000 recharge.", badge: "+20%",     tint: "bg-shell-red/10 text-shell-red" },
  { icon: Star,     title: "Weekly Top-Up Reward",   desc: "Recharge ₱10K in 7 days → ₱500 instant bonus.",         badge: "₱500",     tint: "bg-shell-yellow/30 text-[#8a6500]" },
  { icon: Users,    title: "Invite 5 Active Friends", desc: "Each friend recharges ₱500+ → you earn ₱250 each.",    badge: "₱250 × 5", tint: "bg-shell-green/15 text-shell-green" },
  { icon: Gift,     title: "Birthday Surprise",       desc: "Verified users get a ₱200 birthday gift voucher.",      badge: "₱200",     tint: "bg-pink-500/10 text-pink-600" },
  { icon: Trophy,   title: "Monthly Leaderboard",     desc: "Top 10 inviters share a ₱50,000 prize pool.",            badge: "₱50K",     tint: "bg-shell-amber/15 text-shell-amber" },
  { icon: Sparkles, title: "Lucky Spin",              desc: "Every ₱1K recharge unlocks a free lucky-wheel spin.",   badge: "FREE",     tint: "bg-purple-500/10 text-purple-600" },
];

function VipBonusPage() {
  const nextTier = TIERS.find((t) => CURRENT_TEAM < t.invest) ?? TIERS[TIERS.length - 1];
  const progress = Math.min(100, (CURRENT_TEAM / nextTier.invest) * 100);

  return (
    <SubPage title="VIP Bonus" icon={<Crown size={26} className="text-white" />} subtitle="Grow your team, multiply rewards">
      <section className="space-y-4">
        {/* Progress hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-shell-red via-shell-red-dark to-[#7a0f12] p-5 text-white shadow-[0_18px_40px_-18px_rgba(221,29,33,0.55)]">
          <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-shell-yellow/20 blur-2xl" />
          <span className="pointer-events-none absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-white/10 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-shell-yellow">
              <Sparkles size={12} /> Your Team Investment
            </div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-extrabold">₱{CURRENT_TEAM.toLocaleString()}</span>
              <span className="mb-1 text-xs text-white/70">/ ₱{nextTier.invest.toLocaleString()}</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-shell-yellow to-shell-amber"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-white/80">Next: <b className="text-shell-yellow">{nextTier.label}</b></span>
              <span className="font-bold text-shell-yellow">+₱{nextTier.bonus} bonus</span>
            </div>
          </div>
        </div>

        {/* Tier list */}
        <div>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Bonus Milestones</h2>
            <span className="text-[10px] font-bold text-muted-foreground">6 Tiers</span>
          </div>
          <div className="space-y-3">
            {TIERS.map((t) => {
              const unlocked = CURRENT_TEAM >= t.invest;
              return (
                <div
                  key={t.invest}
                  className={`relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm ${
                    unlocked ? "ring-shell-green/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${t.tone} text-white shadow-md`}>
                      {unlocked ? <Check size={22} strokeWidth={3} /> : <Lock size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-foreground">{t.label}</span>
                        {unlocked && (
                          <span className="rounded-full bg-shell-green/15 px-2 py-0.5 text-[9px] font-bold uppercase text-shell-green">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-muted-foreground">
                        Team invest ₱{t.invest.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Bonus</div>
                      <div className="text-lg font-extrabold text-shell-red">+₱{t.bonus.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extra offers */}
        <div>
          <div className="mb-2 flex items-center gap-2 px-1">
            <Sparkles size={14} className="text-shell-red" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">More Offers For You</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {EXTRA_OFFERS.map((o) => {
              const Icon = o.icon;
              return (
                <div key={o.title} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${o.tint}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-foreground">{o.title}</div>
                    <div className="text-[11px] text-muted-foreground">{o.desc}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-shell-yellow-soft px-2.5 py-1 text-[10px] font-extrabold text-[#8a6500]">
                    {o.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Limited time banner */}
        <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-shell-yellow-soft to-white p-4 ring-1 ring-shell-yellow/40">
          <Clock size={16} className="text-shell-red" />
          <p className="flex-1 text-[12px] font-semibold text-foreground">
            All bonuses are valid for <b className="text-shell-red">limited time only</b>. Build your team now!
          </p>
        </div>

        <Link
          to="/team"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md active:scale-[0.99]"
        >
          <Users size={18} /> Invite Team & Claim Bonus
        </Link>
      </section>
    </SubPage>
  );
}
