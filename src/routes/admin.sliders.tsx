import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";

export const Route = createFileRoute("/admin/sliders")({
  component: SlidersPage,
});

function SlidersPage() {
  return (
    <ResourcePage
      title="Home Sliders"
      subtitle="Banners shown on the user home page"
      endpoint="/api/sliders"
      searchPlaceholder="Search sliders…"
      columns={[
        { key: "id", label: "ID" },
        { key: "image_url", label: "Image", render: (r) => r.image_url ? <img src={String(r.image_url)} alt="" className="h-10 w-16 rounded object-cover" /> : "—" },
        { key: "title", label: "Title" },
        { key: "link_url", label: "Link" },
        { key: "sort_order", label: "Order" },
        { key: "active", label: "Status", render: (r) => <StatusBadge status={Number(r.active) === 1 ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "image_url", label: "Image URL", required: true },
        { name: "link_url", label: "Link URL" },
        { name: "sort_order", label: "Sort order", type: "number", width: "half" },
        { name: "active", label: "Status", type: "select", options: [{ label: "Active", value: 1 }, { label: "Inactive", value: 0 }] as any, width: "half" },
      ]}
    />
  );
}
