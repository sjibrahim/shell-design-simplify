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
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GradientHeader } from "@/components/GradientHeader";
import shellLogo from "@/assets/shell-logo.png";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const stats = [
  { icon: CreditCard, label: "BALANCE", value: "₱2,903", tint: "bg-shell-red/10 text-shell-red" },
  { icon: Wallet, label: "RECHARGED", value: "₱9,500", tint: "bg-shell-amber/15 text-shell-amber" },
  { icon: RefreshCw, label: "TOTAL INCOME", value: "₱358", tint: "bg-shell-green/15 text-shell-green" },
];

const account = [
  { icon: ShoppingBag, title: "My Orders", subtitle: "Earnings & active plans", tint: "bg-shell-green/15 text-shell-green" },
  { icon: Landmark, title: "Bank Account", subtitle: "Bank & passwords", tint: "bg-shell-amber/15 text-shell-amber" },
  { icon: FileText, title: "Transaction Records", subtitle: "Past withdrawal history", tint: "bg-shell-red/10 text-shell-red" },
  { icon: Building2, title: "About Company", subtitle: "Our story & information", tint: "bg-shell-yellow/40 text-shell-red" },
];

function ProfilePage() {
  return (
    <PageShell>
      <GradientHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
            <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={80} height={80} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">ID : 821019**47</h1>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-shell-yellow" />
              VIP Member
            </span>
          </div>
        </div>
      </GradientHeader>

      <main className="relative z-10 -mt-12 space-y-5 px-4">
        {/* Stats card */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_-10px_rgba(221,29,33,0.18)]">
          <div className="grid grid-cols-3 divide-x divide-border px-2 py-5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center px-1 text-center">
                <div className={`mb-2 flex h-11 w-11 items-center justify-center rounded-2xl ${s.tint}`}>
                  <s.icon size={20} strokeWidth={2.2} />
                </div>
                <div className="text-lg font-extrabold text-foreground">{s.value}</div>
                <div className="mt-1 text-[10px] font-bold tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
            <button className="flex items-center justify-center gap-2 py-4 text-shell-red transition active:bg-shell-red/5">
              <ArrowDownToLine size={18} />
              <span className="text-base font-bold">Recharge</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-4 text-shell-green transition active:bg-shell-green/5">
              <ArrowUpFromLine size={18} />
              <span className="text-base font-bold">Withdraw</span>
            </button>
          </div>
        </section>

        {/* My Account */}
        <section>
          <div className="mb-3 flex items-center gap-2 px-1">
            <span className="h-5 w-1 rounded-full bg-shell-red" />
            <h2 className="text-lg font-extrabold text-foreground">My Account</h2>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]">
            {account.map((item, i) => (
              <button
                key={item.title}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left transition active:bg-shell-yellow/10 ${
                  i !== account.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.tint}`}>
                  <item.icon size={22} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <div className="text-base font-extrabold text-foreground">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-shell-red/20 text-shell-red">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
