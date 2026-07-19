import { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';

/**
 * Dev-only banner when the app is serving static mock catalog data
 * because the live catalog API failed. Never renders in production builds.
 */
export function OfflineFallbackBanner() {
  const { isUsingFallbackData } = useGlobalState();
  const [dismissed, setDismissed] = useState(false);

  if (!import.meta.env.DEV || !isUsingFallbackData || dismissed) {
    return null;
  }

  return (
    <div
      role="status"
      className="sticky top-0 z-[100] flex items-center justify-between gap-3 bg-amber-100 px-4 py-2 text-sm text-amber-950 border-b border-amber-200"
    >
      <p>
        Showing offline/sample catalog data — the live API is unavailable. This
        banner only appears in development.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded px-2 py-1 text-amber-900 underline-offset-2 hover:underline"
        aria-label="Dismiss offline data banner"
      >
        Dismiss
      </button>
    </div>
  );
}
