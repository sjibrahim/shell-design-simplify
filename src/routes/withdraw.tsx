import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/withdraw")({
  head: () => ({ meta: [{ title: "Withdraw — Shell Oil" }] }),
  component: () => (
    <SubPage title="Withdraw" icon={<CreditCard size={26} className="text-white" />} subtitle="Cash out your earnings">
      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="text-[11px] font-bold tracking-wider text-muted-foreground">AVAILABLE TO WITHDRAW</div>
          <div className="mt-1 text-3xl font-extrabold text-shell-green">₱358.00</div>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="text-[11px] font-bold tracking-wider text-muted-foreground">AMOUNT</div>
          <input
            type="number"
            placeholder="₱ 0.00"
            className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-2xl font-extrabold text-foreground outline-none"
          />
          <div className="mt-4 text-[11px] font-bold tracking-wider text-muted-foreground">WITHDRAWAL PASSWORD</div>
          <input
            type="password"
            placeholder="Enter withdrawal password"
            className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-base text-foreground outline-none"
          />
          <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-shell-red to-shell-red-dark py-4 text-base font-bold text-white shadow-md">
            Request Withdrawal
          </button>
        </div>
      </section>
    </SubPage>
  ),
});
