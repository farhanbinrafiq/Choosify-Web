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
  listViralTodaySpotlightCampaigns,
  pickFeaturedCampaignOfDay,
} from '../utils/spotlightHomepage';
import { CONTENT_PRIORITY_WINDOW_MS } from '../utils/contentPriority';

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

  /** Active + 24h-grace livestream campaigns for Viral Today ranking */
  const viralTodayCards = useMemo(() => {
    void revision;
    const nowMs = Date.now();
    const records = listViralTodaySpotlightCampaigns(nowMs);
    // Keep grace livestreams even if they fall outside the current homepage filter
    const graceOrLive = records.filter((c) => {
      if (c.campaignType === 'livestream') return true;
      return campaigns.some((a) => a.campaignId === c.campaignId);
    });
    // Prefer filtered+sorted order for non-live; append grace livestreams not already present
    const orderedIds = new Set(campaigns.map((c) => c.campaignId));
    const merged = [
      ...campaigns,
      ...graceOrLive.filter((c) => !orderedIds.has(c.campaignId)),
    ];
    void CONTENT_PRIORITY_WINDOW_MS;
    return merged.map((c) => buildHomepageSpotlightCard(c, catalog, brandLogos));
  }, [campaigns, catalog, brandLogos, revision]);

  const featured = useMemo(() => {
    const camp = pickFeaturedCampaignOfDay(campaigns);
    return camp ? buildHomepageSpotlightCard(camp, catalog, brandLogos) : undefined;
  }, [campaigns, catalog, brandLogos]);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  return {
    filter,
    setFilter,
    cards,
    viralTodayCards,
    featured,
    campaigns,
    refresh,
    hasCampaigns: cards.length > 0,
  };
}
