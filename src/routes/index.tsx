import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Wallet,
  CreditCard,
  Send,
  Headphones,
  FileCheck,
  Gift,
  Bell,
  ShoppingCart,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import shellLogo from "@/assets/shell-logo.png";
import shellHero from "@/assets/shell-hero.jpg";
import shellPlan from "@/assets/shell-plan.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shell Oil — Home" },
      { name: "description", content: "Shell Oil investment plans and daily income dashboard." },
    ],
  }),
  component: HomePage,
});

const quickActions = [
  { to: "/recharge", label: "Recharge", icon: Wallet },
  { to: "/withdraw", label: "Withdraw", icon: CreditCard },
  { to: "/channel", label: "Channel", icon: Send },
  { to: "/mission", label: "Mission", icon: Headphones },
] as const;

const plans = {
  daily: [
    { name: "Plan 1", price: "₱250.00", income: "₱62.00", days: "60 Days", profit: "₱3,720.00", slots: "0/10" },
    { name: "Plan 2", price: "₱500.00", income: "₱130.00", days: "60 Days", profit: "₱7,800.00", slots: "0/10" },
    { name: "Plan 3", price: "₱1,000.00", income: "₱280.00", days: "60 Days", profit: "₱16,800.00", slots: "2/10" },
  ],
  vip: [
    { name: "VIP 1", price: "₱5,000.00", income: "₱1,600.00", days: "45 Days", profit: "₱72,000.00", slots: "0/5" },
    { name: "VIP 2", price: "₱10,000.00", income: "₱3,400.00", days: "45 Days", profit: "₱153,000.00", slots: "1/5" },
  ],
};

function HomePage() {
  const [tab, setTab] = useState<"daily" | "vip">("daily");

  return (
    <PageShell>
      {/* Top header */}
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-5 pb-20 pt-6 text-white">
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-shell-yellow/10" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg">
            <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={56} height={56} />
          </div>
          <h1 className="flex-1 text-2xl font-extrabold tracking-tight">
            Shell<span className="text-shell-yellow">Oil</span>
          </h1>
          <Link
            to="/treasure-box"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition active:scale-95"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Link>
        </div>
      </header>

      <main className="-mt-16 space-y-5 px-4">
        {/* Hero banner */}
        <section className="overflow-hidden rounded-3xl shadow-[0_10px_40px_-10px_rgba(221,29,33,0.25)]">
          <div className="relative aspect-[16/9] w-full">
            <img
              src={shellHero}
              alt="Shell oil refinery at sunset"
              className="absolute inset-0 h-full w-full object-cover"
              width={1024}
              height={576}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-shell-red-dark/70 via-shell-red/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
              <div className="text-3xl font-extrabold leading-tight tracking-tight">FUELING</div>
              <div className="text-3xl font-extrabold leading-tight tracking-tight text-shell-yellow">PROGRESS</div>
              <div className="mt-1 text-[10px] font-bold tracking-[0.3em] text-white/80">INVESTMENT · ENERGY</div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white shadow-md transition group-active:scale-95">
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <span className="text-[12px] font-bold text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Floating side actions */}
        <div className="pointer-events-none fixed bottom-32 right-3 z-40 flex w-12 flex-col items-end gap-3">
          <Link
            to="/income-details"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-shell-red text-white shadow-lg"
            aria-label="Proofs"
          >
            <FileCheck size={20} />
          </Link>
          <Link
            to="/treasure-box"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-shell-yellow text-shell-red-dark shadow-lg"
            aria-label="Treasure box"
          >
            <Gift size={22} />
          </Link>
        </div>

        {/* Investment plans */}
        <section>
          <div className="mb-3 flex items-center gap-2 px-1">
            <span className="h-5 w-1 rounded-full bg-shell-red" />
            <h2 className="text-lg font-extrabold text-foreground">Investment Plans</h2>
          </div>

          <div className="mb-4 flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]">
            {(["daily", "vip"] as const).map((k) => {
              const active = tab === k;
              return (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                    active ? "bg-shell-red text-white shadow" : "text-muted-foreground"
                  }`}
                >
                  {k === "daily" ? "Daily-Income" : "VIP-Income"}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {plans[tab].map((p) => (
              <article
                key={p.name}
                className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(221,29,33,0.18)]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src={shellPlan}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    width={1024}
                    height={640}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-shell-red">
                    {p.slots} Slots
                  </span>
                  <div className="absolute bottom-3 left-4 text-2xl font-extrabold text-white drop-shadow">{p.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4">
                  <Stat label="PRICE" value={p.price} />
                  <Stat label="DAILY INCOME" value={p.income} accent />
                  <Stat label="DURATION" value={p.days} />
                  <Stat label="TOTAL PROFIT" value={p.profit} accent />
                </div>
                <div className="px-4 pb-4">
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-3.5 text-base font-bold text-white shadow-md transition active:scale-[0.99]">
                    <ShoppingCart size={18} />
                    Purchase Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 px-3 py-2.5">
      <div className="text-[10px] font-bold tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-base font-extrabold ${accent ? "text-shell-amber" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
