import { useCallback, useEffect, useState } from 'react';
import { notificationApi, type AppNotification, type NotificationSummary } from '../services/notificationApi';
import { useMessagingPoll } from './useMessagingPoll';

const EMPTY_SUMMARY: NotificationSummary = { total: 0, unread: 0, read: 0, archived: 0, pinned: 0, dismissed: 0 };

/**
 * "New message"/"Support replied" alerts (server/messaging/conversations/
 * conversationService.ts's `notifyUser(... metadata: { conversationId,
 * messageId } ...)`) are ALSO reflected as unread on the real conversation
 * thread in the Inbox list. Surfacing them again here would both double-count
 * the same event in the navbar badge and duplicate it as a second, wrong
 * "message-shaped" post inside a channel that's supposed to hold only
 * operational/campaign/system notifications (never normal Seller/Consumer
 * messages — see product rule: normal messages stay in their own
 * conversation, only notification campaigns route to this channel). Detected
 * by the presence of `metadata.messageId`, which only ever appears on that
 * one notification shape.
 */
function isConversationMessageAlert(n: AppNotification): boolean {
  return Boolean(n.metadata && typeof n.metadata === 'object' && 'messageId' in n.metadata);
}

/**
 * Single shared read of the canonical notification store (server/communication/*)
 * — never a second/duplicated record. Used by both the Navbar unread badge and
 * the Inbox "Notifications" channel so there is exactly one client-side view of
 * "what's unread". Filters out conversation-message alerts (see above) and
 * recomputes `unread` from what's actually shown, rather than trusting the
 * server's raw summary.unread (which still includes those alerts).
 */
export function useNotificationsFeed(enabled: boolean) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [summary, setSummary] = useState<NotificationSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await notificationApi.list({ limit: 30 });
      const filtered = result.items.filter((n) => !isConversationMessageAlert(n));
      setItems(filtered);
      setSummary({
        ...result.summary,
        unread: filtered.filter((n) => !n.read).length,
        total: filtered.length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setSummary(EMPTY_SUMMARY);
      return;
    }
    void refresh();
  }, [enabled, refresh]);

  useMessagingPoll(enabled ? 'notifications-feed' : null, refresh);

  const markRead = useCallback(async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setSummary((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    try {
      await notificationApi.markRead(id);
    } catch {
      void refresh();
    }
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    const unreadIds = items.filter((n) => !n.read).map((n) => n.id);
    if (!unreadIds.length) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setSummary((prev) => ({ ...prev, unread: 0 }));
    try {
      await notificationApi.markAllRead(unreadIds);
    } catch {
      void refresh();
    }
  }, [items, refresh]);

  return { items, summary, loading, error, refresh, markRead, markAllRead };
}
