import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Gift, ChevronRight, Users, Wallet, Share2, Crown, ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import shellLogo from "@/assets/shell-logo.png";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Promotion — Shell Oil" },
      { name: "description", content: "Invite friends and earn Shell rebates on 3 levels." },
    ],
  }),
  component: TeamPage,
});

const REFERRAL_CODE = "SHL821047";
const REFERRAL_LINK = `https://shelloil-rewards.live/home/register?invite=${REFERRAL_CODE}`;

const levels = [
  { n: 1, label: "Level 1", sub: "Direct invites", rate: "15%", rebate: "₱0.00", qty: 7,   tier: "Gold",     grad: "from-[#FFD500] to-[#F5A623]", text: "text-[#7a4a00]" },
  { n: 2, label: "Level 2", sub: "Sub-team",       rate: "8%",  rebate: "₱0.00", qty: 14,  tier: "Silver",   grad: "from-[#E6E6E6] to-[#A8A8A8]", text: "text-[#3a3a3a]" },
  { n: 3, label: "Level 3", sub: "Extended",       rate: "3%",  rebate: "₱0.00", qty: 134, tier: "Bronze",   grad: "from-[#E0A372] to-[#8B5A2B]", text: "text-white" },
];

function TeamPage() {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const copy = async (text: string, what: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Shell Oil", text: "Join Shell Oil with my code", url: REFERRAL_LINK }); } catch {}
    } else copy(REFERRAL_LINK, "link");
  };

  return (
    <div className="min-h-screen bg-shell-red">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-gradient-to-b from-shell-red via-[#C81A1E] to-[#FFE9EA] pb-28 shadow-xl">
        {/* Decorative shell pattern */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-shell-yellow/15 blur-2xl" />
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* Header */}
        <header className="relative px-5 pt-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow">
                <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={36} height={36} />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-bold uppercase tracking-widest text-shell-yellow">Shell Rewards</div>
                <div className="text-base font-extrabold text-white">Promotion Center</div>
              </div>
            </div>
            <button
              onClick={share}
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white backdrop-blur active:scale-95"
            >
              <Share2 size={18} />
            </button>
          </div>
        </header>

        <main className="relative space-y-4 px-4">
          {/* Hero stats card */}
          <section className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_18px_40px_-18px_rgba(221,29,33,0.55)]">
            <div className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-shell-red via-shell-yellow to-shell-red" />
            <div className="grid grid-cols-2 gap-4 divide-x divide-border">
              <div className="flex flex-col items-center text-center">
                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-shell-red/10 text-shell-red">
                  <Users size={18} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Total People</div>
                <div className="mt-1 text-3xl font-extrabold text-shell-red">155</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-shell-yellow/30 text-[#8a6500]">
                  <Wallet size={18} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Total Rebate</div>
                <div className="mt-1 text-3xl font-extrabold text-shell-red">₱22,265</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-shell-yellow-soft py-1.5 text-[11px] font-bold text-[#8a6500]">
              <ShieldCheck size={12} /> Verified Shell Partner Program
            </div>
          </section>

          {/* Referral code card */}
          <section className="rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] p-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-shell-yellow text-[#3a2a00]">
                <Gift size={14} />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-shell-yellow">My Invite Code</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 rounded-2xl border border-dashed border-shell-yellow/40 bg-black/30 px-4 py-3 text-center">
                <div className="font-mono text-2xl font-extrabold tracking-[0.3em] text-white">{REFERRAL_CODE}</div>
              </div>
              <button
                onClick={() => copy(REFERRAL_CODE, "code")}
                className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-shell-yellow to-[#F5A623] text-[#3a2a00] shadow-md active:scale-95"
                aria-label="Copy code"
              >
                {copied === "code" ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <button
              onClick={() => copy(REFERRAL_LINK, "link")}
              className="mt-3 flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-left text-[11px] text-white/70 active:bg-white/10"
            >
              <span className="truncate">{REFERRAL_LINK}</span>
              {copied === "link" ? <Check size={14} className="shrink-0 text-shell-yellow" /> : <Copy size={14} className="ml-2 shrink-0" />}
            </button>
          </section>

          {/* Levels */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">Commission Levels</h2>
              <span className="text-[10px] font-bold text-white/70">3 Tiers</span>
            </div>

            {levels.map((lv) => (
              <div
                key={lv.n}
                className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.35)]"
              >
                <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${lv.grad}`} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${lv.grad} shadow`}>
                      <Crown size={18} className={lv.text} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-foreground">{lv.label}</span>
                        <span className={`rounded-full bg-gradient-to-r ${lv.grad} px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${lv.text}`}>
                          {lv.tier}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-muted-foreground">{lv.sub}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-0.5 text-xs font-bold text-shell-red">
                    More <ChevronRight size={14} />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-shell-yellow-soft/40 p-3 text-center">
                  <Cell value={lv.rate} label="Rebate %" accent />
                  <Cell value={lv.rebate} label="Earned" />
                  <Cell value={lv.qty.toString()} label="Members" />
                </div>
              </div>
            ))}
          </section>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function Cell({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div>
      <div className={`text-lg font-extrabold leading-tight ${accent ? "text-shell-red" : "text-foreground"}`}>{value}</div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
