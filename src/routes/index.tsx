import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { useAuth } from "@/lib/auth";
import { fmtPeso, uGet, uPost } from "@/lib/user-api";
import { toast } from "sonner";

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

interface ApiPlan {
  id: number;
  name: string;
  price: string | number;
  daily_income: string | number;
  total_days: number;
  total_income: string | number;
  image_url?: string | null;
}


function HomePage() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [confirmPlan, setConfirmPlan] = useState<ApiPlan | null>(null);

  useEffect(() => {
    uGet<{ ok: true; items: ApiPlan[] }>("/api/u/plans")
      .then((r) => setPlans(r.items))
      .catch(() => setPlans([]))
      .finally(() => setLoadingPlans(false));
  }, []);

  const buy = async (p: ApiPlan) => {
    if (!user) { navigate({ to: "/login" }); return; }
    setBuying(p.id);
    try {
      await uPost("/api/u/buy-plan", { plan_id: p.id });
      await refresh();
      setConfirmPlan(null);
      toast.success("Plan purchased successfully", { description: `${p.name} is now active.` });
    } catch (e) { toast.error("Purchase failed", { description: (e as Error).message }); }
    finally { setBuying(null); }
  };

  return (
    <PageShell>
      {/* Top header */}
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-5 pb-28 pt-6 text-white">
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
        {/* Balance */}
        <div className="relative mt-6 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/80">Wallet Balance</div>
          <div className="mt-1 text-3xl font-extrabold">
            {user ? fmtPeso(user.balance) : "—"}
          </div>
          <div className="mt-1 flex gap-4 text-[11px] text-white/80">
            <span>Recharge: <b className="text-white">{user ? fmtPeso(user.total_recharge) : "—"}</b></span>
            <span>Income: <b className="text-white">{user ? fmtPeso(user.total_income) : "—"}</b></span>
          </div>
          {!user && (
            <Link to="/login" className="mt-2 inline-block text-xs font-bold underline">Sign in to see your balance →</Link>
          )}
        </div>
      </header>

      <main className="relative z-10 -mt-16 space-y-5 px-4">
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

          {loadingPlans ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-muted-foreground">Loading plans…</div>
          ) : plans.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-muted-foreground">
              No plans available yet. Add some in the admin panel.
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((p) => (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(221,29,33,0.18)]"
                >
                  <div className="relative aspect-[16/10] w-full">
                    <img
                      src={p.image_url || shellPlan}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      width={1024}
                      height={640}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 text-2xl font-extrabold text-white drop-shadow">{p.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-4">
                    <Stat label="PRICE" value={fmtPeso(p.price)} />
                    <Stat label="DAILY INCOME" value={fmtPeso(p.daily_income)} accent />
                    <Stat label="DURATION" value={`${p.total_days} Days`} />
                    <Stat label="TOTAL PROFIT" value={fmtPeso(p.total_income)} accent />
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      disabled={buying === p.id}
                      onClick={() => user ? setConfirmPlan(p) : navigate({ to: "/login" })}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-3.5 text-base font-bold text-white shadow-md transition active:scale-[0.99] disabled:opacity-60"
                    >
                      <ShoppingCart size={18} />
                      {buying === p.id ? "Purchasing…" : "Purchase Now"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      {confirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={() => setConfirmPlan(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-shell-red/10 text-shell-red">
                <ShoppingCart size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-extrabold text-foreground">Confirm Purchase</h3>
                <p className="mt-1 text-sm text-muted-foreground">Buy {confirmPlan.name} for {fmtPeso(confirmPlan.price)}?</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-muted/50 p-3 text-sm">
              <div className="flex justify-between"><span>Wallet balance</span><b>{fmtPeso(user?.balance ?? 0)}</b></div>
              <div className="mt-1 flex justify-between"><span>Daily income</span><b className="text-shell-green">{fmtPeso(confirmPlan.daily_income)}</b></div>
              <div className="mt-1 flex justify-between"><span>Total return</span><b className="text-shell-red">{fmtPeso(confirmPlan.total_income)}</b></div>
            </div>
            {Number(user?.balance ?? 0) < Number(confirmPlan.price) && (
              <div className="mt-3 rounded-xl bg-shell-red/10 px-3 py-2 text-xs font-bold text-shell-red">Insufficient balance. Please recharge first.</div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => setConfirmPlan(null)} className="rounded-2xl border border-border py-3 text-sm font-bold text-foreground">Cancel</button>
              <button disabled={buying === confirmPlan.id || Number(user?.balance ?? 0) < Number(confirmPlan.price)} onClick={() => void buy(confirmPlan)} className="rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-3 text-sm font-bold text-white disabled:opacity-50">
                {buying === confirmPlan.id ? "Purchasing…" : "Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
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
