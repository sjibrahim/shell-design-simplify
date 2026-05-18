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
  Bell,
  Shield,
  BadgeCheck,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
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
  { icon: Building2, label: "About Company", desc: "Shell Pilipinas overview", to: "/" },
  { icon: FileText, label: "Income Record", desc: "Daily earnings history", to: "/income-details" },
  { icon: ArrowDownToLine, label: "Withdraw Record", desc: "Bank transfer history", to: "/withdraw" },
  { icon: Ticket, label: "Redeem Code", desc: "Use a promo code", to: "/" },
  { icon: Download, label: "App Download", desc: "Get the latest version", to: "/" },
] as const;

function ProfilePage() {
  const [show, setShow] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-background pb-28">
        {/* Curved red header */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-56 rounded-b-[40px] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_60%,#7a0f12_100%)]" />
          <span className="pointer-events-none absolute -right-12 top-2 h-44 w-44 rounded-full bg-shell-yellow/20 blur-2xl" />
          <span className="pointer-events-none absolute left-4 top-24 h-24 w-24 rounded-full bg-white/10 blur-xl" />

          <header className="relative flex items-center justify-between px-5 pt-6">
            <div className="text-white">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-shell-yellow">My Account</div>
              <div className="text-lg font-extrabold">Profile</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur active:scale-95"
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-shell-yellow ring-2 ring-shell-red-dark" />
              </button>
              <Link
                to="/recharge"
                aria-label="Recharge"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur active:scale-95"
              >
                <Wallet size={18} />
              </Link>
            </div>
          </header>

          {/* User identity row */}
          <section className="relative mx-5 mt-5 flex items-center gap-4 text-white">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-lg ring-4 ring-white/30">
                <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={80} height={80} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-shell-yellow text-shell-red-dark ring-2 ring-shell-red-dark">
                <BadgeCheck size={16} strokeWidth={2.6} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold">Juan D.</span>
                <span className="rounded-full bg-shell-yellow px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-shell-red-dark">VIP 3</span>
              </div>
              <div className="text-xs text-white/80">ID · 9999988888</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-white/90">
                <Shield size={11} /> KYC Verified
              </div>
            </div>
          </section>

          {/* Wallet card — overlapping curve */}
          <section className="relative mx-4 mt-6">
            <div className="overflow-hidden rounded-3xl bg-white p-5 shadow-[0_18px_40px_-18px_rgba(221,29,33,0.45)] ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Account Balance</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-foreground">{show ? "₱2,903.00" : "₱••••••"}</span>
                    <button onClick={() => setShow((s) => !s)} aria-label="Toggle balance" className="text-muted-foreground">
                      {show ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
                <Link
                  to="/recharge"
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-shell-red to-shell-red-dark px-4 py-2.5 text-sm font-bold text-white shadow-md active:scale-95"
                >
                  <Plus size={16} /> Top Up
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-2xl bg-muted/50 py-3 text-center">
                <Stat label="Recharge" value="₱9,500" />
                <Stat label="Withdraw" value="₱5,200" />
                <Stat label="Welfare" value="₱358" />
              </div>
            </div>
          </section>
        </div>

        <main className="space-y-4 px-4 pt-5">
          {/* Quick links */}
          <section className="grid grid-cols-3 gap-2.5">
            <QuickLink to="/recharge" icon={Wallet} label="Recharge" tint="bg-shell-red/10 text-shell-red" />
            <QuickLink to="/withdraw" icon={ArrowDownToLine} label="Withdraw" tint="bg-shell-yellow/30 text-[#8a6500]" />
            <QuickLink to="/income-details" icon={FileText} label="Records" tint="bg-shell-green/15 text-shell-green" />
          </section>

          {/* Menu */}
          <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
            {menu.map((m, i) => (
              <Link
                key={m.label}
                to={m.to}
                className={`flex items-center gap-3 px-4 py-3.5 transition active:bg-shell-yellow/10 ${
                  i !== menu.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-shell-red/10 text-shell-red">
                  <m.icon size={18} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground">{m.label}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{m.desc}</div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
            ))}
          </section>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 rounded-2xl bg-shell-yellow-soft py-2.5 text-[11px] font-bold text-[#8a6500]">
            <Shield size={13} /> Secured by Shell Pilipinas · 256-bit SSL
          </div>

          {/* Exit */}
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-bold text-shell-red ring-1 ring-shell-red/20 active:scale-[0.99]">
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
      <div className="text-base font-extrabold text-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label, tint }: { to: string; icon: typeof Wallet; label: string; tint: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 ring-1 ring-black/5 shadow-sm active:scale-[0.97]"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
        <Icon size={18} />
      </span>
      <span className="text-[11px] font-bold text-foreground">{label}</span>
      <ArrowUpRight size={12} className="text-muted-foreground" />
    </Link>
  );
}
