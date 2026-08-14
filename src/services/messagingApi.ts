import { getAccessToken } from '../lib/authSession';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

export type SupportConversationResult = {
  created: boolean;
  ticket: {
    id: string;
    conversationId: string;
    openerId: string;
    subject: string;
    status: string;
  };
  conversation: {
    id: string;
    contextType: string;
    status: string;
    lastMessagePreview?: string;
  };
  message?: { id: string; body: string; createdAt: string } | null;
};

async function request<T>(path: string, method: 'GET' | 'POST' = 'POST', body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const parsed = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    data?: T;
    error?: string;
    message?: string;
  };
  if (!response.ok || parsed.success === false) {
    throw new Error(parsed.error || parsed.message || `Request failed (${response.status})`);
  }
  return (parsed.data as T) ?? (parsed as T);
}

export const messagingApi = {
  ensureActiveSupportConversation: (payload?: { subject?: string; body?: string }) =>
    request<SupportConversationResult>('/support/conversations/ensure', 'POST', payload || {}),
  getActiveSupportConversation: () =>
    request<SupportConversationResult>('/support/conversations/active', 'GET'),
  listSupportConversations: () =>
    request<SupportConversationResult['conversation'][]>('/support/conversations', 'GET'),
  listSupportMessages: (conversationId: string) =>
    request<Array<{ id: string; conversationId: string; senderId: string; senderRole: string; body: string; createdAt: string }>>(
      `/support/conversations/${encodeURIComponent(conversationId)}/messages`,
      'GET',
    ),
  sendSupportMessage: (conversationId: string, body: string) =>
    request(`/support/conversations/${encodeURIComponent(conversationId)}/messages`, 'POST', { body }),
};
