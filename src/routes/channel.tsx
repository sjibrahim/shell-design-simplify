import { createFileRoute } from "@tanstack/react-router";
import { Send, ChevronRight } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/channel")({
  head: () => ({ meta: [{ title: "Channels — Shell Oil" }] }),
  component: () => (
    <SubPage title="Channel" icon={<Send size={24} className="text-white" />} subtitle="Join our official communities">
      <section className="space-y-3">
        {[
          { name: "Telegram Official", desc: "Daily codes & announcements", color: "bg-sky-500" },
          { name: "Telegram VIP", desc: "Bonus drops & insider news", color: "bg-shell-red" },
          { name: "WhatsApp Support", desc: "24/7 customer service", color: "bg-shell-green" },
          { name: "Facebook Group", desc: "Community discussions", color: "bg-indigo-500" },
        ].map((c) => (
          <button
            key={c.name}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${c.color}`}>
              <Send size={20} />
            </span>
            <span className="flex-1">
              <span className="block text-base font-extrabold">{c.name}</span>
              <span className="block text-sm text-muted-foreground">{c.desc}</span>
            </span>
            <ChevronRight size={18} className="text-shell-red" />
          </button>
        ))}
      </section>
    </SubPage>
  ),
});
