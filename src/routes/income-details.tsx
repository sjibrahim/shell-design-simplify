import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/income-details")({
  head: () => ({ meta: [{ title: "Income Details — Shell Oil" }] }),
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
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
  };
}

function IncomePage() {
  const { h, m, s } = useCountdown();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    <PageShell>
      <AppHeader title="Income Details" back="/" eyebrow="Daily" />
      <main className="space-y-6 px-4 pt-5">
        <section className="rounded-2xl border-l-4 border-shell-yellow bg-white p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-shell-ink/70">
            <span className="h-2 w-2 rounded-full bg-shell-green" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Next Income Credit</span>
          </div>
          <div className="mt-4 inline-flex items-end justify-center gap-2 rounded-xl bg-shell-ink px-5 py-4 text-white">
            <TimeBlock value={pad(h)} label="HRS" />
            <span className="pb-5 text-2xl font-bold text-shell-yellow/70">:</span>
            <TimeBlock value={pad(m)} label="MIN" />
            <span className="pb-5 text-2xl font-bold text-shell-yellow/70">:</span>
            <TimeBlock value={pad(s)} label="SEC" />
          </div>
          <p className="mt-3 text-sm text-shell-ink/55">Credited daily at 12:01 AM</p>
        </section>

        <section className="flex flex-col items-center px-6 pt-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-shell-ink text-shell-yellow">
            <Layers size={26} />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-shell-ink">No Active Plans</h2>
          <p className="mt-2 max-w-xs text-base text-shell-ink/55">Invest in a plan to start earning daily income</p>
          <Link
            to="/"
            className="mt-6 rounded-xl bg-shell-red px-8 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-md"
          >
            Browse Plans
          </Link>
        </section>
      </main>
    </PageShell>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-4xl font-bold leading-none tabular-nums">{value}</span>
      <span className="mt-1 text-[10px] font-bold tracking-widest text-shell-yellow/70">{label}</span>
    </div>
  );
}
