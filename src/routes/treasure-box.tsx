import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Send, ChevronRight, Package } from "lucide-react";

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
    <div className="min-h-screen bg-[#0B0805] text-white">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[radial-gradient(ellipse_at_top,#2a1605_0%,#0B0805_70%)] pb-24">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 pt-5">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-shell-yellow/30 bg-white/5 text-shell-yellow"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-base font-extrabold tracking-[0.3em] text-shell-yellow">TREASURE BOX</h1>
          <div className="w-10" />
        </header>

        {/* Rays + chest */}
        <section className="relative mx-auto mt-10 flex h-72 w-72 items-center justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1.5 w-44 origin-left rounded-full bg-gradient-to-r from-shell-yellow/40 to-transparent"
              style={{ transform: `rotate(${i * 30}deg) translateX(40px)` }}
            />
          ))}
          <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-shell-amber to-shell-red shadow-[0_20px_60px_-10px_rgba(255,213,0,0.4)]">
            <Package size={88} className="text-white drop-shadow" strokeWidth={1.8} />
            <span className="absolute inset-x-6 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-shell-yellow" />
          </div>
        </section>

        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-[0.25em] text-shell-yellow">TREASURE BOX</h2>
        <p className="mt-2 text-center text-sm text-white/60">Enter your secret key to claim your reward</p>

        {/* Telegram CTA */}
        <div className="mx-4 mt-6 rounded-2xl border border-sky-400/40 bg-sky-500/10 p-4">
          <button className="flex w-full items-center gap-3 text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white">
              <Send size={22} />
            </span>
            <span className="flex-1">
              <span className="block text-base font-extrabold">Get Code on Telegram</span>
              <span className="block text-xs text-white/60">Daily codes posted on our official channel</span>
            </span>
            <ChevronRight size={18} className="text-sky-300" />
          </button>
        </div>

        {/* Form */}
        <div className="mx-4 mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-[11px] font-bold tracking-wider text-white/50">SECRET KEY</div>
          <input
            placeholder="Enter treasure key here"
            className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-center text-base text-white outline-none placeholder:text-white/40"
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Link
              to="/"
              className="col-span-1 rounded-xl border border-white/15 py-3.5 text-center text-sm font-bold text-white/80"
            >
              Cancel
            </Link>
            <button className="col-span-2 rounded-xl bg-gradient-to-r from-shell-yellow to-shell-amber py-3.5 text-sm font-extrabold uppercase tracking-wider text-shell-red-dark shadow-lg">
              ◇ Open Box
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
