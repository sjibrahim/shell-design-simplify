import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/recharge")({
  head: () => ({ meta: [{ title: "Recharge — Shell Oil" }] }),
  component: () => (
    <SubPage title="Recharge" icon={<Wallet size={26} className="text-white" />} subtitle="Top up your Shell Oil balance">
      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="text-[11px] font-bold tracking-wider text-muted-foreground">CURRENT BALANCE</div>
          <div className="mt-1 text-3xl font-extrabold text-foreground">₱2,903.00</div>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="text-[11px] font-bold tracking-wider text-muted-foreground">AMOUNT</div>
          <input
            type="number"
            placeholder="₱ 0.00"
            className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-2xl font-extrabold text-foreground outline-none"
          />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[500, 1000, 2500, 5000].map((v) => (
              <button key={v} className="rounded-xl border border-shell-red/20 bg-shell-yellow/15 py-2 text-sm font-bold text-shell-red">
                ₱{v.toLocaleString()}
              </button>
            ))}
          </div>
          <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md">
            Continue
          </button>
        </div>
      </section>
    </SubPage>
  ),
});
