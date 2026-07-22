import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PAGE_LISTING_SINGLE_SHELL, PAGE_MIDDLE_FEED } from '../lib/pageLayout';
import { ListingFeedHeader } from '../components/design/ListingFeedHeader';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';
import { useSpotlightHistory } from '../hooks/useSpotlightHistory';
import { SpotlightEmptyState } from '../components/spotlight/homepage/SpotlightEmptyState';
import { DiscoverStructuredFeed } from '../components/spotlight/discovery/DiscoverStructuredFeed';
import { useGlobalState } from '../context/GlobalStateContext';
import { contentTypesForTab } from '../lib/spotlight/content/contentTypeRegistry';
import type { SpotlightContentTabId } from '../types/spotlight/discovery/navigation';
import { listFollows, listSaves } from '../utils/spotlightUserSignals';
import { useSpotlightFloatingFilters } from '../hooks/useSpotlightFloatingFilters';
import { filterSpotlightFeedItems, SPOTLIGHT_FEED_VISIBLE_KEY } from '../utils/spotlightMixedFeed';
import {
  hasActiveLiveContent,
  prioritizeSpotlightContent,
} from '../utils/contentPriority';
import { usePriorityClockMs } from '../hooks/usePriorityClockMs';
import { LISTING_PAGE_MAX_WIDTH } from '../lib/design/dcListingTokens';

const FORMAT_FILTER_TABS = new Set<SpotlightContentTabId>([
  'videos',
  'reels',
  'live',
  'reviews',
  'guides',
  'campaigns',
  'blogs',
  'launches',
  'announcements',
  'recommendations',
]);

export function SpotlightDiscoverPage() {
  const { allContent, filters, setFilters, resetFilters, hasContent } = useSpotlightExperience();
  const { allCatalogProducts } = useGlobalState();
  const navigate = useNavigate();
  const { recordView } = useSpotlightHistory(allContent);
  const impressionCallbacks = useMemo(() => {
    const base = createSpotlightImpressionLogger();
    return {
      ...base,
      onClicked: (id: string) => {
        base.onClicked?.(id);
        const item = allContent.find((c) => c.sourceId === id || c.contentId === id);
        if (item) recordView(item);
      },
    };
  }, [allContent, recordView]);

  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') ?? 'featured') as SpotlightContentTabId;
  const linkedProductId = searchParams.get('product');
  const linkedBrandId = searchParams.get('brand');
  const followedIds = useMemo(() => new Set(listFollows().map((f) => f.targetId)), []);
  const savedIds = useMemo(() => new Set(listSaves().map((s) => s.contentId ?? s.targetId)), []);
  const [replayOnly, setReplayOnly] = useState(false);
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  const { quickFilters, activeFilterCount } = useSpotlightFloatingFilters({
    filters,
    setFilters,
    activeTab,
    replayOnly,
    upcomingOnly,
    onReplayToggle: () => setReplayOnly((v) => !v),
    onUpcomingToggle: () => setUpcomingOnly((v) => !v),
  });

  useEffect(() => {
    if (activeTab === 'featured' || activeTab === 'following' || activeTab === 'saved') return;
    const types = contentTypesForTab(activeTab);
    if (types.length) {
      setFilters({ ...filters, contentTypes: types, liveOnly: activeTab === 'live' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- tab preset
  }, [activeTab]);

  useEffect(() => {
    try {
      sessionStorage.removeItem(SPOTLIGHT_FEED_VISIBLE_KEY);
    } catch {
      /* filter change reset */
    }
  }, [filters, activeTab, replayOnly, upcomingOnly]);

  const priorityNowMs = usePriorityClockMs();

  const feedItems = useMemo(() => {
    let base = filterSpotlightFeedItems(allContent, filters, {
      activeTab,
      followedPublisherIds: followedIds,
      savedContentIds: savedIds,
    });
    if (replayOnly || upcomingOnly) {
      base = base.filter((item) => {
        if (replayOnly && item.live?.status !== 'replay' && item.live?.status !== 'ended') return false;
        if (upcomingOnly && item.live?.status !== 'upcoming') return false;
        return true;
      });
    }
    if (linkedProductId) {
      base = base.filter(
        (item) =>
          item.connections?.productIds?.some((id) => String(id) === linkedProductId) ||
          item.commerce?.featuredProductIds?.some((id) => String(id) === linkedProductId),
      );
    }
    if (linkedBrandId) {
      base = base.filter((item) => item.connections?.brandIds?.some((id) => String(id) === linkedBrandId));
    }
    // Shared priority: active LIVE → 24h grace → fresh 24h → standard fill
    return prioritizeSpotlightContent(base, priorityNowMs);
  }, [allContent, filters, activeTab, followedIds, savedIds, replayOnly, upcomingOnly, linkedProductId, linkedBrandId, priorityNowMs]);

  const hasActiveLive = useMemo(
    () => hasActiveLiveContent(feedItems, priorityNowMs) || hasActiveLiveContent(allContent, priorityNowMs),
    [feedItems, allContent, priorityNowMs],
  );

  const hasActiveFilters = useMemo(() => {
    if (activeFilterCount > 0) return true;
    if (filters.verifiedOnly) return true;
    if (filters.sort !== 'trending') return true;
    if (
      filters.brandIds.length ||
      filters.publisherIds.length ||
      filters.categoryIds.length ||
      filters.serviceIds.length ||
      filters.campaignIds.length ||
      filters.creatorIds.length
    ) {
      return true;
    }
    if (linkedProductId || linkedBrandId) return true;
    if (FORMAT_FILTER_TABS.has(activeTab)) return true;
    return false;
  }, [activeFilterCount, filters, linkedProductId, linkedBrandId, activeTab]);

  const clearAllFilters = () => {
    resetFilters();
    setReplayOnly(false);
    setUpcomingOnly(false);
    navigate('/spotlight');
  };

  return (
    <div id="spotlight-root" className="flex flex-col min-h-screen bg-choosify-feed">
      <main
        className={`${LISTING_PAGE_MAX_WIDTH} mx-auto px-5 sm:px-8 lg:px-10 pt-5 pb-[60px] w-full ${PAGE_LISTING_SINGLE_SHELL}`}
      >
        <div className={`${PAGE_MIDDLE_FEED} choosify-listing-single-feed`}>
          <ListingFeedHeader
            className="mb-6"
            eyebrow="Spotlight • Discover"
            title={
              activeTab === 'featured'
                ? 'Discover'
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
            }
            count={feedItems.length}
            itemLabel="posts"
          />

          {!hasContent ? (
            <div className="pt-10">
              <SpotlightEmptyState />
            </div>
          ) : (
            <DiscoverStructuredFeed
              items={feedItems}
              products={allCatalogProducts}
              impressionCallbacks={impressionCallbacks}
              quickFilters={quickFilters}
              filters={filters}
              setFilters={setFilters}
              activeTab={activeTab}
              onClearFilters={clearAllFilters}
              hasActiveFilters={hasActiveFilters}
              hasActiveLive={hasActiveLive}
            />
          )}

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#EB4501] hover:underline min-h-[44px]"
            >
              Back to Home
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
