import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/redeem-codes")({
  component: RedeemCodesPage,
});

function RedeemCodesPage() {
  return (
    <ResourcePage
      title="Redeem Codes"
      subtitle="Promo / gift codes that users can claim"
      endpoint="/api/redeem-codes"
      searchPlaceholder="Search codes…"
      pinnedFilterKey="status"
      pinnedFilterOptions={[
        { value: "", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      columns={[
        { key: "code", label: "Code" },
        { key: "amount", label: "Reward", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "max_uses", label: "Max uses" },
        { key: "used_count", label: "Used" },
        { key: "expires_at", label: "Expires" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "active")} /> },
      ]}
      fields={[
        { name: "code", label: "Code", required: true, width: "half" },
        { name: "amount", label: "Reward (₱)", type: "number", required: true, width: "half" },
        { name: "max_uses", label: "Max uses", type: "number", width: "half" },
        { name: "expires_at", label: "Expires at (YYYY-MM-DD)", width: "half" },
        { name: "status", label: "Status", type: "select", options: ["active", "inactive"], width: "half" },
        { name: "note", label: "Note", type: "textarea" },
      ]}
    />
  );
}
