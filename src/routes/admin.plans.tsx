import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/plans")({
  component: PlansPage,
});

function PlansPage() {
  return (
    <ResourcePage
      title="Plan Products"
      subtitle="Investment / VIP plans available to members"
      endpoint="/api/plans"
      searchPlaceholder="Search plans…"
      columns={[
        { key: "name", label: "Name" },
        { key: "price", label: "Price", render: (r) => `₱${Number(r.price ?? 0).toLocaleString()}` },
        { key: "daily_income", label: "Daily Income", render: (r) => `₱${Number(r.daily_income ?? 0).toLocaleString()}` },
        { key: "duration_days", label: "Days" },
        { key: "total_return", label: "Total Return", render: (r) => `₱${Number(r.total_return ?? 0).toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "active")} /> },
      ]}
      fields={[
        { name: "name", label: "Plan name", required: true },
        { name: "price", label: "Price (₱)", type: "number", required: true, width: "half" },
        { name: "daily_income", label: "Daily income (₱)", type: "number", required: true, width: "half" },
        { name: "duration_days", label: "Duration (days)", type: "number", required: true, width: "half" },
        { name: "total_return", label: "Total return (₱)", type: "number", width: "half" },
        { name: "image_url", label: "Image URL" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: ["active", "inactive"], width: "half" },
      ]}
    />
  );
}
