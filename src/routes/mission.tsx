import { createFileRoute } from "@tanstack/react-router";
import { Headphones, CheckCircle2, Circle } from "lucide-react";
import { SubPage } from "@/components/SubPage";

const missions = [
  { title: "Daily Sign-in", reward: "₱5", done: true },
  { title: "Invite 1 friend today", reward: "₱50", done: false },
  { title: "Recharge ₱500+", reward: "₱20", done: false },
  { title: "Purchase any plan", reward: "₱100", done: false },
  { title: "Share referral link", reward: "₱10", done: true },
];

export const Route = createFileRoute("/mission")({
  head: () => ({ meta: [{ title: "Missions — Shell Oil" }] }),
  component: () => (
    <SubPage title="Mission" icon={<Headphones size={24} className="text-white" />} subtitle="Complete tasks to earn bonus rewards">
      <section className="space-y-3">
        {missions.map((m) => (
          <div
            key={m.title}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]"
          >
            <span className={m.done ? "text-shell-green" : "text-muted-foreground"}>
              {m.done ? <CheckCircle2 size={26} /> : <Circle size={26} />}
            </span>
            <div className="flex-1">
              <div className="text-base font-extrabold">{m.title}</div>
              <div className="text-sm text-muted-foreground">Reward {m.reward}</div>
            </div>
            <button
              disabled={m.done}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                m.done
                  ? "bg-secondary text-muted-foreground"
                  : "bg-gradient-to-r from-shell-red to-shell-red-dark text-white shadow"
              }`}
            >
              {m.done ? "Claimed" : "Claim"}
            </button>
          </div>
        ))}
      </section>
    </SubPage>
  ),
});
