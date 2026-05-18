import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/gateways")({
  component: GatewaysPage,
});

function GatewaysPage() {
  return (
    <ResourcePage
      title="Payment Gateways"
      subtitle="Recharge / withdrawal channels shown to users"
      endpoint="/api/gateways"
      searchPlaceholder="Search gateways…"
      columns={[
        { key: "name", label: "Name" },
        { key: "title", label: "Title" },
        { key: "type", label: "Type" },
        { key: "min_amount", label: "Min", render: (r) => `₱${Number(r.min_amount ?? 0).toLocaleString()}` },
        { key: "max_amount", label: "Max", render: (r) => `₱${Number(r.max_amount ?? 0).toLocaleString()}` },
        { key: "active", label: "Status", render: (r) => <StatusBadge status={Number(r.active) === 1 ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "name", label: "Gateway key", required: true, width: "half" },
        { name: "title", label: "Display title", required: true, width: "half" },
        { name: "type", label: "Type", type: "select", options: ["recharge", "withdraw"], required: true, width: "half" },
        { name: "min_amount", label: "Min amount (₱)", type: "number", width: "half" },
        { name: "max_amount", label: "Max amount (₱)", type: "number", width: "half" },
        { name: "merchant_id", label: "Merchant / account ID", width: "half" },
        { name: "api_key", label: "API key / instructions" },
        { name: "active", label: "Status", type: "select", options: [{ label: "Active", value: 1 }, { label: "Inactive", value: 0 }], width: "half" },
      ]}
    />
  );
}
