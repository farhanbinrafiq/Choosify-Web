import { useEffect, useRef } from 'react';
import { getMessagingTransport } from '../lib/messagingTransport';

/**
 * REST-polling safety net for a live conversation surface. Only actually
 * polls when `getMessagingTransport()` reports the omni Firestore mirror is
 * NOT live (server running on its memory-disk fallback) — when Firestore
 * really is live, this is a no-op.
 *
 * - `key`: a stable identifier for what's being polled (e.g. a thread id).
 *   `null`/`undefined` disables polling and tears down any running interval.
 * - Never runs more than one interval at a time — scoped to a single effect
 *   run, torn down before any new one starts (on key change or unmount).
 * - Refetches once immediately whenever the tab regains focus/visibility,
 *   regardless of polling mode.
 */
export function useMessagingPoll(
  key: string | null | undefined,
  refetch: () => void,
  intervalMs = 4000,
): void {
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    let intervalId: number | undefined;

    const onFocus = () => {
      if (!cancelled && document.visibilityState === 'visible') refetchRef.current();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    void getMessagingTransport().then((transport) => {
      if (cancelled || transport !== 'rest-polling') return;
      intervalId = window.setInterval(() => refetchRef.current(), intervalMs);
    });

    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [key, intervalMs]);
}
