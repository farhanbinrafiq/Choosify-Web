import { useMemo } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import type { PlacementKey } from '../lib/placements';
import { isPlacementActive } from '../utils/editorialMappers';
import {
  buildFallbackLandscapePlacement,
  buildFallbackPortraitPlacement,
  resolvePlacementContent,
  type ResolvedPlacement,
} from '../utils/resolvePlacementContent';

type UsePlacementsOptions = {
  limit?: number;
  entityType?: ResolvedPlacement['entityType'];
  /** Show catalog fallback when CMS has no active placements */
  withFallback?: boolean;
  fallbackVariant?: 'portrait' | 'landscape';
};

export function usePlacements(
  placementKey: PlacementKey | string,
  options: UsePlacementsOptions = {},
): ResolvedPlacement[] {
  const {
    allPlacements,
    allCatalogProducts,
    allCatalogBrands,
    allDeals,
    allCatalogGuides,
    allCatalogCreators,
    allCreators,
  } = useGlobalState();

  const {
    limit = 3,
    entityType,
    withFallback = true,
    fallbackVariant = 'portrait',
  } = options;

  const catalogs = useMemo(
    () => ({
      products: allCatalogProducts,
      brands: allCatalogBrands,
      deals: allDeals,
      guides: allCatalogGuides,
      creators: allCatalogCreators.length > 0 ? allCatalogCreators : [],
    }),
    [allCatalogProducts, allCatalogBrands, allDeals, allCatalogGuides, allCatalogCreators],
  );

  return useMemo(() => {
    const resolved = allPlacements
      .filter(
        (placement) =>
          isPlacementActive(placement) &&
          placement.placement === placementKey &&
          (!entityType || placement.entityType === entityType),
      )
      .sort((a, b) => b.priority - a.priority)
      .map((placement) => resolvePlacementContent(placement, catalogs))
      .filter((item): item is ResolvedPlacement => Boolean(item))
      .slice(0, limit);

    if (resolved.length || !withFallback) return resolved;

    const fallback =
      fallbackVariant === 'landscape'
        ? buildFallbackLandscapePlacement(catalogs)
        : buildFallbackPortraitPlacement(catalogs);

    return fallback ? [fallback] : [];
  }, [
    allPlacements,
    catalogs,
    placementKey,
    entityType,
    limit,
    withFallback,
    fallbackVariant,
  ]);
}

export function usePrimaryPlacement(
  placementKey: PlacementKey | string,
  options: Omit<UsePlacementsOptions, 'limit'> = {},
): ResolvedPlacement | null {
  const placements = usePlacements(placementKey, { ...options, limit: 1 });
  return placements[0] ?? null;
}
