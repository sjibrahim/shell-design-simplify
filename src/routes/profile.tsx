import { createFileRoute } from "@tanstack/react-router";
import {
  CreditCard,
  Wallet,
  RefreshCw,
  ShoppingBag,
  Landmark,
  FileText,
  Building2,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Shell Oil" }] }),
  component: ProfilePage,
});

const stats = [
  { icon: CreditCard, label: "Balance", value: "₱2,903", tint: "text-shell-yellow" },
  { icon: Wallet, label: "Recharged", value: "₱9,500", tint: "text-shell-amber" },
  { icon: RefreshCw, label: "Income", value: "₱358", tint: "text-shell-green" },
];

const account = [
  { icon: ShoppingBag, title: "My Orders", subtitle: "Earnings & active plans" },
  { icon: Landmark, title: "Bank Account", subtitle: "Bank & passwords" },
  { icon: FileText, title: "Transaction Records", subtitle: "Past withdrawal history" },
  { icon: Building2, title: "About Company", subtitle: "Our story & information" },
];

function ProfilePage() {
  return (
    <PageShell>
      <AppHeader
        eyebrow="Account ID"
        title="821 019 ** 47"
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-shell-yellow px-3 py-1 text-[11px] font-extrabold text-shell-ink">
            <ShieldCheck size={12} /> VIP
          </span>
        }
      />

      <main className="space-y-5 px-4 pt-5">
        {/* Stats strip */}
        <section className="overflow-hidden rounded-2xl border-l-4 border-shell-yellow bg-shell-ink text-white shadow-lg">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="px-3 py-4">
                <s.icon size={16} className={s.tint} strokeWidth={2.4} />
                <div className="mt-2 text-lg font-extrabold tracking-tight">{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 divide-x divide-shell-ink/40">
            <button className="flex items-center justify-center gap-2 bg-shell-yellow py-3.5 text-shell-ink transition active:bg-shell-yellow/90">
              <ArrowDownToLine size={18} strokeWidth={2.4} />
              <span className="text-sm font-extrabold uppercase tracking-wide">Recharge</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-shell-red py-3.5 text-white transition active:bg-shell-red-dark">
              <ArrowUpFromLine size={18} strokeWidth={2.4} />
              <span className="text-sm font-extrabold uppercase tracking-wide">Withdraw</span>
            </button>
          </div>
        </section>

        {/* My Account */}
        <section>
          <SectionTitle>My Account</SectionTitle>
          <div className="overflow-hidden rounded-2xl border border-shell-ink/10 bg-white">
            {account.map((item, i) => (
              <button
                key={item.title}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left transition active:bg-shell-yellow/10 ${
                  i !== account.length - 1 ? "border-b border-shell-ink/5" : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-shell-ink text-shell-yellow">
                  <item.icon size={20} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-extrabold text-shell-ink">{item.title}</div>
                  <div className="text-[13px] text-shell-ink/55">{item.subtitle}</div>
                </div>
                <ChevronRight size={18} className="text-shell-ink/40" />
              </button>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 px-1">
      <span className="h-4 w-1 rounded-full bg-shell-red" />
      <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-shell-ink/70">{children}</h2>
    </div>
  );
}
