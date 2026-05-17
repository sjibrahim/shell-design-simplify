import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Gift, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Promotion — Shell Oil" },
      { name: "description", content: "Invite friends and earn rebates on 3 levels." },
    ],
  }),
  component: TeamPage,
});

const REFERRAL_LINK = "https://shelloil-rewards.live/home/register?invite=SHL821047";

const levels = [
  { n: 1, label: "First Level",  rate: "15%", rebate: "₱0.00", qty: 7,   color: "from-shell-amber to-[#d98a14]" },
  { n: 2, label: "Second Level", rate: "8%",  rebate: "₱0.00", qty: 14,  color: "from-[#C0C0C0] to-[#7d7d7d]" },
  { n: 3, label: "Third Level",  rate: "3%",  rebate: "₱0.00", qty: 134, color: "from-[#cd7f32] to-[#7a4c1d]" },
];

function TeamPage() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-shell-red">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-gradient-to-b from-shell-red via-shell-red to-[#E5484D] pb-28 shadow-xl">
        {/* Title */}
        <header className="px-5 pt-6 pb-4 text-center">
          <h1 className="text-2xl font-extrabold text-white">Promotion</h1>
        </header>

        <main className="space-y-4 px-4">
          {/* Total people / rebate */}
          <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
            <div className="grid grid-cols-2 gap-4 divide-x divide-border">
              <div className="text-center">
                <div className="text-sm font-semibold text-muted-foreground">Total People</div>
                <div className="mt-3 text-4xl font-extrabold text-shell-red">155</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-muted-foreground">Total rebate</div>
                <div className="mt-3 text-4xl font-extrabold text-shell-red">₱22,265</div>
              </div>
            </div>
          </section>

          {/* Invitation link */}
          <section className="rounded-2xl bg-shell-yellow-soft p-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white">
                <Gift size={24} className="text-shell-red" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-extrabold text-foreground">Invitation Link</div>
                <div className="truncate text-[11px] font-semibold text-shell-red">{REFERRAL_LINK}</div>
              </div>
              <button
                onClick={copy}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-shell-red to-shell-red-dark px-4 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </section>

          {/* Levels */}
          {levels.map((lv) => (
            <section key={lv.n} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${lv.color} text-xs font-extrabold text-white shadow`}>
                    {lv.n}
                  </div>
                  <h2 className="text-base font-extrabold text-white">{lv.label}</h2>
                </div>
                <button className="flex items-center gap-0.5 text-sm font-bold text-shell-yellow">
                  View more <ChevronRight size={14} />
                </button>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="grid grid-cols-3 gap-2 text-white">
                  <Cell value={lv.rate} label="Rebate ratio" />
                  <Cell value={lv.rebate} label="Rebate" />
                  <Cell value={lv.qty.toString()} label="Quantity" />
                </div>
              </div>
            </section>
          ))}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-extrabold leading-tight">{value}</div>
      <div className="mt-1 text-xs text-white/85">{label}</div>
    </div>
  );
}
