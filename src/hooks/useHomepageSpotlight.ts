import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CatalogProduct } from '../types/catalog';
import type {
  SpotlightHomepageFilter,
  SpotlightHomepageSort,
  SpotlightRotationConfig,
} from '../types/spotlight/homepage';
import { SPOTLIGHT_HOMEPAGE_FILTER_KEY } from '../types/spotlight/homepage';
import {
  buildHomepageSpotlightCard,
  filterAndSortHomepageCampaigns,
  pickFeaturedCampaignOfDay,
} from '../utils/spotlightHomepage';

const DEFAULT_ROTATION: SpotlightRotationConfig = {
  strategies: ['sponsored_first', 'priority', 'new_launch', 'trending', 'ai_recommended'],
};

export function useHomepageSpotlight(
  catalog: CatalogProduct[],
  brandLogos: Record<string, string>,
) {
  const [filter, setFilterState] = useState<SpotlightHomepageFilter>(() => {
    try {
      const saved = sessionStorage.getItem(SPOTLIGHT_HOMEPAGE_FILTER_KEY);
      return (saved as SpotlightHomepageFilter) || 'all';
    } catch {
      return 'all';
    }
  });
  const [sort] = useState<SpotlightHomepageSort>('priority');
  const [revision, setRevision] = useState(0);

  const setFilter = useCallback((f: SpotlightHomepageFilter) => {
    setFilterState(f);
    try {
      sessionStorage.setItem(SPOTLIGHT_HOMEPAGE_FILTER_KEY, f);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onStorage = () => setRevision((r) => r + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const campaigns = useMemo(() => {
    void revision;
    return filterAndSortHomepageCampaigns(filter, sort, DEFAULT_ROTATION);
  }, [filter, sort, revision]);

  const cards = useMemo(
    () => campaigns.map((c) => buildHomepageSpotlightCard(c, catalog, brandLogos)),
    [campaigns, catalog, brandLogos],
  );

  const featured = useMemo(() => {
    const camp = pickFeaturedCampaignOfDay(campaigns);
    return camp ? buildHomepageSpotlightCard(camp, catalog, brandLogos) : undefined;
  }, [campaigns, catalog, brandLogos]);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  return { filter, setFilter, cards, featured, campaigns, refresh, hasCampaigns: cards.length > 0 };
}
