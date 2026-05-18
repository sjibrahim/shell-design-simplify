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
        { key: "user_email", label: "User" },
        { key: "plan_name", label: "Plan" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "payout_date", label: "Date" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "paid")} /> },
      ]}
      fields={[
        { name: "user_id", label: "User ID", type: "number", required: true, width: "half" },
        { name: "plan_id", label: "Plan ID", type: "number", width: "half" },
        { name: "amount", label: "Amount (₱)", type: "number", required: true, width: "half" },
        { name: "payout_date", label: "Payout date", width: "half" },
        { name: "status", label: "Status", type: "select", options: ["paid", "pending", "failed"], width: "half" },
      ]}
    />
  );
}
