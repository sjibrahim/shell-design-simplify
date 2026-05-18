import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Search, Phone } from "lucide-react";
import { SubPage } from "@/components/SubPage";
import { uGet, fmtPeso } from "@/lib/user-api";

export const Route = createFileRoute("/team-view")({
  validateSearch: (s: Record<string, unknown>) => ({
    level: s.level === 1 || s.level === 2 || s.level === 3 || s.level === "1" || s.level === "2" || s.level === "3"
      ? (Number(s.level) as 1 | 2 | 3)
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Team Members — Shell Oil" },
      { name: "description", content: "View all members in your Shell Oil team." },
    ],
  }),
  component: TeamViewPage,
});

type Member = { id: number | string; phone: string; name?: string | null; level: 1 | 2 | 3; total_recharge: number | string; created_at: string; status: "active" | "inactive" | "blocked" };

const statusStyle = {
  active: "bg-shell-green/15 text-shell-green",
  inactive: "bg-muted text-muted-foreground",
  blocked: "bg-shell-red/10 text-shell-red",
};

function TeamViewPage() {
  const { level } = Route.useSearch();
  const [tab, setTab] = useState<"all" | 1 | 2 | 3>(level ?? "all");
  const [q, setQ] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    uGet<{ ok: true; members: Member[] }>("/api/u/team")
      .then((r) => setMembers(r.members || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) =>
    (tab === "all" || m.level === tab) && (q === "" || m.phone.includes(q) || String(m.id).toLowerCase().includes(q.toLowerCase()) || (m.name || "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <SubPage title="Team Members" icon={<Users size={26} className="text-white" />} subtitle={`${members.length} total · 3 levels`}>
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
          {loading && <div className="px-4 py-10 text-center text-sm text-muted-foreground">Loading…</div>}
          {!loading && filtered.length === 0 && (
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
                  ID {m.id} · joined {new Date(m.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-shell-red">{fmtPeso(m.total_recharge)}</div>
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
