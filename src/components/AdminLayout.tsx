import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  ArrowDownToLine,
  Wallet,
  Banknote,
  Gift,
  Ticket,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { getStoredAdmin, setStoredAdmin, setToken, type AdminUser } from "@/lib/admin-api";
import { useNavigate } from "@tanstack/react-router";

const NAV = [
  { to: "/admin",               label: "Dashboard",      icon: LayoutDashboard },
  { to: "/admin/members",       label: "Members",        icon: Users },
  { to: "/admin/plans",         label: "Plan Products",  icon: Package },
  { to: "/admin/transactions",  label: "Transactions",   icon: Receipt },
  { to: "/admin/withdrawals",   label: "Withdrawals",    icon: ArrowDownToLine },
  { to: "/admin/recharges",     label: "Recharges",      icon: Wallet },
  { to: "/admin/payouts",       label: "Payouts",        icon: Banknote },
  { to: "/admin/rewards",       label: "Rewards",        icon: Gift },
  { to: "/admin/redeem-codes",  label: "Redeem Codes",   icon: Ticket },
  { to: "/admin/gateways",      label: "Gateways",       icon: CreditCard },
  { to: "/admin/settings",      label: "Settings",       icon: SettingsIcon },
] as const;

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { setAdmin(getStoredAdmin()); }, []);

  const logout = () => {
    setToken(null);
    setStoredAdmin(null);
    navigate({ to: "/admin/login" });
  };

  const isActive = (to: string) =>
    to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white shadow">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-sm font-extrabold leading-tight">Shell Admin</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Control Panel</div>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive(n.to)
                  ? "bg-shell-red/10 text-shell-red"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <n.icon size={16} strokeWidth={2.2} />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200 p-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs font-bold">{admin?.name || "Admin"}</div>
            <div className="truncate text-[10.5px] text-slate-500">{admin?.email}</div>
            <button
              onClick={logout}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-white py-1.5 text-xs font-bold text-shell-red ring-1 ring-shell-red/20 hover:bg-shell-red/5"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="text-base font-extrabold">Shell Oil Admin</div>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:block">Signed in as</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 font-bold text-slate-700">{admin?.email}</span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    success:    "bg-emerald-100 text-emerald-700",
    paid:       "bg-emerald-100 text-emerald-700",
    active:     "bg-emerald-100 text-emerald-700",
    pending:    "bg-amber-100 text-amber-700",
    processing: "bg-sky-100 text-sky-700",
    failed:     "bg-rose-100 text-rose-700",
    inactive:   "bg-slate-200 text-slate-600",
    blocked:    "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}
