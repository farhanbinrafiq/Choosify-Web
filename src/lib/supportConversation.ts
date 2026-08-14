import { toast } from './notify';
import { messagingApi } from '../services/messagingApi';
import { PLACEHOLDER_IMAGE } from '../constants';

export const CHOOSIFY_SUPPORT_THREAD_TITLE = 'Choosify Support';

export type EnsureSupportThreadHelpers = {
  createNewThread: (
    id: string,
    title: string,
    avatar: string,
    type: 'retail' | 'general' | 'announcement',
    lastMessage: string,
    orderRef?: string,
  ) => void;
  selectThread?: (id: string) => void;
};

export function isChoosifySupportThread(thread?: {
  id?: string;
  title?: string;
  type?: string;
  orderRef?: string;
} | null): boolean {
  if (!thread) return false;
  if (thread.title === CHOOSIFY_SUPPORT_THREAD_TITLE) return true;
  if (thread.type === 'general' && !thread.orderRef && /^conv[_-]/.test(String(thread.id || ''))) {
    return true;
  }
  return false;
}

/**
 * Shared storefront entry: GET/ENSURE the caller's one active support conversation.
 */
export async function ensureStorefrontSupportThread(
  helpers: EnsureSupportThreadHelpers,
): Promise<{ conversationId: string; created: boolean } | null> {
  try {
    const result = await messagingApi.ensureActiveSupportConversation();
    const conversationId = result.conversation?.id;
    if (!conversationId) {
      toast.error('Could not open support conversation.');
      return null;
    }
    const preview =
      result.message?.body ||
      result.conversation.lastMessagePreview ||
      'How can we help you today?';
    helpers.createNewThread(
      conversationId,
      CHOOSIFY_SUPPORT_THREAD_TITLE,
      PLACEHOLDER_IMAGE,
      'general',
      preview,
    );
    helpers.selectThread?.(conversationId);
    if (result.created) {
      toast.success('Support conversation opened.');
    } else {
      toast.success('You already have an active support conversation.');
    }
    return { conversationId, created: result.created };
  } catch (err) {
    toast.error((err as Error)?.message || 'Could not open support conversation.');
    return null;
  }
}
