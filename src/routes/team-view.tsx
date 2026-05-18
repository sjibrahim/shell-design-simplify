import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Search, Phone } from "lucide-react";
import { SubPage } from "@/components/SubPage";

export const Route = createFileRoute("/team-view")({
  head: () => ({
    meta: [
      { title: "Team Members — Shell Oil" },
      { name: "description", content: "View all members in your Shell Oil team." },
    ],
  }),
  component: TeamViewPage,
});

type Member = { id: string; phone: string; level: 1 | 2 | 3; recharge: number; joined: string; status: "active" | "new" | "idle" };

const MEMBERS: Member[] = [
  { id: "M101", phone: "+63 917-845-2210", level: 1, recharge: 5000,  joined: "2025-05-12", status: "active" },
  { id: "M102", phone: "+63 949-112-8876", level: 1, recharge: 1000,  joined: "2025-05-10", status: "active" },
  { id: "M103", phone: "+63 917-664-3392", level: 1, recharge: 250,   joined: "2025-05-09", status: "new" },
  { id: "M104", phone: "+63 949-723-4421", level: 1, recharge: 10000, joined: "2025-04-30", status: "active" },
  { id: "M201", phone: "+63 917-228-9911", level: 2, recharge: 500,   joined: "2025-05-08", status: "active" },
  { id: "M202", phone: "+63 949-456-1122", level: 2, recharge: 0,     joined: "2025-05-06", status: "idle" },
  { id: "M203", phone: "+63 917-771-3344", level: 2, recharge: 1000,  joined: "2025-05-04", status: "active" },
  { id: "M301", phone: "+63 949-993-7766", level: 3, recharge: 250,   joined: "2025-05-02", status: "new" },
  { id: "M302", phone: "+63 917-554-8821", level: 3, recharge: 500,   joined: "2025-04-28", status: "active" },
  { id: "M303", phone: "+63 949-118-3322", level: 3, recharge: 0,     joined: "2025-04-25", status: "idle" },
];

const statusStyle = {
  active: "bg-shell-green/15 text-shell-green",
  new:    "bg-shell-yellow/30 text-[#8a6500]",
  idle:   "bg-muted text-muted-foreground",
};

function TeamViewPage() {
  const [tab, setTab] = useState<"all" | 1 | 2 | 3>("all");
  const [q, setQ] = useState("");
  const filtered = MEMBERS.filter((m) =>
    (tab === "all" || m.level === tab) && (q === "" || m.phone.includes(q) || m.id.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <SubPage title="Team Members" icon={<Users size={26} className="text-white" />} subtitle={`${MEMBERS.length} total · 3 levels`}>
      <section className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-black/5 shadow-sm">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by phone or ID"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-white p-1.5 ring-1 ring-black/5 shadow-sm">
          {([
            { key: "all" as const, label: "All" },
            { key: 1 as const, label: "Lv1" },
            { key: 2 as const, label: "Lv2" },
            { key: 3 as const, label: "Lv3" },
          ]).map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.label}
                onClick={() => setTab(t.key)}
                className={`rounded-xl py-2 text-xs font-bold transition ${active ? "bg-shell-red text-white shadow" : "text-muted-foreground"}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">No members found.</div>
          )}
          {filtered.map((m, i) => (
            <div
              key={m.id}
              className={`flex items-center gap-3 px-4 py-3 ${i !== filtered.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-shell-red/10 text-shell-red font-extrabold">
                L{m.level}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
                  <Phone size={12} className="text-muted-foreground" />
                  <span className="truncate">{m.phone}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  ID {m.id} · joined {m.joined}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-shell-red">₱{m.recharge.toLocaleString()}</div>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusStyle[m.status]}`}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
