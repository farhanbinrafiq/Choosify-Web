import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PAGE_LISTING_SINGLE_SHELL, PAGE_MIDDLE_FEED } from '../lib/pageLayout';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { HeroMarqueeTicker } from '../components/HeroMarqueeTicker';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';
import { useSpotlightHistory } from '../hooks/useSpotlightHistory';
import { SpotlightEmptyState } from '../components/spotlight/homepage/SpotlightEmptyState';
import { SpotlightMixedFeed } from '../components/spotlight/feed/SpotlightMixedFeed';
import { useGlobalState } from '../context/GlobalStateContext';
import { contentTypesForTab } from '../lib/spotlight/content/contentTypeRegistry';
import type { SpotlightContentTabId } from '../types/spotlight/discovery/navigation';
import { listFollows, listSaves } from '../utils/spotlightUserSignals';
import { useSpotlightFloatingFilters } from '../hooks/useSpotlightFloatingFilters';
import { filterSpotlightFeedItems, SPOTLIGHT_FEED_VISIBLE_KEY } from '../utils/spotlightMixedFeed';

export function SpotlightDiscoverPage() {
  const { allContent, filters, setFilters, hasContent } = useSpotlightExperience();
  const { allCatalogProducts, siteConfig } = useGlobalState();
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

  useSpotlightFloatingFilters({
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

  return (
    <div id="spotlight-root" className="flex flex-col min-h-screen bg-choosify-feed">
      <PageHeroBanner pageKey="guides" />
      <HeroMarqueeTicker pageKey="guides" siteConfig={siteConfig} />

      <main className={`max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-5 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        <div className={`${PAGE_MIDDLE_FEED} choosify-listing-single-feed`}>
          <header className="mb-6 text-left">
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Spotlight</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-2xl">
              Discover products and services through shoppable reels, videos, guides, and offers — one mixed shopping feed.
            </p>
          </header>

          {!hasContent ? (
            <SpotlightEmptyState />
          ) : feedItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#e8edf2] rounded-lg">
              <p className="text-sm text-gray-500">No Spotlight content matches your filters.</p>
              <button
                type="button"
                onClick={() => {
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
                }}
                className="mt-4 text-xs font-bold uppercase text-[#E8500A] hover:underline min-h-[44px] px-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <SpotlightMixedFeed
              items={feedItems}
              products={allCatalogProducts}
              impressionCallbacks={impressionCallbacks}
            />
          )}

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8500A] hover:underline min-h-[44px]"
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
