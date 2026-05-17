import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  FileText,
  ArrowDownToLine,
  Ticket,
  Download,
  ChevronRight,
  LogOut,
  Wallet,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import shellLogo from "@/assets/shell-logo.png";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Shell Oil" },
      { name: "description", content: "Your Shell Oil account, balance, and records." },
    ],
  }),
  component: ProfilePage,
});

const menu = [
  { icon: Building2, label: "About Company", to: "/" },
  { icon: FileText, label: "Income Record", to: "/income-details" },
  { icon: ArrowDownToLine, label: "Withdraw Record", to: "/withdraw" },
  { icon: Ticket, label: "Redeem Code", to: "/" },
  { icon: Download, label: "App Download", to: "/" },
] as const;

function ProfilePage() {
  return (
    <div className="min-h-screen bg-shell-red">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-gradient-to-b from-shell-red via-[#F2454A] to-[#FFE9EA] pb-28 shadow-xl">
        {/* Header */}
        <header className="relative px-5 pt-6 pb-4 text-center">
          <h1 className="text-2xl font-extrabold text-white">Profile</h1>
          <Link
            to="/recharge"
            aria-label="Recharge"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/10 text-white backdrop-blur transition active:scale-95"
          >
            <Wallet size={20} />
          </Link>
        </header>

        {/* Avatar + ID */}
        <section className="flex flex-col items-center px-5 pb-5 text-white">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-lg ring-4 ring-white/40">
            <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={96} height={96} />
          </div>
          <div className="mt-3 text-2xl font-extrabold tracking-wide">9999988888</div>
        </section>

        <main className="space-y-4 px-4">
          {/* Balance card */}
          <section className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
            <div>
              <div className="text-sm font-semibold text-muted-foreground">Account Balance</div>
              <div className="mt-1 text-3xl font-extrabold text-foreground">₱2,903.00</div>
            </div>
            <Link
              to="/recharge"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-shell-red to-shell-red-dark px-5 py-3 text-sm font-bold text-white shadow-md transition active:scale-95"
            >
              Recharge <Wallet size={16} />
            </Link>
          </section>

          {/* Stat row */}
          <section className="grid grid-cols-3 divide-x divide-white/25 rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-center text-white shadow-md">
            <Stat label="Recharge" value="₱9,500" />
            <Stat label="Withdraw" value="₱5,200" />
            <Stat label="Welfare" value="₱358" />
          </section>

          {/* Menu */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
            {menu.map((m, i) => (
              <Link
                key={m.label}
                to={m.to}
                className={`flex items-center gap-3 px-4 py-4 transition active:bg-shell-yellow/10 ${
                  i !== menu.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-shell-red/10 text-shell-red">
                  <m.icon size={18} strokeWidth={2.2} />
                </div>
                <span className="flex-1 text-base font-bold text-foreground">{m.label}</span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
            ))}
          </section>

          {/* Exit */}
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-shell-red/15 py-4 text-base font-bold text-shell-red transition active:scale-[0.99]">
            <LogOut size={18} />
            Exit App
          </button>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2">
      <div className="text-lg font-extrabold">{value}</div>
      <div className="mt-0.5 text-sm text-white/90">{label}</div>
    </div>
  );
}
