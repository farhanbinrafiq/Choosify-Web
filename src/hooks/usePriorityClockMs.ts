import { useEffect, useState } from 'react';

/**
 * Minute-bucketed clock so priority memos refresh when LIVE / freshness
 * windows cross while the SPA stays open.
 */
export function usePriorityClockMs(intervalMs: number = 60_000): number {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    tick();
    const id = window.setInterval(tick, intervalMs);
    const onFocus = () => tick();
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [intervalMs]);

  return nowMs;
}
