import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Layers } from "lucide-react";

export const Route = createFileRoute("/income-details")({
  head: () => ({
    meta: [
      { title: "Income Details — Shell Oil" },
      { name: "description", content: "Track when your next daily Shell Oil income is credited." },
    ],
  }),
  component: IncomePage,
});

function useCountdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const next = new Date(now);
  next.setHours(24, 1, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

function IncomePage() {
  const { h, m, s } = useCountdown();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-[#FAF4E6] pb-10 shadow-xl">
        <header className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-4 pb-20 pt-5 text-white">
          <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-shell-yellow/10" />
          <div className="relative flex items-center justify-between">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-xl font-extrabold">Income Details</h1>
            <span className="w-10" />
          </div>
        </header>

        <main className="-mt-12 space-y-6 px-4">
          <section className="rounded-3xl bg-white p-6 text-center shadow-[0_10px_40px_-10px_rgba(221,29,33,0.2)]">
            <div className="flex items-center justify-center gap-2 text-shell-red">
              <span className="h-2.5 w-2.5 rounded-full bg-shell-green" />
              <span className="text-xs font-bold tracking-wider">NEXT INCOME CREDIT</span>
            </div>
            <div className="mt-4 inline-flex items-end justify-center gap-3 rounded-2xl bg-gradient-to-br from-shell-red to-shell-red-dark px-6 py-4 text-white shadow-inner">
              <TimeBlock value={pad(h)} label="HRS" />
              <span className="pb-5 text-3xl font-bold text-shell-yellow/80">:</span>
              <TimeBlock value={pad(m)} label="MIN" />
              <span className="pb-5 text-3xl font-bold text-shell-yellow/80">:</span>
              <TimeBlock value={pad(s)} label="SEC" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Income credited daily at 12:01 AM</p>
          </section>

          <section className="flex flex-col items-center px-6 pt-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-shell-yellow/30 text-shell-red">
              <Layers size={28} />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold">No Active Plans</h2>
            <p className="mt-2 max-w-xs text-base text-muted-foreground">
              Invest in a plan to start earning daily income
            </p>
            <Link
              to="/"
              className="mt-6 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark px-8 py-3.5 text-base font-bold text-white shadow-md"
            >
              Browse Plans
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-4xl font-bold leading-none tabular-nums">{value}</span>
      <span className="mt-1 text-[10px] font-bold tracking-widest text-white/60">{label}</span>
    </div>
  );
}
