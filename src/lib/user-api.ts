// User-side API client (separate token from admin)
const RAW_BASE =
  (import.meta.env.VITE_USER_API_URL as string | undefined) ||
  (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ||
  "https://static.babymoon.space";

export const USER_API_BASE = RAW_BASE.replace(/\/+$/, "");

const TOKEN_KEY = "shell_user_token";
const USER_KEY = "shell_user";

export interface AppUser {
  id: number;
  phone: string;
  name: string | null;
  balance: string | number;
  total_recharge: string | number;
  total_withdraw: string | number;
  total_income: string | number;
  referrer_id: number | null;
  referral_code: string | null;
  vip_level: number;
  status: string;
  withdraw_channel: string | null;
  withdraw_account_no: string | null;
  withdraw_account_name: string | null;
  created_at?: string;
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setUserToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getStoredUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AppUser) : null;
}
export function setStoredUser(u: AppUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}

export class UserApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function userApi<T = unknown>(
  path: string,
  opts: { method?: "GET" | "POST" | "PUT" | "DELETE"; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", body } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const tok = getUserToken();
  if (tok) headers.Authorization = `Bearer ${tok}`;
  const res = await fetch(USER_API_BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* */ }
  if (!res.ok) {
    const msg = (data && typeof data === "object" && "error" in data
      ? String((data as { error: unknown }).error)
      : null) || `Request failed (${res.status})`;
    if (res.status === 401) { setUserToken(null); setStoredUser(null); }
    throw new UserApiError(msg, res.status);
  }
  return data as T;
}

export const uGet = <T = unknown>(p: string) => userApi<T>(p);
export const uPost = <T = unknown>(p: string, body?: unknown) => userApi<T>(p, { method: "POST", body });
export const uPut = <T = unknown>(p: string, body?: unknown) => userApi<T>(p, { method: "PUT", body });

// Auth helpers
export async function loginUser(phone: string, password: string) {
  const res = await uPost<{ ok: true; token: string; user: AppUser }>("/api/u/login", { phone, password });
  setUserToken(res.token); setStoredUser(res.user);
  return res.user;
}
export async function registerUser(phone: string, password: string, name?: string, referral_code?: string) {
  const res = await uPost<{ ok: true; token: string; user: AppUser }>("/api/u/register", { phone, password, name, referral_code });
  setUserToken(res.token); setStoredUser(res.user);
  return res.user;
}
export async function fetchMe() {
  const res = await uGet<{ ok: true; user: AppUser }>("/api/u/me");
  setStoredUser(res.user);
  return res.user;
}
export function logoutUser() { setUserToken(null); setStoredUser(null); }

export function fmtPeso(v: string | number | null | undefined): string {
  const n = Number(v ?? 0);
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
