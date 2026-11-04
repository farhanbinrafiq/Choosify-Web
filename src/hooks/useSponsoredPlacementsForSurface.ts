import { useMemo } from 'react';
import { usePlacements } from './usePlacements';
import { SPONSORED_SURFACE_CONFIG } from '../lib/commerce/sponsoredPlacementRegistry';
import { getDemoSponsoredPlacements } from '../data/sponsored/sponsoredDemoPlacements';
import { sponsoredItemsFromResolved } from '../utils/sponsoredPlacementAdapter';
import type { SponsoredPlacementSurface, SponsoredPlacementItem } from '../types/commerce/sponsoredPlacement';
import { AD_SLOTS, useAdSlot } from '../lib/ads/adSlots';
import { adToSponsoredItem } from '../components/ads/AdSlot';

/** CMS placements + demo fallback for a surface — LE-006.3 */
export function useSponsoredPlacementsForSurface(
  surface: SponsoredPlacementSurface,
  options?: { limit?: number; withDemoFallback?: boolean },
): SponsoredPlacementItem[] {
  const config = SPONSORED_SURFACE_CONFIG[surface];
  const limit = options?.limit ?? config.maxPerPage;
  const withDemo = options?.withDemoFallback ?? true;

  const cmsPlacements = usePlacements(config.placementKey, {
    limit,
    withFallback: false,
  });
  // Ads Studio slot DISCOVER_FEED feeds the Recommendations / Discover (spotlight) feed.
  const discoverAds = useAdSlot(AD_SLOTS.DISCOVER_FEED);

  return useMemo(() => {
    const fromAds =
      surface === 'spotlight'
        ? discoverAds.map(adToSponsoredItem).filter((x): x is SponsoredPlacementItem => Boolean(x))
        : [];
    const fromCms = [...fromAds, ...sponsoredItemsFromResolved(cmsPlacements)];
    if (fromCms.length) return fromCms.slice(0, limit);
    // Production shows real booked placements only — demo ads are a local-dev preview aid.
    if (!withDemo || !import.meta.env.DEV) return [];
    return getDemoSponsoredPlacements(surface, limit);
  }, [cmsPlacements, discoverAds, limit, surface, withDemo]);
}
