import { useCallback, useMemo, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';
import {
  buildMultiSourceEventHub,
  getInteractiveEventBySlug,
  getChapterAtTimestamp,
} from '../utils/spotlightInteractiveCommerce';
import { resolveRelatedExperience } from '../utils/spotlightRelatedExperience';
import { resolveSpotlightExperience } from '../utils/spotlightContentResolver';
import { getAllBrandPosts } from '../lib/brandPosts';
import type { SpotlightLiveTimelineChapter } from '../types/spotlight/interactive/timeline';
import type { SpotlightInteractiveAnalyticsEventType } from '../types/spotlight/interactive/analytics';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

export function useInteractiveCommerce(slug: string | undefined) {
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();
  const [activeSourceId, setActiveSourceId] = useState<string | undefined>();
  const [activeChapter, setActiveChapter] = useState<SpotlightLiveTimelineChapter | undefined>();
  const [simulatedTimestamp, setSimulatedTimestamp] = useState(0);

  const event = useMemo(() => {
    if (!slug) return undefined;
    const campaigns = listCampaignRecords();
    return getInteractiveEventBySlug(slug, campaigns, allCatalogProducts, BRAND_LOGOS);
  }, [slug, allCatalogProducts]);

  const hub = useMemo(() => (event ? buildMultiSourceEventHub(event) : undefined), [event]);

  const currentSourceId = activeSourceId ?? event?.activeSourceId;
  const activeSource = event?.sources.find((s) => s.sourceId === currentSourceId);

  const related = useMemo(() => {
    if (!event) return undefined;
    const all = resolveSpotlightExperience({
      catalog: allCatalogProducts,
      guides: allCatalogGuides,
      creators: allCreators,
      brandPosts: getAllBrandPosts(),
      brandLogos: BRAND_LOGOS,
    });
    const source = all.find((c) => c.contentId === event.contentId);
    return source ? resolveRelatedExperience(source, all) : undefined;
  }, [event, allCatalogProducts, allCatalogGuides, allCreators]);

  const pinnedProducts = useMemo(() => {
    if (!event) return [];
    const pinIds = new Set([
      ...event.pins.filter((p) => p.entityKind === 'product').map((p) => p.entityId),
      ...(event.commerce.pinnedProductIds ?? []),
      ...(event.commerce.featuredProductIds ?? []),
    ]);
    return allCatalogProducts.filter((p) => pinIds.has(p.id));
  }, [event, allCatalogProducts]);

  const selectSource = useCallback((sourceId: string) => {
    setActiveSourceId(sourceId);
    trackInteractiveEvent('source_switched', event?.eventId, { sourceId });
  }, [event?.eventId]);

  const jumpToChapter = useCallback((chapter: SpotlightLiveTimelineChapter) => {
    setActiveChapter(chapter);
    setSimulatedTimestamp(chapter.timestampSeconds);
    trackInteractiveEvent('chapter_viewed', event?.eventId, { chapterId: chapter.chapterId });
  }, [event?.eventId]);

  const syncCommerceAtTime = useCallback((seconds: number) => {
    if (!event) return;
    setSimulatedTimestamp(seconds);
    const chapter = getChapterAtTimestamp(event.timeline, seconds);
    if (chapter) setActiveChapter(chapter);
  }, [event]);

  return {
    event,
    hub,
    activeSource,
    activeChapter,
    simulatedTimestamp,
    pinnedProducts,
    related,
    selectSource,
    jumpToChapter,
    syncCommerceAtTime,
    isReplay: event?.status === 'replay' || event?.status === 'ended',
    isUpcoming: event?.status === 'upcoming',
    isLive: event?.status === 'live',
  };
}

/** Dev-only analytics hook prep (ES-008) */
export function trackInteractiveEvent(
  type: SpotlightInteractiveAnalyticsEventType,
  eventId?: string,
  metadata?: Record<string, unknown>,
) {
  if (import.meta.env.DEV) {
    console.debug('[interactive-commerce]', type, eventId, metadata);
  }
}
