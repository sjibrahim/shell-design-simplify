import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/payouts")({
  component: PayoutsPage,
});

function PayoutsPage() {
  return (
    <ResourcePage
      title="Payouts"
      subtitle="Daily income credited to active investors"
      endpoint="/api/payouts"
      searchPlaceholder="Search by user, plan…"
      columns={[
        { key: "user_id", label: "User ID" },
        { key: "kind", label: "Kind" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "success")} /> },
        { key: "created_at", label: "Date" },
      ]}
      fields={[
        { name: "user_id", label: "User ID", type: "number", required: true, width: "half" },
        { name: "kind", label: "Kind", type: "select", options: ["blogger", "investor"], width: "half" },
        { name: "amount", label: "Amount (₱)", type: "number", required: true, width: "half" },
        { name: "status", label: "Status", type: "select", options: ["pending", "processing", "success", "failed"], width: "half" },
        { name: "note", label: "Note", type: "textarea" },
      ]}
    />
  );
}
