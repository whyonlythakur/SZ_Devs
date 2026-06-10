import { apiFetch } from './api-client';

export const SESSION_KEY = 'snapz_staff_session';

export interface StaffUser {
  username: string;
  avatar: string | null;
  role: 'admin';
  is_frozen: boolean;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(SESSION_KEY);
}

const admin = (method: string, path: string, body?: any) =>
  apiFetch(`/api/admin${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  }, true);

export const dashApi = {
  login: (key: string) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ key }) }),

  me: () => apiFetch('/api/auth/me', {}, true).then((r) => ({ user: r.user })),

  listBots: () => admin('GET', '/bots'),
  createBot: (data: any) => admin('POST', '/bots', data),
  updateBot: (data: any) => {
    const { id, ...rest } = data;
    return admin('PATCH', `/bots/${id}`, rest);
  },
  deleteBot: (id: number) => admin('DELETE', `/bots/${id}`),
  toggleVisibility: (id: number, is_visible: boolean) =>
    admin('PATCH', `/bots/${id}/visibility`, { is_visible }),

  listAudit: () => admin('GET', '/audit'),
};
