import { useCallback, useMemo, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { getAllBrandPosts } from '../lib/brandPosts';
import type { SpotlightDiscoverFilters } from '../types/spotlight/experience/filters';
import { DEFAULT_SPOTLIGHT_DISCOVER_FILTERS, SPOTLIGHT_DISCOVER_FILTER_KEY } from '../types/spotlight/experience/filters';
import type { SpotlightUniversalFilters } from '../types/spotlight/discovery/filters';
import { DEFAULT_UNIVERSAL_FILTERS } from '../types/spotlight/discovery/filters';
import { resolveSpotlightExperience } from '../utils/spotlightContentResolver';
import { buildSpotlightDiscoverSections } from '../utils/spotlightDiscoverSections';
import { listSpotlightCollections } from '../utils/spotlightCollections';
import { listSpotlightSeries } from '../utils/spotlightSeries';
import { buildCalendarEvents } from '../utils/spotlightCalendar';
import { buildPersonalizedRails } from '../utils/spotlightPersonalizedRails';
import { listHistory } from '../utils/spotlightUserSignals';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

function loadFilters(): SpotlightDiscoverFilters {
  try {
    const raw = sessionStorage.getItem(SPOTLIGHT_DISCOVER_FILTER_KEY);
    if (!raw) return DEFAULT_SPOTLIGHT_DISCOVER_FILTERS;
    const parsed = JSON.parse(raw) as Partial<SpotlightDiscoverFilters>;
    const merged = { ...DEFAULT_SPOTLIGHT_DISCOVER_FILTERS, ...parsed };
    const asArray = <T,>(value: unknown, fallback: T[]): T[] =>
      Array.isArray(value) ? (value as T[]) : fallback;
    return {
      ...merged,
      contentTypes: asArray(merged.contentTypes, []),
      brandIds: asArray(merged.brandIds, []),
      publisherIds: asArray(merged.publisherIds, []),
      publisherTypes: asArray(merged.publisherTypes, []),
      categoryIds: asArray(merged.categoryIds, []),
      serviceIds: asArray(merged.serviceIds, []),
      campaignIds: asArray(merged.campaignIds, []),
      creatorIds: asArray(merged.creatorIds, []),
    };
  } catch {
    return DEFAULT_SPOTLIGHT_DISCOVER_FILTERS;
  }
}

export function useSpotlightExperience() {
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();
  const [filters, setFiltersState] = useState<SpotlightDiscoverFilters>(loadFilters);

  const brandPosts = useMemo(() => getAllBrandPosts(), []);

  const allContent = useMemo(
    () =>
      resolveSpotlightExperience({
        catalog: allCatalogProducts,
        guides: allCatalogGuides,
        creators: allCreators,
        brandPosts,
        brandLogos: BRAND_LOGOS,
      }),
    [allCatalogProducts, allCatalogGuides, allCreators, brandPosts],
  );

  const collections = useMemo(() => listSpotlightCollections(allContent), [allContent]);
  const series = useMemo(() => listSpotlightSeries(allContent), [allContent]);
  const history = useMemo(() => listHistory(), []);
  const calendarEvents = useMemo(() => buildCalendarEvents(allContent), [allContent]);
  const personalizedRails = useMemo(() => buildPersonalizedRails(allContent), [allContent]);

  const sections = useMemo(
    () => buildSpotlightDiscoverSections(allContent, filters, { history, collections, series }),
    [allContent, filters, history, collections, series],
  );

  const setFilters = useCallback((next: SpotlightDiscoverFilters) => {
    setFiltersState(next);
    try {
      sessionStorage.setItem(SPOTLIGHT_DISCOVER_FILTER_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const updateFilter = useCallback(
    (patch: Partial<SpotlightDiscoverFilters>) => {
      setFilters({ ...filters, ...patch });
    },
    [filters, setFilters],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_SPOTLIGHT_DISCOVER_FILTERS), [setFilters]);

  return {
    allContent,
    sections,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    hasContent: allContent.length > 0,
    collections,
    series,
    history,
    calendarEvents,
    personalizedRails,
  };
}

export function useSpotlightDiscovery() {
  return useSpotlightExperience();
}

export type { SpotlightDiscoverSection } from '../types/spotlight/experience/content';

/** Universal filters — extends discover filters with Phase 4 dimensions */
export function useUniversalFilters() {
  const { filters, setFilters } = useSpotlightExperience();
  const universal: SpotlightUniversalFilters = { ...DEFAULT_UNIVERSAL_FILTERS, ...filters };
  return { universal, setFilters };
}
