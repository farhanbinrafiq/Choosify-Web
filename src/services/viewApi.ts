import React from 'react';
import { getAccessToken } from '../lib/authSession';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

/**
 * Records a page view (counted once per visitor per item per day on the
 * server; a seller viewing their own page isn't counted) and returns the
 * item's real total view count. Never throws — views are best-effort.
 */
export async function recordPageView(kind: 'product' | 'brand', id: string): Promise<number | null> {
  if (!id) return null;
  try {
    const token = getAccessToken();
    const res = await fetch(`${API_BASE}/views/${kind}/${encodeURIComponent(id)}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      // Where the visitor came from (Facebook, Google, inside Choosify…) for the seller's view insights.
      body: JSON.stringify({ referrer: typeof document !== 'undefined' ? document.referrer : '' }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: number };
    return typeof data.count === 'number' ? data.count : null;
  } catch {
    return null;
  }
}

/** Records a view for this page once per mount and returns the live total (null until known). */
export function usePageViews(kind: 'product' | 'brand', id: string | undefined, fallback?: number): number | null {
  const [count, setCount] = React.useState<number | null>(
    typeof fallback === 'number' && fallback > 0 ? fallback : null,
  );
  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    recordPageView(kind, id).then((n) => {
      if (!cancelled && n !== null) setCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [kind, id]);
  return count;
}

