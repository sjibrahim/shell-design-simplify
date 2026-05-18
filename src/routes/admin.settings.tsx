import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminCard, PageTitle } from "@/components/AdminLayout";
import { apiGet, apiPut } from "@/lib/admin-api";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

interface Settings {
  site_name?: string;
  support_email?: string;
  support_whatsapp?: string;
  telegram_url?: string;
  withdrawal_min?: number;
  withdrawal_max?: number;
  withdrawal_fee_pct?: number;
  withdrawal_open_from?: string;
  withdrawal_open_to?: string;
  referral_l1_pct?: number;
  referral_l2_pct?: number;
  referral_l3_pct?: number;
  signup_bonus?: number;
  maintenance_mode?: string;
  announcement?: string;
}

function SettingsPage() {
  const [data, setData] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet<{ ok: true; settings: Settings }>("/api/settings");
        setData(res.settings || {});
      } catch (e) { setMsg((e as Error).message); }
      finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      await apiPut("/api/settings", data);
      setMsg("Saved successfully");
    } catch (e) { setMsg((e as Error).message); }
    finally { setSaving(false); }
  };

  const field = (key: keyof Settings, label: string, type: "text" | "number" | "textarea" = "text") => (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={3}
          value={String(data[key] ?? "")}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      ) : (
        <input
          type={type}
          value={String(data[key] ?? "")}
          onChange={(e) => setData({ ...data, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      )}
    </div>
  );

  if (loading) return <div className="p-6 text-slate-400">Loading settings…</div>;

  return (
    <div>
      <PageTitle
        title="Settings"
        subtitle="Global configuration for the Shell Oil platform"
        action={
          <button onClick={() => void save()} disabled={saving}
            className="flex items-center gap-1.5 rounded-md bg-shell-red px-4 py-2 text-xs font-bold text-white hover:bg-shell-red-dark disabled:opacity-50">
            <Save size={14} /> {saving ? "Saving…" : "Save changes"}
          </button>
        }
      />

      {msg && <div className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-sm font-extrabold">General</h2>
          <div className="grid gap-3">
            {field("site_name", "Site name")}
            {field("support_email", "Support email")}
            {field("support_whatsapp", "Support WhatsApp")}
            {field("telegram_url", "Telegram group URL")}
            {field("announcement", "Top announcement", "textarea")}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-extrabold">Withdrawal Rules</h2>
          <div className="grid grid-cols-2 gap-3">
            {field("withdrawal_min", "Minimum (₱)", "number")}
            {field("withdrawal_max", "Maximum (₱)", "number")}
            {field("withdrawal_fee_pct", "Fee %", "number")}
            {field("withdrawal_open_from", "Open from (HH:MM)")}
            {field("withdrawal_open_to", "Open to (HH:MM)")}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-extrabold">Referral Commission</h2>
          <div className="grid grid-cols-3 gap-3">
            {field("referral_l1_pct", "Level 1 %", "number")}
            {field("referral_l2_pct", "Level 2 %", "number")}
            {field("referral_l3_pct", "Level 3 %", "number")}
          </div>
          <div className="mt-3">{field("signup_bonus", "Signup bonus (₱)", "number")}</div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-extrabold">System</h2>
          <div className="grid gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Maintenance mode</label>
              <select
                value={data.maintenance_mode ?? "off"}
                onChange={(e) => setData({ ...data, maintenance_mode: e.target.value })}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="off">Off — site is live</option>
                <option value="on">On — block user access</option>
              </select>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
