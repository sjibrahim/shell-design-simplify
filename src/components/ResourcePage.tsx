import { useEffect, useState } from "react";
import { Search, Trash2, Pencil, Plus, RefreshCw, X } from "lucide-react";
import { AdminCard, PageTitle, StatusBadge } from "./AdminLayout";
import { apiDelete, apiGet, apiPost, apiPut, type ListResult } from "@/lib/admin-api";

export type FieldType = "text" | "number" | "select" | "textarea";
type SelectOption = string | number | { label: string; value: string | number };

export interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  options?: SelectOption[];           // for select
  required?: boolean;
  width?: "full" | "half";
}

export interface ColumnDef {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
}

export interface FilterDef { key: string; label: string; options: { value: string; label: string }[] }

export interface ResourcePageProps {
  title: string;
  subtitle?: string;
  endpoint: string;             // e.g. "/api/withdrawals"
  columns: ColumnDef[];
  fields: FieldDef[];
  filters?: FilterDef[];
  searchPlaceholder?: string;
  defaultFilter?: Record<string, string>;
  pinnedFilterKey?: string;     // e.g. "status" for the tab strip in withdrawals
  pinnedFilterLabel?: string;
  pinnedFilterOptions?: { value: string; label: string }[];
  renderRowActions?: (row: Record<string, unknown>, reload: () => void) => React.ReactNode;
  bulkActions?: { label: string; run: (ids: number[], reload: () => void) => Promise<void> | void; className?: string }[];
}

export function ResourcePage(p: ResourcePageProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(1);
  const [limit]           = useState(20);
  const [q, setQ]         = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(p.defaultFilter || {});
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [editing, setEditing] = useState<null | { mode: "create" | "edit"; row: Record<string, unknown> }>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await apiGet<ListResult<Record<string, unknown>>>(p.endpoint, {
        page, limit, q, ...filters,
      });
      setItems(res.items); setTotal(res.total); setSelected([]);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page, JSON.stringify(filters)]);

  const submitSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); void load(); };
  const toggleSelected = (id: number) => setSelected((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  const allPageSelected = items.length > 0 && items.every((row) => selected.includes(row.id as number));
  const toggleAll = () => setSelected(allPageSelected ? [] : items.map((row) => row.id as number));

  const startCreate = () => {
    const blank: Record<string, unknown> = {};
    p.fields.forEach(f => { blank[f.name] = ""; });
    setEditing({ mode: "create", row: blank });
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this record?")) return;
    try { await apiDelete(`${p.endpoint}/${id}`); void load(); }
    catch (e) { alert((e as Error).message); }
  };

  const save = async () => {
    if (!editing) return;
    const body: Record<string, unknown> = {};
    p.fields.forEach(f => {
      const v = editing.row[f.name];
      if (v !== "" && v !== undefined && v !== null) body[f.name] = f.type === "number" ? Number(v) : v;
    });
    try {
      if (editing.mode === "create") await apiPost(p.endpoint, body);
      else await apiPut(`${p.endpoint}/${(editing.row.id as number)}`, body);
      setEditing(null); void load();
    } catch (e) { alert((e as Error).message); }
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <PageTitle
        title={p.title}
        subtitle={p.subtitle}
        action={
          <div className="flex gap-2">
            <button onClick={() => void load()} className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50">
              <RefreshCw size={12} /> Refresh
            </button>
            <button onClick={startCreate} className="flex items-center gap-1 rounded-md bg-shell-red px-3 py-1.5 text-xs font-bold text-white hover:bg-shell-red-dark">
              <Plus size={12} /> Add new
            </button>
          </div>
        }
      />

      {/* Pinned filter tabs */}
      {p.pinnedFilterKey && p.pinnedFilterOptions && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {p.pinnedFilterOptions.map((o) => {
            const active = (filters[p.pinnedFilterKey!] || "") === o.value;
            return (
              <button
                key={o.value}
                onClick={() => { setPage(1); setFilters((f) => ({ ...f, [p.pinnedFilterKey!]: o.value })); }}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  active ? "bg-shell-red text-white shadow" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      <AdminCard className="!p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3">
          <form onSubmit={submitSearch} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={p.searchPlaceholder || "Search…"}
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-sm outline-none focus:border-shell-red"
              />
            </div>
            <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Search</button>
          </form>
          {p.filters?.map((f) => (
            <select
              key={f.key}
              value={filters[f.key] || ""}
              onChange={(e) => { setPage(1); setFilters((prev) => ({ ...prev, [f.key]: e.target.value })); }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
            >
              <option value="">{f.label}: All</option>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
          {p.bulkActions && selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
              <span className="px-1 text-[11px] font-bold text-slate-500">{selected.length} selected</span>
              {p.bulkActions.map((a) => (
                <button key={a.label} onClick={() => void a.run(selected, load)} className={a.className || "rounded-md bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white"}>
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2"><input type="checkbox" checked={allPageSelected} onChange={toggleAll} aria-label="Select all rows" /></th>
                <th className="px-3 py-2">ID</th>
                {p.columns.map((c) => <th key={c.key} className="px-3 py-2">{c.label}</th>)}
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={p.columns.length + 3} className="px-3 py-6 text-center text-slate-400">Loading…</td></tr>}
              {!loading && error && <tr><td colSpan={p.columns.length + 3} className="px-3 py-6 text-center text-rose-500">{error}</td></tr>}
              {!loading && !error && items.length === 0 && <tr><td colSpan={p.columns.length + 3} className="px-3 py-8 text-center text-slate-400">No records</td></tr>}
              {!loading && items.map((row) => (
                <tr key={row.id as number} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(row.id as number)} onChange={() => toggleSelected(row.id as number)} aria-label={`Select row ${row.id}`} /></td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{row.id as number}</td>
                  {p.columns.map((c) => (
                    <td key={c.key} className="px-3 py-2">
                      {c.render ? c.render(row) : String(row[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      {p.renderRowActions?.(row, load)}
                      <button onClick={() => setEditing({ mode: "edit", row })} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-shell-red"><Pencil size={14} /></button>
                      <button onClick={() => void remove(row.id as number)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-rose-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 p-3 text-xs text-slate-500">
          <div>Total <b className="text-slate-700">{total}</b> records</div>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1}    onClick={() => setPage((n) => n - 1)} className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40">Prev</button>
            <span>Page {page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage((n) => n + 1)} className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      </AdminCard>

      {/* Edit / Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-extrabold">{editing.mode === "create" ? "Add new" : `Edit #${editing.row.id}`}</h2>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {p.fields.map((f) => (
                <div key={f.name} className={f.width === "half" ? "col-span-1" : "col-span-2"}>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      value={String(editing.row[f.name] ?? "")}
                      onChange={(e) => setEditing({ ...editing, row: { ...editing.row, [f.name]: e.target.value } })}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">—</option>
                      {f.options?.map((o) => {
                        const value = typeof o === "object" ? o.value : o;
                        const label = typeof o === "object" ? o.label : o;
                        return <option key={String(value)} value={value}>{label}</option>;
                      })}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={String(editing.row[f.name] ?? "")}
                      onChange={(e) => setEditing({ ...editing, row: { ...editing.row, [f.name]: e.target.value } })}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={String(editing.row[f.name] ?? "")}
                      onChange={(e) => setEditing({ ...editing, row: { ...editing.row, [f.name]: e.target.value } })}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold">Cancel</button>
              <button onClick={() => void save()} className="rounded-md bg-shell-red px-3 py-1.5 text-xs font-bold text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { StatusBadge };
