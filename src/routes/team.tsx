import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Gift, Users, Wallet, Share2, TrendingUp, UserPlus, ShieldCheck, ArrowUpRight } from "lucide-react";
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
  { n: 1, label: "Level 1", sub: "Direct invites", rate: "15%", rebate: "₱0.00", qty: 7,   dot: "bg-shell-red",     ring: "ring-shell-red/30",    badge: "bg-shell-red text-white" },
  { n: 2, label: "Level 2", sub: "Sub-team",       rate: "8%",  rebate: "₱0.00", qty: 14,  dot: "bg-shell-amber",   ring: "ring-shell-amber/30",  badge: "bg-shell-amber text-white" },
  { n: 3, label: "Level 3", sub: "Extended",       rate: "3%",  rebate: "₱0.00", qty: 134, dot: "bg-shell-green",   ring: "ring-shell-green/30",  badge: "bg-shell-green text-white" },
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
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-background pb-28">
        {/* Curved Shell-red header */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-64 rounded-b-[40px] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_60%,#7a0f12_100%)]" />
          <span className="pointer-events-none absolute -right-10 top-4 h-40 w-40 rounded-full bg-shell-yellow/20 blur-2xl" />
          <span className="pointer-events-none absolute left-6 top-28 h-24 w-24 rounded-full bg-white/10 blur-xl" />

          <header className="relative flex items-center justify-between px-5 pt-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md">
                <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={40} height={40} />
              </div>
              <div className="leading-tight text-white">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-shell-yellow">Shell Rewards</div>
                <div className="text-lg font-extrabold">Promotion</div>
              </div>
            </div>
            <button
              onClick={share}
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur active:scale-95"
            >
              <Share2 size={18} />
            </button>
          </header>

          {/* Hero stats — floating white card overlapping curve */}
          <section className="relative mx-4 mt-6">
            <div className="rounded-3xl bg-white p-5 shadow-[0_18px_40px_-18px_rgba(221,29,33,0.45)] ring-1 ring-black/5">
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="flex flex-col items-center px-2">
                  <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-shell-red/10 text-shell-red">
                    <Users size={20} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Total People</div>
                  <div className="mt-0.5 text-3xl font-extrabold text-foreground">155</div>
                </div>
                <div className="flex flex-col items-center px-2">
                  <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-shell-yellow/30 text-[#8a6500]">
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Total Rebate</div>
                  <div className="mt-0.5 text-3xl font-extrabold text-shell-red">₱22,265</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-shell-yellow-soft py-1.5 text-[11px] font-bold text-[#8a6500]">
                <ShieldCheck size={12} /> Verified Shell Partner Program
              </div>
            </div>
          </section>
        </div>

        <main className="relative space-y-4 px-4 pt-4">
          {/* Invite card — light shell style */}
          <section className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-shell-yellow/20" />
            <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-shell-red/5" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-shell-red text-white">
                  <Gift size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">My Invite Code</div>
                  <div className="text-xs font-semibold text-foreground">Share & earn together</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 rounded-2xl border-2 border-dashed border-shell-red/30 bg-shell-yellow-soft/40 px-4 py-3 text-center">
                  <div className="font-mono text-2xl font-extrabold tracking-[0.3em] text-shell-red-dark">{REFERRAL_CODE}</div>
                </div>
                <button
                  onClick={() => copy(REFERRAL_CODE, "code")}
                  className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white shadow-md active:scale-95"
                  aria-label="Copy code"
                >
                  {copied === "code" ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>

              <button
                onClick={() => copy(REFERRAL_LINK, "link")}
                className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2.5 text-left text-[11px] text-muted-foreground transition active:bg-shell-yellow-soft"
              >
                <span className="truncate">{REFERRAL_LINK}</span>
                {copied === "link" ? <Check size={14} className="shrink-0 text-shell-green" /> : <Copy size={14} className="shrink-0 text-shell-red" />}
              </button>
            </div>
          </section>

          {/* Quick actions */}
          <section className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm active:scale-[0.98]">
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Today</div>
                <div className="text-base font-extrabold text-foreground">+12 joined</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-shell-green/15 text-shell-green">
                <UserPlus size={18} />
              </div>
            </button>
            <button className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm active:scale-[0.98]">
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">This Week</div>
                <div className="text-base font-extrabold text-foreground">₱1,245</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-shell-yellow/30 text-[#8a6500]">
                <Wallet size={18} />
              </div>
            </button>
          </section>

          {/* Levels */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Commission Levels</h2>
              <span className="text-[10px] font-bold text-muted-foreground">3 Tiers</span>
            </div>

            {levels.map((lv) => (
              <div
                key={lv.n}
                className={`relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.2)]`}
              >
                <div className={`absolute left-0 top-0 h-full w-1.5 ${lv.dot}`} />
                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-4 ${lv.ring}`}>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${lv.dot} text-sm font-extrabold text-white`}>
                        L{lv.n}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-foreground">{lv.label}</span>
                        <span className={`rounded-full ${lv.badge} px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide`}>
                          {lv.rate}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-muted-foreground">{lv.sub}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-0.5 rounded-full bg-shell-red/10 px-2.5 py-1 text-[11px] font-bold text-shell-red">
                    Details <ArrowUpRight size={12} />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-3">
                  <Cell value={lv.rebate} label="Earned" accent />
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
    <div className="text-center">
      <div className={`text-lg font-extrabold leading-tight ${accent ? "text-shell-red" : "text-foreground"}`}>{value}</div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
