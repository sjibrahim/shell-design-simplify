// Lightweight admin API client.
// Base URL comes from VITE_ADMIN_API_URL; fall back to the user's domain.

const RAW_BASE =
  (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ||
  "https://static.babymoon.space";

export const API_BASE = RAW_BASE.replace(/\/+$/, "");

const TOKEN_KEY = "shell_admin_token";
const ADMIN_KEY = "shell_admin_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getStoredAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}
export function setStoredAdmin(a: AdminUser | null) {
  if (typeof window === "undefined") return;
  if (a) localStorage.setItem(ADMIN_KEY, JSON.stringify(a));
  else localStorage.removeItem(ADMIN_KEY);
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T = unknown>(
  path: string,
  opts: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    query?: Record<string, string | number | undefined>;
  } = {},
): Promise<T> {
  const { method = "GET", body, query } = opts;
  let url = API_BASE + path;
  if (query) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== "" && v !== null) usp.set(k, String(v));
    }
    const q = usp.toString();
    if (q) url += "?" + q;
  }
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* keep null */ }
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : null) || `Request failed (${res.status})`;
    if (res.status === 401) {
      setToken(null);
      setStoredAdmin(null);
    }
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

export const apiGet    = <T = unknown>(path: string, query?: Record<string, string | number | undefined>) =>
  api<T>(path, { method: "GET", query });
export const apiPost   = <T = unknown>(path: string, body?: unknown) => api<T>(path, { method: "POST", body });
export const apiPut    = <T = unknown>(path: string, body?: unknown) => api<T>(path, { method: "PUT",  body });
export const apiDelete = <T = unknown>(path: string)                 => api<T>(path, { method: "DELETE" });

export interface ListResult<T> {
  ok: true;
  total: number;
  page: number;
  limit: number;
  items: T[];
}
