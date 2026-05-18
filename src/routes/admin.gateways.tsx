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
        { key: "type", label: "Type" },
        { key: "account", label: "Account" },
        { key: "min_amount", label: "Min", render: (r) => `₱${Number(r.min_amount ?? 0).toLocaleString()}` },
        { key: "max_amount", label: "Max", render: (r) => `₱${Number(r.max_amount ?? 0).toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "active")} /> },
      ]}
      fields={[
        { name: "name", label: "Display name", required: true, width: "half" },
        { name: "type", label: "Type", type: "select", options: ["GCash", "PayMaya", "Bank", "USDT"], required: true, width: "half" },
        { name: "account", label: "Account number / wallet" },
        { name: "account_name", label: "Account holder name" },
        { name: "min_amount", label: "Min amount (₱)", type: "number", width: "half" },
        { name: "max_amount", label: "Max amount (₱)", type: "number", width: "half" },
        { name: "qr_url", label: "QR code URL" },
        { name: "status", label: "Status", type: "select", options: ["active", "inactive"], width: "half" },
        { name: "instructions", label: "Instructions", type: "textarea" },
      ]}
    />
  );
}
