import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/members")({
  component: MembersPage,
});

function MembersPage() {
  return (
    <ResourcePage
      title="Members"
      subtitle="All registered users of Shell Oil"
      endpoint="/api/users"
      searchPlaceholder="Search by name, email, phone…"
      pinnedFilterKey="status"
      pinnedFilterOptions={[
        { value: "", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "balance", label: "Balance", render: (r) => `₱${Number(r.balance ?? 0).toLocaleString()}` },
        { key: "vip_level", label: "VIP" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "active")} /> },
        { key: "created_at", label: "Joined" },
      ]}
      fields={[
        { name: "name", label: "Full name", required: true, width: "half" },
        { name: "email", label: "Email", required: true, width: "half" },
        { name: "phone", label: "Phone", width: "half" },
        { name: "password", label: "Password (leave blank to keep)", width: "half" },
        { name: "balance", label: "Balance", type: "number", width: "half" },
        { name: "vip_level", label: "VIP level", type: "number", width: "half" },
        { name: "status", label: "Status", type: "select", options: ["active", "inactive", "blocked"], width: "half" },
        { name: "referral_code", label: "Referral code", width: "half" },
      ]}
    />
  );
}
