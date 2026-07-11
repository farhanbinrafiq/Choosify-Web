import { useEffect, useRef } from 'react';
import type { SpotlightImpressionCallbacks } from '../types/spotlight/homepage';

/** ES-008 preparation — impression hooks without analytics implementation */
export function useSpotlightImpression(
  campaignId: string,
  callbacks: SpotlightImpressionCallbacks,
  enabled = true,
) {
  const ref = useRef<HTMLDivElement>(null);
  const firedVisible = useRef(false);

  useEffect(() => {
    if (!enabled || !ref.current || firedVisible.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !firedVisible.current) {
          firedVisible.current = true;
          callbacks.onVisible?.(campaignId);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [campaignId, callbacks, enabled]);

  return {
    ref,
    trackClick: () => callbacks.onClicked?.(campaignId),
    trackPreviewStart: () => callbacks.onPreviewStarted?.(campaignId),
    trackPreviewComplete: () => callbacks.onPreviewCompleted?.(campaignId),
  };
}

export function createSpotlightImpressionLogger(): SpotlightImpressionCallbacks {
  return {
    onVisible: (id) => {
      if (import.meta.env.DEV) console.debug('[spotlight] visible', id);
    },
    onClicked: (id) => {
      if (import.meta.env.DEV) console.debug('[spotlight] clicked', id);
    },
    onPreviewStarted: (id) => {
      if (import.meta.env.DEV) console.debug('[spotlight] preview_started', id);
    },
    onPreviewCompleted: (id) => {
      if (import.meta.env.DEV) console.debug('[spotlight] preview_completed', id);
    },
  };
}
