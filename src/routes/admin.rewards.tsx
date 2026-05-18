import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  return (
    <ResourcePage
      title="Rewards"
      subtitle="Team / VIP bonuses and mission rewards"
      endpoint="/api/rewards"
      searchPlaceholder="Search rewards…"
      columns={[
        { key: "title", label: "Title" },
        { key: "type", label: "Type" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "requirement", label: "Requirement" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "active")} /> },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "type", label: "Type", type: "select", options: ["team", "vip", "mission", "signup"], width: "half" },
        { name: "amount", label: "Reward amount (₱)", type: "number", required: true, width: "half" },
        { name: "requirement", label: "Requirement description" },
        { name: "min_team_invest", label: "Min team invest (₱)", type: "number", width: "half" },
        { name: "status", label: "Status", type: "select", options: ["active", "inactive"], width: "half" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
