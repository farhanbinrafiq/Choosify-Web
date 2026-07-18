import { useMemo } from 'react';
import { usePlacements } from './usePlacements';
import { SPONSORED_SURFACE_CONFIG } from '../lib/commerce/sponsoredPlacementRegistry';
import { getDemoSponsoredPlacements } from '../data/sponsored/sponsoredDemoPlacements';
import { sponsoredItemsFromResolved } from '../utils/sponsoredPlacementAdapter';
import type { SponsoredPlacementSurface, SponsoredPlacementItem } from '../types/commerce/sponsoredPlacement';

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

  return useMemo(() => {
    const fromCms = sponsoredItemsFromResolved(cmsPlacements);
    if (fromCms.length) return fromCms.slice(0, limit);
    if (!withDemo) return [];
    return getDemoSponsoredPlacements(surface, limit);
  }, [cmsPlacements, limit, surface, withDemo]);
}
