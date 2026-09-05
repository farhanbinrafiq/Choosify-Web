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
  /** Only present on GET /support/conversations/active — messages not sent
   *  by the caller and not yet in the caller's own readBy. */
  unreadCount?: number;
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
  ensureActiveSupportConversation: (payload?: {
    subject?: string;
    body?: string;
    /** Fixed, surface-determined persona hint — never user-choosable. The
     *  storefront always sends 'consumer' so an account whose current role
     *  is Seller/Creator still reaches its own Consumer-persona Support
     *  thread here; the server independently re-validates this. */
    audience?: 'consumer' | 'seller' | 'creator';
  }) => request<SupportConversationResult>('/support/conversations/ensure', 'POST', payload || {}),
  /** `audience` defaults to the account's own role-derived persona; the
   *  storefront always passes 'consumer' (same reasoning as
   *  ensureActiveSupportConversation above) so it discovers its OWN
   *  Consumer-persona thread even for a Seller/Creator account. */
  getActiveSupportConversation: (audience?: 'consumer' | 'seller' | 'creator') =>
    request<SupportConversationResult>(
      `/support/conversations/active${audience ? `?audience=${audience}` : ''}`,
      'GET',
    ),
  listSupportConversations: () =>
    request<SupportConversationResult['conversation'][]>('/support/conversations', 'GET'),
  listSupportMessages: (conversationId: string) =>
    request<Array<{ id: string; conversationId: string; senderId: string; senderRole: string; body: string; createdAt: string }>>(
      `/support/conversations/${encodeURIComponent(conversationId)}/messages`,
      'GET',
    ),
  sendSupportMessage: (conversationId: string, body: string) =>
    request(`/support/conversations/${encodeURIComponent(conversationId)}/messages`, 'POST', { body }),
  /** Marks every not-by-me message in this conversation read for the caller —
   *  clears the server-side unreadCount getActiveSupportConversation reports,
   *  so it doesn't keep re-flagging an already-read thread as unread. */
  markSupportConversationRead: (conversationId: string) =>
    request(`/support/conversations/${encodeURIComponent(conversationId)}/read`, 'POST', {}),
};
