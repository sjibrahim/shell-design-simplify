import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  ArrowDownToLine,
  Wallet,
  Coins,
  Gift,
  Trophy,
  Ticket,
  CreditCard,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const NAV: { label: string; to: string; icon: typeof Users }[] = [
  { label: "Dashboard",       to: "/admin",              icon: LayoutDashboard },
  { label: "Members",         to: "/admin/members",      icon: Users },
  { label: "Plan Products",   to: "/admin/plans",        icon: Package },
  { label: "Transactions",    to: "/admin/transactions", icon: Receipt },
  { label: "Withdrawals",     to: "/admin/withdrawals",  icon: ArrowDownToLine },
  { label: "Recharges",       to: "/admin/recharges",    icon: Wallet },
  { label: "Investor Payout", to: "/admin/payouts",      icon: Coins },
  { label: "Agent Rewards",   to: "/admin/rewards",      icon: Gift },
  { label: "Rewards List",    to: "/admin/rewards-list", icon: Trophy },
  { label: "Redeem Codes",    to: "/admin/redeem-codes", icon: Ticket },
  { label: "Gateways",        to: "/admin/gateways",     icon: CreditCard },
  { label: "Settings",        to: "/admin/settings",     icon: Settings },
];

export function AdminShell({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("admin_auth") !== "1") {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  useEffect(() => setOpen(false), [pathname]);

  const logout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-100 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-shell-red to-shell-red-dark text-white shadow">
              <ShieldCheck size={18} strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wide">Shell Admin</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Control Panel</div>
            </div>
          </Link>
          <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Main</div>
          {NAV.map((item) => {
            const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-gradient-to-r from-shell-red to-shell-red-dark text-white shadow" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={16} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-8">
          <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 max-w-md">
            <Search size={16} className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search users, transactions, plans…" />
          </div>
          <button className="relative rounded-xl bg-slate-100 p-2.5 text-slate-700 hover:bg-slate-200">
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-shell-red ring-2 ring-white" />
          </button>
          <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-2 py-1.5 md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-shell-red text-xs font-bold text-white">A</div>
            <div className="pr-2">
              <div className="text-xs font-bold leading-tight">Admin</div>
              <div className="text-[10px] text-slate-500">Super User</div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "success" | "pending" | "process" | "failed" | "active" | "inactive" }) {
  const map = {
    success:  "bg-emerald-100 text-emerald-700 ring-emerald-200",
    active:   "bg-emerald-100 text-emerald-700 ring-emerald-200",
    pending:  "bg-amber-100 text-amber-700 ring-amber-200",
    process:  "bg-blue-100 text-blue-700 ring-blue-200",
    failed:   "bg-rose-100 text-rose-700 ring-rose-200",
    inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${map[status]}`}>
      {status}
    </span>
  );
}

export function DataTable<T>({ columns, rows, empty = "No data" }: {
  columns: { key: keyof T | string; label: string; render?: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  empty?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 ${c.className ?? ""}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-400">{empty}</td></tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                {columns.map((c) => (
                  <td key={String(c.key)} className={`px-4 py-3 ${c.className ?? ""}`}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Tabs({ value, onChange, items }: { value: string; onChange: (v: string) => void; items: { value: string; label: string; count?: number }[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5">
      {items.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? "bg-shell-red text-white" : "bg-slate-200 text-slate-700"}`}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
