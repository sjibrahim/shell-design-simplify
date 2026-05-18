import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/withdrawals")({
  component: WithdrawalsPage,
});

function WithdrawalsPage() {
  return (
    <ResourcePage
      title="Withdrawals"
      subtitle="User cash-out requests"
      endpoint="/api/withdrawals"
      searchPlaceholder="Search by user, account…"
      pinnedFilterKey="status"
      pinnedFilterOptions={[
        { value: "", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "paid", label: "Paid" },
        { value: "failed", label: "Rejected" },
      ]}
      columns={[
        { key: "user_email", label: "User" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "fee", label: "Fee", render: (r) => `₱${Number(r.fee ?? 0).toLocaleString()}` },
        { key: "method", label: "Method" },
        { key: "account", label: "Account" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "pending")} /> },
        { key: "created_at", label: "Requested" },
      ]}
      fields={[
        { name: "user_id", label: "User ID", type: "number", required: true, width: "half" },
        { name: "amount", label: "Amount (₱)", type: "number", required: true, width: "half" },
        { name: "fee", label: "Fee (₱)", type: "number", width: "half" },
        { name: "method", label: "Method", type: "select", options: ["GCash", "PayMaya"], width: "half" },
        { name: "account", label: "Account number / name" },
        { name: "status", label: "Status", type: "select", options: ["pending", "processing", "paid", "failed"], width: "half" },
        { name: "note", label: "Admin note", type: "textarea" },
      ]}
    />
  );
}
