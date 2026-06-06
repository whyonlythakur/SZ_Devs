// Client-side helper for calling the staff dashboard edge functions.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://sgkzbzopwzmktcoawnmx.supabase.co";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNna3piem9wd3pta3Rjb2F3bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDc4NTgsImV4cCI6MjA4NzUyMzg1OH0.By9Afsd6sy3x0pfECe4vyVlJFb3-5Ida3GNTWdngATs";

export const SESSION_KEY = "snapz_staff_session";

export interface StaffUser {
  discord_id: string;
  username: string;
  avatar: string | null;
  role: "founder" | "ceo" | "coo" | "cto";
  is_frozen: boolean;
  frozen_by: string | null;
  frozen_at: string | null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(SESSION_KEY);
}

async function callEdge(
  fn: string,
  init: RequestInit = {},
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: ANON_KEY,
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fn}`, {
    ...init,
    headers,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body;
}

// --- Auth ---
export async function getDiscordLoginUrl(redirectUri: string): Promise<string> {
  const r = await callEdge(
    `discord-auth?action=login&redirect_uri=${encodeURIComponent(redirectUri)}`,
    { method: "GET" },
  );
  return r.url;
}

export async function exchangeDiscordCode(code: string, redirectUri: string) {
  return await callEdge("discord-auth", {
    method: "POST",
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  });
}

// --- API actions ---
const api = (action: string, body?: any) =>
  callEdge(`dashboard-api?action=${action}`, {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
  });

export const dashApi = {
  me: () => api("me"),
  listBots: () => api("list-bots"),
  listStaff: () => api("list-staff"),
  listAudit: () => api("list-audit"),
  createBot: (data: any) => api("create-bot", data),
  updateBot: (data: any) => api("update-bot", data),
  deleteBot: (id: number) => api("delete-bot", { id }),
  toggleVisibility: (id: number, is_visible: boolean) =>
    api("toggle-visibility", { id, is_visible }),
  freeze: (discord_id: string) => api("freeze", { discord_id }),
  unfreeze: (discord_id: string) => api("unfreeze", { discord_id }),
};
