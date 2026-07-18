import type { CreateNotificationPayload, PlatformNotification, UserNotification } from '../types/notifications';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

async function request<T>(path: string, method: 'GET' | 'POST' | 'PATCH' = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || `Notification API failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

/** Client for the centralized notification service (backend fan-out). */
export const notificationApi = {
  listForUser: async (userId: string): Promise<UserNotification[]> => {
    const result = await request<{ data: UserNotification[] }>(`/notifications/user/${encodeURIComponent(userId)}`);
    return result.data;
  },

  markRead: async (userNotificationId: string): Promise<void> => {
    await request(`/notifications/user-items/${encodeURIComponent(userNotificationId)}/read`, 'PATCH', { read: true });
  },

  createAndSend: async (payload: CreateNotificationPayload): Promise<PlatformNotification> => {
    const result = await request<{ notification: PlatformNotification }>('/notifications', 'POST', {
      ...payload,
      sendWeb: payload.sendWeb ?? true,
      sendEmail: payload.sendEmail ?? false,
      sendWhatsapp: payload.sendWhatsapp ?? false,
      sendSms: payload.sendSms ?? false,
      sendPush: payload.sendPush ?? false,
    });
    return result.notification;
  },
};
