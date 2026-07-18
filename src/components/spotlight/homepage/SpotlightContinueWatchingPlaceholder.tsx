import React from 'react';
import type { SpotlightContinueWatchingPlaceholder } from '../../../types/spotlight/homepage';
import { SPOTLIGHT_CONTINUE_WATCHING_KEY } from '../../../types/spotlight/homepage';

/**
 * Architecture placeholder for Continue Watching / Recently Viewed (CTO).
 * No UI implementation in LE-005.5 — reserved for future AI + merchandising.
 */
export function readContinueWatchingPlaceholder(): SpotlightContinueWatchingPlaceholder {
  try {
    const raw = sessionStorage.getItem(SPOTLIGHT_CONTINUE_WATCHING_KEY);
    if (!raw) return { enabled: false, campaignIds: [] };
    return JSON.parse(raw) as SpotlightContinueWatchingPlaceholder;
  } catch {
    return { enabled: false, campaignIds: [] };
  }
}

export function SpotlightContinueWatchingPlaceholder() {
  const slot = readContinueWatchingPlaceholder();
  if (!slot.enabled || slot.campaignIds.length === 0) return null;

  return (
    <div
      className="hidden"
      data-spotlight-continue-watching="reserved"
      aria-hidden
      data-campaign-ids={slot.campaignIds.join(',')}
    />
  );
}
