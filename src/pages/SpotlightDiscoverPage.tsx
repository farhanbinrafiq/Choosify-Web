import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PAGE_LISTING_SINGLE_SHELL, PAGE_MIDDLE_FEED } from '../lib/pageLayout';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';
import { useSpotlightHistory } from '../hooks/useSpotlightHistory';
import { SpotlightEmptyState } from '../components/spotlight/homepage/SpotlightEmptyState';
import { DiscoverHero } from '../components/spotlight/discovery/DiscoverHero';
import { DiscoverStructuredFeed } from '../components/spotlight/discovery/DiscoverStructuredFeed';
import { useGlobalState } from '../context/GlobalStateContext';
import { contentTypesForTab } from '../lib/spotlight/content/contentTypeRegistry';
import type { SpotlightContentTabId } from '../types/spotlight/discovery/navigation';
import { listFollows, listSaves } from '../utils/spotlightUserSignals';
import { useSpotlightFloatingFilters } from '../hooks/useSpotlightFloatingFilters';
import { filterSpotlightFeedItems, SPOTLIGHT_FEED_VISIBLE_KEY } from '../utils/spotlightMixedFeed';

export function SpotlightDiscoverPage() {
  const { allContent, filters, setFilters, hasContent } = useSpotlightExperience();
  const { allCatalogProducts } = useGlobalState();
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

  const { quickFilters } = useSpotlightFloatingFilters({
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
          item.connections.productIds.some((id) => String(id) === linkedProductId) ||
          item.commerce.featuredProductIds.some((id) => String(id) === linkedProductId),
      );
    }
    if (linkedBrandId) {
      base = base.filter((item) => item.connections.brandIds.some((id) => String(id) === linkedBrandId));
    }
    return base;
  }, [allContent, filters, activeTab, followedIds, savedIds, replayOnly, upcomingOnly, linkedProductId, linkedBrandId]);

  const clearAllFilters = () => {
    setFilters({
      ...filters,
      contentTypes: [],
      query: '',
      liveOnly: false,
      sponsoredOnly: false,
      verifiedOnly: false,
      trendingOnly: false,
      promotionsOnly: false,
      publisherTypes: [],
    });
    setReplayOnly(false);
    setUpcomingOnly(false);
  };

  return (
    <div id="spotlight-root" className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <DiscoverHero
        query={filters.query ?? ''}
        onQuerySubmit={(q) => setFilters({ ...filters, query: q })}
      />

      <main className={`max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 pb-[60px] w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        <div className={`${PAGE_MIDDLE_FEED} choosify-listing-single-feed`}>
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
            />
          )}

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5B00] hover:underline min-h-[44px]"
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
