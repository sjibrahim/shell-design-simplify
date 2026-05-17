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
  Fuel,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AppHeader } from "@/components/AppHeader";
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
    { name: "Plan 1", price: "₱250", income: "₱62", days: "60 Days", profit: "₱3,720", slots: "0/10" },
    { name: "Plan 2", price: "₱500", income: "₱130", days: "60 Days", profit: "₱7,800", slots: "0/10" },
    { name: "Plan 3", price: "₱1,000", income: "₱280", days: "60 Days", profit: "₱16,800", slots: "2/10" },
  ],
  vip: [
    { name: "VIP 1", price: "₱5,000", income: "₱1,600", days: "45 Days", profit: "₱72,000", slots: "0/5" },
    { name: "VIP 2", price: "₱10,000", income: "₱3,400", days: "45 Days", profit: "₱153,000", slots: "1/5" },
  ],
};

function HomePage() {
  const [tab, setTab] = useState<"daily" | "vip">("daily");
  return (
    <PageShell>
      <AppHeader
        eyebrow="Shell Oil"
        title="Fueling Progress"
        right={
          <Link
            to="/treasure-box"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-shell-yellow"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-shell-red" />
          </Link>
        }
      />

      <main className="space-y-5 px-4 pt-5">
        {/* Marquee balance card */}
        <section className="relative overflow-hidden rounded-2xl bg-shell-ink p-5 text-white shadow-lg">
          <span className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-shell-red/30 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-shell-yellow">Wallet Balance</div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight">
                ₱2,903<span className="text-xl text-white/40">.00</span>
              </div>
              <div className="mt-1 text-xs text-white/60">+₱358 earned this month</div>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-shell-yellow text-shell-ink">
              <Fuel size={20} strokeWidth={2.4} />
            </span>
          </div>
          <div className="relative mt-5 grid grid-cols-4 gap-2">
            {quickActions.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-3 transition active:scale-95"
              >
                <Icon size={18} className="text-shell-yellow" strokeWidth={2.2} />
                <span className="text-[11px] font-bold text-white/80">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Hero banner */}
        <section className="overflow-hidden rounded-2xl border border-shell-ink/10">
          <div className="relative aspect-[16/8] w-full">
            <img
              src={shellHero}
              alt="Shell refinery"
              className="absolute inset-0 h-full w-full object-cover"
              width={1024}
              height={576}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-shell-ink via-shell-ink/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-5 text-white">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-shell-yellow">Energy · Returns</div>
              <div className="mt-1 text-2xl font-extrabold leading-tight">Powering your portfolio</div>
            </div>
          </div>
        </section>

        {/* Side actions */}
        <div className="pointer-events-none fixed bottom-32 right-3 z-40 flex flex-col items-end gap-3">
          <Link
            to="/income-details"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl bg-shell-ink text-shell-yellow shadow-lg ring-1 ring-shell-yellow/30"
            aria-label="Income"
          >
            <FileCheck size={18} />
          </Link>
          <Link
            to="/treasure-box"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl bg-shell-yellow text-shell-ink shadow-lg"
            aria-label="Treasure"
          >
            <Gift size={20} />
          </Link>
        </div>

        {/* Plans */}
        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-shell-red" />
              <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-shell-ink/70">Investment Plans</h2>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-shell-ink p-1">
              {(["daily", "vip"] as const).map((k) => {
                const active = tab === k;
                return (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`rounded-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide transition ${
                      active ? "bg-shell-yellow text-shell-ink" : "text-white/50"
                    }`}
                  >
                    {k === "daily" ? "Daily" : "VIP"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {plans[tab].map((p) => (
              <article
                key={p.name}
                className="overflow-hidden rounded-2xl border border-shell-ink/10 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/9] w-full">
                  <img
                    src={shellPlan}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    width={1024}
                    height={640}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-shell-ink/90 via-shell-ink/30 to-transparent" />
                  <div className="absolute right-3 top-3 rounded-md bg-shell-yellow px-2 py-0.5 text-[11px] font-extrabold text-shell-ink">
                    {p.slots} Slots
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-shell-yellow">
                      {tab === "daily" ? "Daily Income" : "VIP Income"}
                    </div>
                    <div className="text-2xl font-extrabold text-white drop-shadow">{p.name}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 divide-x divide-shell-ink/5 border-b border-shell-ink/5 text-center">
                  <Cell label="Price" value={p.price} />
                  <Cell label="Daily" value={p.income} accent />
                  <Cell label="Days" value={p.days.replace(" Days", "d")} />
                  <Cell label="Profit" value={p.profit} accent />
                </div>
                <div className="p-3">
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-shell-red py-3 text-sm font-extrabold uppercase tracking-wide text-white transition active:bg-shell-red-dark">
                    <ShoppingCart size={16} />
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

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-2 py-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-shell-ink/50">{label}</div>
      <div className={`mt-0.5 text-sm font-extrabold ${accent ? "text-shell-red" : "text-shell-ink"}`}>{value}</div>
    </div>
  );
}
