import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";
import { useState } from "react";
import { Eye, Network, X } from "lucide-react";
import { apiGet } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/members")({
  component: MembersPage,
});

function MembersPage() {
  const [detail, setDetail] = useState<any | null>(null);
  const [team, setTeam] = useState<any | null>(null);
  const openProfile = async (id: number) => setDetail(await apiGet(`/api/users/${id}/profile`));
  const openTeam = async (id: number) => setTeam(await apiGet(`/api/users/${id}/team`));

  return (
    <>
      <ResourcePage
        title="Members"
        subtitle="All registered users of Shell Oil"
        endpoint="/api/users"
        searchPlaceholder="Search by name or phone…"
        pinnedFilterKey="status"
        pinnedFilterOptions={[
          { value: "", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "blocked", label: "Blocked" },
        ]}
        columns={[
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "balance", label: "Balance", render: (r) => `₱${Number(r.balance ?? 0).toLocaleString()}` },
          { key: "total_recharge", label: "Recharge", render: (r) => `₱${Number(r.total_recharge ?? 0).toLocaleString()}` },
          { key: "vip_level", label: "VIP" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "active")} /> },
          { key: "created_at", label: "Joined" },
        ]}
        fields={[
          { name: "name", label: "Full name", width: "half" },
          { name: "phone", label: "Phone", required: true, width: "half" },
          { name: "password", label: "Password (leave blank to keep)", width: "half" },
          { name: "balance", label: "Balance", type: "number", width: "half" },
          { name: "vip_level", label: "VIP level", type: "number", width: "half" },
          { name: "status", label: "Status", type: "select", options: ["active", "inactive", "blocked"], width: "half" },
          { name: "referral_code", label: "Referral code", width: "half" },
          { name: "withdraw_channel", label: "Withdraw channel", width: "half" },
          { name: "withdraw_account_no", label: "Withdraw account", width: "half" },
          { name: "withdraw_account_name", label: "Account name", width: "half" },
        ]}
        renderRowActions={(row) => (
          <>
            <button onClick={() => void openProfile(row.id as number)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-shell-red" title="View profile"><Eye size={14} /></button>
            <button onClick={() => void openTeam(row.id as number)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-shell-red" title="View team"><Network size={14} /></button>
          </>
        )}
      />
      {detail && <Modal title={`User #${detail.user.id} profile`} onClose={() => setDetail(null)}><ProfileDetail data={detail} /></Modal>}
      {team && <Modal title="Team members" onClose={() => setTeam(null)}><TeamDetail data={team} /></Modal>}
    </>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}><div className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}><div className="mb-3 flex items-center justify-between"><h2 className="font-extrabold">{title}</h2><button onClick={onClose}><X size={18} /></button></div>{children}</div></div>;
}

function ProfileDetail({ data }: { data: any }) {
  const u = data.user;
  return <div className="space-y-4 text-sm"><div className="grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-4"><b>{u.phone}</b><span>Balance ₱{Number(u.balance).toLocaleString()}</span><span>VIP {u.vip_level}</span><StatusBadge status={u.status} /></div><List title="Plans" items={data.plans} /><List title="Recharges" items={data.recharges} /><List title="Withdrawals" items={data.withdrawals} /><List title="Transactions" items={data.transactions} /></div>;
}

function TeamDetail({ data }: { data: any }) { return <List title={`${data.members?.length || 0} team members`} items={data.members || []} />; }

function List({ title, items }: { title: string; items: any[] }) {
  return <div><h3 className="mb-2 text-xs font-extrabold uppercase text-slate-500">{title}</h3><div className="overflow-auto rounded-lg border border-slate-200"><table className="w-full text-xs"><tbody>{items.length === 0 ? <tr><td className="p-3 text-slate-400">No records</td></tr> : items.map((it) => <tr key={`${title}-${it.id}`} className="border-b border-slate-100"><td className="p-2 font-mono">#{it.id}</td><td className="p-2">{it.name || it.plan_name || it.phone || it.type || it.gateway || it.channel}</td><td className="p-2">{it.amount || it.total_recharge || it.price ? `₱${Number(it.amount || it.total_recharge || it.price).toLocaleString()}` : ""}</td><td className="p-2">{it.status ? <StatusBadge status={it.status} /> : ""}</td><td className="p-2 text-slate-500">{it.created_at ? new Date(it.created_at).toLocaleString() : ""}</td></tr>)}</tbody></table></div></div>;
}
