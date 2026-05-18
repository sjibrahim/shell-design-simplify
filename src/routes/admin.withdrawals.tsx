import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage, StatusBadge } from "@/components/ResourcePage";
import { CheckCircle, XCircle } from "lucide-react";
import { apiPost, apiPut } from "@/lib/admin-api";
import { toast } from "sonner";

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
        { value: "success", label: "Paid" },
        { value: "failed", label: "Rejected" },
      ]}
      columns={[
        { key: "user_phone", label: "User" },
        { key: "amount", label: "Amount", render: (r) => `₱${Number(r.amount ?? 0).toLocaleString()}` },
        { key: "fee", label: "Fee", render: (r) => `₱${Number(r.fee ?? 0).toLocaleString()}` },
        { key: "channel", label: "Method" },
        { key: "account", label: "Account" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "pending")} /> },
        { key: "created_at", label: "Requested" },
      ]}
      fields={[
        { name: "user_id", label: "User ID", type: "number", required: true, width: "half" },
        { name: "amount", label: "Amount (₱)", type: "number", required: true, width: "half" },
        { name: "channel", label: "Method", type: "select", options: ["GCash", "PayMaya"], width: "half" },
        { name: "account_no", label: "Account number", width: "half" },
        { name: "account_name", label: "Account name", width: "half" },
        { name: "status", label: "Status", type: "select", options: ["pending", "processing", "success", "failed"], width: "half" },
        { name: "ref_no", label: "Reference / TXID", width: "half" },
        { name: "note", label: "Admin note", type: "textarea" },
      ]}
      renderRowActions={(row, reload) => row.status === "pending" || row.status === "processing" ? (
        <>
          <button onClick={async () => { await apiPut(`/api/withdrawals/${row.id}`, { status: "success" }); toast.success("Withdrawal approved"); reload(); }} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50" title="Approve"><CheckCircle size={14} /></button>
          <button onClick={async () => { await apiPut(`/api/withdrawals/${row.id}`, { status: "failed" }); toast.success("Withdrawal failed and refunded"); reload(); }} className="rounded p-1.5 text-rose-600 hover:bg-rose-50" title="Fail & refund"><XCircle size={14} /></button>
        </>
      ) : null}
      bulkActions={[
        { label: "Approve", className: "rounded-md bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white", run: async (ids, reload) => { await apiPost("/api/withdrawals/bulk/status", { ids, status: "success" }); toast.success("Selected withdrawals approved"); reload(); } },
        { label: "Fail + Refund", className: "rounded-md bg-rose-600 px-2.5 py-1.5 text-[11px] font-bold text-white", run: async (ids, reload) => { await apiPost("/api/withdrawals/bulk/status", { ids, status: "failed" }); toast.success("Selected withdrawals refunded"); reload(); } },
      ]}
    />
  );
}
