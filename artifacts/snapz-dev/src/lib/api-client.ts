/**
 * Thin fetch wrapper that routes API calls to the correct server.
 *
 * Dev:  Vite proxies /api → localhost:8080 (no extra config needed)
 * Prod: Set VITE_API_URL in Vercel env vars to the deployed Replit API URL
 *       e.g. https://api-server-yourname.replit.app
 */

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function getStoredToken(): string | null {
  try { return localStorage.getItem("snapz_staff_session"); } catch { return null; }
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  auth = false,
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getStoredToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return body;
}
