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
        { key: "type", label: "Type", render: (r) => (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${r.type === "vip" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
            {r.type || "normal"}
          </span>
        ) },
        { key: "price", label: "Price", render: (r) => `₱${Number(r.price ?? 0).toLocaleString()}` },
        { key: "daily_income", label: "Daily Income", render: (r) => `₱${Number(r.daily_income ?? 0).toLocaleString()}` },
        { key: "total_days", label: "Days" },
        { key: "total_income", label: "Total Return", render: (r) => `₱${Number(r.total_income ?? 0).toLocaleString()}` },
        { key: "active", label: "Status", render: (r) => <StatusBadge status={Number(r.active) === 1 ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "name", label: "Plan name", required: true },
        { name: "type", label: "Type", type: "select", required: true, options: [{ label: "Normal", value: "normal" }, { label: "VIP", value: "vip" }] as any, width: "half" },
        { name: "price", label: "Price (₱)", type: "number", required: true, width: "half" },
        { name: "daily_income", label: "Daily income (₱)", type: "number", required: true, width: "half" },
        { name: "total_days", label: "Duration (days)", type: "number", required: true, width: "half" },
        { name: "total_income", label: "Total return (₱)", type: "number", width: "half" },
        { name: "image_url", label: "Image URL" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "active", label: "Status", type: "select", options: [{ label: "Active", value: 1 }, { label: "Inactive", value: 0 }] as any, width: "half" },
      ]}
    />
  );
}
