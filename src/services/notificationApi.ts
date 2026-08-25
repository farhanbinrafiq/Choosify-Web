import { getAccessToken } from '../lib/authSession';

/**
 * Sprint 9 rewrite — the previous client here targeted `/api/v1/notifications/user/:userId`
 * and `/api/v1/notifications/user-items/:id/read`, neither of which exist. The real
 * notification domain is `communicationRouter.ts`, mounted at `/api` (not `/api/v1`), and
 * has no public "create notification for a user" endpoint by design — creation only ever
 * happens server-side, from trusted business logic (see server/communication/systemNotify.ts
 * notifyUser/notifyRoles), the same way partner-application approvals already work. This
 * client is read/acknowledge only.
 */
const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api';

export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low' | 'silent';

export type AppNotification = {
  id: string;
  userId: string;
  type: string;
  category: string;
  priority: NotificationPriority;
  title: string;
  summary?: string;
  actionUrl?: string;
  channels: string[];
  read: boolean;
  dismissed: boolean;
  archived: boolean;
  pinned: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
};

export type NotificationSummary = {
  total: number;
  unread: number;
  read: number;
  archived: number;
  pinned: number;
  dismissed: number;
};

async function request<T>(path: string, method: 'GET' | 'POST' | 'PATCH' = 'GET', body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const raw = await response.text();
  let parsed: { success?: boolean; data?: T; error?: string } | null = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  if (!response.ok) {
    throw new Error(parsed?.error || raw || `Notification request failed (${response.status})`);
  }
  return (parsed && typeof parsed === 'object' && 'data' in parsed ? (parsed.data as T) : (parsed as T));
}

export const notificationApi = {
  list: async (opts?: {
    limit?: number;
    archived?: boolean;
    dismissed?: boolean;
  }): Promise<{ items: AppNotification[]; summary: NotificationSummary }> => {
    const qs = new URLSearchParams();
    qs.set('limit', String(opts?.limit ?? 30));
    qs.set('archived', String(opts?.archived ?? false));
    qs.set('dismissed', String(opts?.dismissed ?? false));
    return request(`/notifications?${qs.toString()}`);
  },
  markRead: async (id: string): Promise<AppNotification> =>
    request(`/notifications/${encodeURIComponent(id)}/read`, 'PATCH'),
  markAllRead: async (ids: string[]): Promise<void> => {
    if (!ids.length) return;
    await request('/notifications/read', 'POST', { ids });
  },
};
