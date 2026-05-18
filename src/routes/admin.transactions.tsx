import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/transactions")({
  component: TxnPage,
});

function TxnPage() {
  return (
    <ResourcePage
      title="Transactions"
      subtitle="All wallet movements across the platform"
      endpoint="/api/transactions"
      searchPlaceholder="Search by user, reference…"
      pinnedFilterKey="type"
      pinnedFilterOptions={[
        { value: "", label: "All" },
        { value: "recharge", label: "Recharge" },
        { value: "withdraw", label: "Withdrawal" },
        { value: "income", label: "Daily Income" },
        { value: "bonus", label: "Bonus" },
        { value: "commission", label: "Team" },
      ]}
      filters={[
        { key: "status", label: "Status", options: [
          { value: "success", label: "Success" },
          { value: "pending", label: "Pending" },
          { value: "failed", label: "Failed" },
        ]},
      ]}
      columns={[
        { key: "user_id", label: "User ID" },
        { key: "type", label: "Type" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "note", label: "Note" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "success")} /> },
        { key: "created_at", label: "Date" },
      ]}
      fields={[
        { name: "user_id", label: "User ID", type: "number", required: true, width: "half" },
        { name: "type", label: "Type", type: "select", options: ["recharge", "withdraw", "income", "bonus", "commission", "plan_purchase", "redeem"], required: true, width: "half" },
        { name: "amount", label: "Amount (₱)", type: "number", required: true, width: "half" },
        { name: "status", label: "Status", type: "select", options: ["success", "pending", "processing", "failed"], width: "half" },
        { name: "note", label: "Note", type: "textarea" },
      ]}
    />
  );
}
