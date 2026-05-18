import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";
import { CheckCircle, XCircle } from "lucide-react";
import { apiPost, apiPut } from "@/lib/admin-api";
import { toast } from "sonner";

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
        { key: "user_phone", label: "User" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "gateway", label: "Method" },
        { key: "ref_no", label: "Reference" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "pending")} /> },
        { key: "created_at", label: "Date" },
      ]}
      fields={[
        { name: "user_id", label: "User ID", type: "number", required: true, width: "half" },
        { name: "amount", label: "Amount (₱)", type: "number", required: true, width: "half" },
        { name: "gateway", label: "Method", type: "select", options: ["GCash", "PayMaya", "Bank", "USDT"], width: "half" },
        { name: "ref_no", label: "Reference / TXID", width: "half" },
        { name: "status", label: "Status", type: "select", options: ["pending", "success", "failed"], width: "half" },
        { name: "note", label: "Note", type: "textarea" },
      ]}
      renderRowActions={(row, reload) => row.status === "pending" || row.status === "processing" ? (
        <>
          <button onClick={async () => { await apiPut(`/api/recharges/${row.id}`, { status: "success" }); toast.success("Recharge approved"); reload(); }} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50" title="Approve"><CheckCircle size={14} /></button>
          <button onClick={async () => { await apiPut(`/api/recharges/${row.id}`, { status: "failed" }); toast.success("Recharge rejected"); reload(); }} className="rounded p-1.5 text-rose-600 hover:bg-rose-50" title="Reject"><XCircle size={14} /></button>
        </>
      ) : null}
      bulkActions={[
        { label: "Approve", className: "rounded-md bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white", run: async (ids, reload) => { await apiPost("/api/recharges/bulk/status", { ids, status: "success" }); toast.success("Selected recharges approved"); reload(); } },
        { label: "Reject", className: "rounded-md bg-rose-600 px-2.5 py-1.5 text-[11px] font-bold text-white", run: async (ids, reload) => { await apiPost("/api/recharges/bulk/status", { ids, status: "failed" }); toast.success("Selected recharges rejected"); reload(); } },
      ]}
    />
  );
}
