import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Receipt, ArrowDownLeft, ArrowUpRight, Gift, Wallet } from "lucide-react";
import { SubPage } from "@/components/SubPage";
import { uGet, fmtPeso } from "@/lib/user-api";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Shell Oil" },
      { name: "description", content: "View your Shell Oil transaction history." },
    ],
  }),
  component: TransactionsPage,
});

type Tx = { id: number | string; type: "recharge" | "withdraw" | "income" | "bonus"; amount: number | string; created_at: string; status: "success" | "pending" | "failed"; note?: string };


const meta = {
  recharge: { label: "Recharge",  icon: Wallet,         tint: "bg-shell-yellow/30 text-[#8a6500]", sign: "+" },
  withdraw: { label: "Withdraw",  icon: ArrowUpRight,   tint: "bg-shell-red/10 text-shell-red",     sign: "-" },
  income:   { label: "Daily Income", icon: ArrowDownLeft, tint: "bg-shell-green/15 text-shell-green", sign: "+" },
  bonus:    { label: "Team Bonus", icon: Gift,          tint: "bg-shell-amber/15 text-shell-amber", sign: "+" },
} as const;

const statusStyle = {
  success: "bg-shell-green/15 text-shell-green",
  pending: "bg-shell-yellow/30 text-[#8a6500]",
  failed:  "bg-shell-red/10 text-shell-red",
};

function TransactionsPage() {
  const [tab, setTab] = useState<"all" | Tx["type"]>("all");
  const list = TXS.filter((t) => tab === "all" || t.type === tab);

  return (
    <SubPage title="Transactions" icon={<Receipt size={26} className="text-white" />} subtitle="All activity across your account">
      <section className="space-y-4">
        <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-white p-1.5 ring-1 ring-black/5 shadow-sm">
          {([
            { k: "all" as const, label: "All" },
            { k: "recharge" as const, label: "In" },
            { k: "withdraw" as const, label: "Out" },
            { k: "income" as const, label: "Income" },
            { k: "bonus" as const, label: "Bonus" },
          ]).map((t) => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`rounded-xl py-2 text-[11px] font-bold transition ${active ? "bg-shell-red text-white shadow" : "text-muted-foreground"}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
          {list.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">No transactions yet.</div>
          )}
          {list.map((t, i) => {
            const m = meta[t.type];
            const Icon = m.icon;
            return (
              <div
                key={t.id}
                className={`flex items-center gap-3 px-4 py-3 ${i !== list.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${m.tint}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-foreground">{m.label}</div>
                  <div className="text-[11px] text-muted-foreground">{t.date} · {t.id}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-extrabold ${m.sign === "+" ? "text-shell-green" : "text-shell-red"}`}>
                    {m.sign}₱{t.amount.toLocaleString()}
                  </div>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusStyle[t.status]}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SubPage>
  );
}
