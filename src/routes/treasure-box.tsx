import { createFileRoute, Link } from "@tanstack/react-router";
import { Send, ChevronRight, Gift, Sparkles, Clock } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/treasure-box")({
  head: () => ({
    meta: [
      { title: "Treasure Box — Shell Oil" },
      { name: "description", content: "Enter your secret key to claim daily Shell Oil rewards." },
    ],
  }),
  component: TreasurePage,
});

function TreasurePage() {
  return (
    <SubPage title="Treasure Box" icon={<Gift size={26} className="text-white" />} subtitle="Daily reward · Limited time">
      <section className="space-y-4">
        {/* Hero box */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-shell-yellow-soft via-white to-shell-yellow-soft p-6 text-center shadow-[0_12px_40px_-16px_rgba(221,29,33,0.25)]">
          <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-shell-yellow/30 blur-2xl" />
          <span className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-shell-red/10 blur-xl" />
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-shell-amber to-shell-red shadow-[0_18px_40px_-12px_rgba(221,29,33,0.45)]">
            <Gift size={64} className="text-white drop-shadow" strokeWidth={1.8} />
            <span className="absolute inset-x-5 top-1/2 h-1 -translate-y-1/2 rounded-full bg-shell-yellow" />
          </div>
          <h2 className="relative mt-4 text-2xl font-extrabold tracking-[0.15em] text-shell-red-dark">TREASURE BOX</h2>
          <p className="relative mt-1 text-xs text-muted-foreground">Enter your secret key to claim today's reward</p>
          <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-shell-red/10 px-3 py-1 text-[11px] font-bold text-shell-red">
            <Clock size={12} /> Resets in 14h 22m
          </div>
        </div>

        {/* Telegram channel */}
        <Link
          to="/channel"
          className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-[0_8px_24px_-14px_rgba(221,29,33,0.18)] ring-1 ring-black/5 active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-md">
            <Send size={22} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-extrabold text-foreground">Get Code on Telegram</span>
            <span className="block text-[11px] text-muted-foreground">Daily codes on our official channel</span>
          </span>
          <ChevronRight size={18} className="text-muted-foreground" />
        </Link>

        {/* Form */}
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_24px_-14px_rgba(221,29,33,0.18)] ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-shell-red" />
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Secret Key</div>
          </div>
          <input
            placeholder="Enter treasure key here"
            className="mt-3 w-full rounded-2xl border-2 border-dashed border-shell-red/30 bg-shell-yellow-soft/40 px-4 py-4 text-center font-mono text-base font-bold tracking-[0.2em] text-shell-red-dark outline-none placeholder:text-muted-foreground/60 placeholder:font-normal placeholder:tracking-normal"
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Link
              to="/"
              className="col-span-1 rounded-2xl bg-muted py-3.5 text-center text-sm font-bold text-muted-foreground active:scale-[0.99]"
            >
              Cancel
            </Link>
            <button className="col-span-2 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-md active:scale-[0.99]">
              Open Box
            </button>
          </div>
        </div>
      </section>
    </SubPage>
  );
}
