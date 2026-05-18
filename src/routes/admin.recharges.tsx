import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/recharges")({
  component: RechargesPage,
});

function RechargesPage() {
  return (
    <ResourcePage
      title="Recharges"
      subtitle="User top-ups awaiting confirmation"
      endpoint="/api/recharges"
      searchPlaceholder="Search by user, reference…"
      pinnedFilterKey="status"
      pinnedFilterOptions={[
        { value: "", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "success", label: "Approved" },
        { value: "failed", label: "Rejected" },
      ]}
      columns={[
        { key: "user_email", label: "User" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "method", label: "Method" },
        { key: "reference", label: "Reference" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "pending")} /> },
        { key: "created_at", label: "Date" },
      ]}
      fields={[
        { name: "user_id", label: "User ID", type: "number", required: true, width: "half" },
        { name: "amount", label: "Amount (₱)", type: "number", required: true, width: "half" },
        { name: "method", label: "Method", type: "select", options: ["GCash", "PayMaya", "Bank", "USDT"], width: "half" },
        { name: "reference", label: "Reference / TXID", width: "half" },
        { name: "status", label: "Status", type: "select", options: ["pending", "success", "failed"], width: "half" },
        { name: "proof_url", label: "Proof image URL" },
        { name: "note", label: "Note", type: "textarea" },
      ]}
    />
  );
}
