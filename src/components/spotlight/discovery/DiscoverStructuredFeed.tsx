import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { CatalogProduct } from '../../../types/catalog';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import type { SpotlightDiscoverFilters } from '../../../types/spotlight/experience/filters';
import type { SpotlightContentTabId } from '../../../types/spotlight/discovery/navigation';
import {
  partitionDiscoverFeedLanes,
  primaryProductForContent,
  SPOTLIGHT_FEED_SCROLL_KEY,
} from '../../../utils/spotlightMixedFeed';
import {
  UniversalCommerceCard,
  spotlightToContentCardModel,
  resolveCommerceCardVariant,
} from '../../content';
import { DiscoverLowerSections } from './DiscoverLowerSections';
import { usePriorityClockMs } from '../../../hooks/usePriorityClockMs';
import { ListingFilterPills, type ListingFilterPillItem } from '../../design/ListingFilterPills';
import { DISCOVER_FORMAT_TABS } from './DiscoverStickyFormatNav';

export interface DiscoverQuickFilter {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface DiscoverStructuredFeedProps {
  items: SpotlightContent[];
  products: CatalogProduct[];
  impressionCallbacks?: SpotlightImpressionCallbacks;
  quickFilters: DiscoverQuickFilter[];
  filters: SpotlightDiscoverFilters;
  setFilters: (next: SpotlightDiscoverFilters) => void;
  activeTab: SpotlightContentTabId;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  /** When true, prepend a red LIVE filter pill (currently-active streams only) */
  hasActiveLive?: boolean;
  className?: string;
}

const LANE_LIMITS = {
  youtube: 4,
  reels: 6,
  live: 2,
  blogs: 4,
} as const;

function LaneHeader({
  icon,
  iconClassName,
  title,
  onViewAll,
}: {
  icon: string;
  iconClassName?: string;
  title: string;
  onViewAll: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-3.5">
      <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#1A1A2E]">
        <span className={cn('text-[14px]', iconClassName ?? 'text-[#FF000D]')}>{icon}</span>
        {title}
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="text-[12px] font-bold text-[#1A1A2E] hover:text-[#CF4400] cursor-pointer bg-transparent border-0 p-0 min-h-[44px] sm:min-h-0"
      >
        View All ›
      </button>
    </div>
  );
}

function FeedCard({
  content,
  products,
  onNavigate,
  className,
  forceVariant,
  compactMedia,
  nowMs,
}: {
  content: SpotlightContent;
  products: CatalogProduct[];
  onNavigate: (content: SpotlightContent) => void;
  className?: string;
  forceVariant?: 'landscape-video' | 'portrait-reel' | 'live' | 'guide' | 'blog';
  compactMedia?: boolean;
  nowMs?: number;
}) {
  const product = primaryProductForContent(content, products);
  const model = spotlightToContentCardModel(content, product, nowMs);
  const variant =
    forceVariant ?? resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio);

  return (
    <UniversalCommerceCard
      mode="commerce"
      variant={variant}
      model={model}
      onNavigate={() => onNavigate(content)}
      className={className}
      compactMedia={compactMedia}
    />
  );
}

export function DiscoverStructuredFeed({
  items,
  products,
  impressionCallbacks,
  quickFilters,
  filters,
  setFilters,
  activeTab,
  onClearFilters,
  hasActiveFilters = false,
  hasActiveLive = false,
  className,
}: DiscoverStructuredFeedProps) {
  const navigate = useNavigate();
  const nowMs = usePriorityClockMs();

  const filterById = useMemo(() => {
    const map = new Map(quickFilters.map((f) => [f.id, f]));
    return map;
  }, [quickFilters]);

  const triggerFilter = useCallback(
    (filterId: string) => {
      const qf = filterById.get(filterId);
      if (qf) {
        qf.onClick();
        return;
      }
      navigate(`/spotlight?tab=${filterId === 'all' ? 'featured' : filterId}`);
    },
    [filterById, navigate],
  );

  const activeFormatId = useMemo(() => {
    for (const tab of DISCOVER_FORMAT_TABS) {
      if (tab.id === 'all') continue;
      if (filterById.get(tab.filterId)?.active) return tab.id;
    }
    if (activeTab === 'featured' && !filters.contentTypes.length) return 'all';
    return DISCOVER_FORMAT_TABS.find((t) => t.id === activeTab)?.id ?? 'all';
  }, [filterById, activeTab, filters.contentTypes.length]);

  const headerPills = useMemo((): ListingFilterPillItem[] => {
    return DISCOVER_FORMAT_TABS.map((tab) => ({
      id: `browse-${tab.id}`,
      label: tab.label,
      active: tab.id === activeFormatId,
      variant: tab.id === 'live' ? 'live' : 'default',
      onClick: () => triggerFilter(tab.filterId),
    }));
  }, [activeFormatId, triggerFilter]);

  const onNavigateCard = useCallback(
    (content: SpotlightContent) => {
      try {
        sessionStorage.setItem(SPOTLIGHT_FEED_SCROLL_KEY, String(window.scrollY));
      } catch {
        /* ignore */
      }
      impressionCallbacks?.onClicked?.(content.sourceId);
    },
    [impressionCallbacks],
  );

  const lanes = useMemo(() => partitionDiscoverFeedLanes(items, nowMs), [items, nowMs]);
  const youtube = lanes.youtube.slice(0, LANE_LIMITS.youtube);
  const reels = lanes.reels.slice(0, LANE_LIMITS.reels);
  // Featured LIVE only (active + 24h grace) — already filtered by partition
  const live = lanes.live.slice(0, LANE_LIMITS.live);
  const blogs = lanes.blogs.slice(0, LANE_LIMITS.blogs);

  const hasAnyLane =
    youtube.length > 0 || reels.length > 0 || live.length > 0 || blogs.length > 0;

  return (
    <div className={cn('w-full', className)}>
      <ListingFilterPills
        pills={headerPills}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        aiDiscoverPrompt="Help me discover products, guides, and deals on Choosify"
      />

      {items.length === 0 || !hasAnyLane ? (
        <div className="text-center py-16 border border-dashed border-[#e8edf2] rounded-lg bg-white">
          <p className="text-sm text-gray-500">No Discover content matches your filters.</p>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-4 text-xs font-bold uppercase text-[#EB4501] hover:underline min-h-[44px] px-4 cursor-pointer bg-transparent border-0"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          id="spotlight-feed"
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] gap-6 mb-11"
        >
          <div className="min-w-0">
            {live.length > 0 && (
              <section
                className="mb-9 bg-white border border-[#E8EDF2] rounded-[10px] p-4"
                aria-label="Live Now"
              >
                <LaneHeader
                  icon="◉"
                  title="Live Now"
                  onViewAll={() => triggerFilter('live')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {live.map((content) => (
                    <FeedCard
                      key={content.contentId}
                      content={content}
                      products={products}
                      onNavigate={onNavigateCard}
                      forceVariant="live"
                      nowMs={nowMs}
                    />
                  ))}
                </div>
              </section>
            )}

            {youtube.length > 0 && (
              <section
                className="mb-9 bg-white border border-[#E8EDF2] rounded-[10px] p-4"
                aria-label="YouTube Picks"
              >
                <LaneHeader
                  icon="▶"
                  title="YouTube Picks"
                  onViewAll={() => triggerFilter('videos')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {youtube.map((content) => (
                    <FeedCard
                      key={content.contentId}
                      content={content}
                      products={products}
                      onNavigate={onNavigateCard}
                      forceVariant="landscape-video"
                      nowMs={nowMs}
                    />
                  ))}
                </div>
              </section>
            )}

            {reels.length > 0 && (
              <section
                className="mb-9 bg-white border border-[#E8EDF2] rounded-[10px] p-4"
                aria-label="Reels & Shorts"
              >
                <LaneHeader
                  icon="⏵"
                  title="Reels & Shorts"
                  onViewAll={() => triggerFilter('reels')}
                />
                <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
                  {reels.map((content) => (
                    <FeedCard
                      key={content.contentId}
                      content={content}
                      products={products}
                      onNavigate={onNavigateCard}
                      forceVariant="portrait-reel"
                      className="w-full"
                      nowMs={nowMs}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 self-start">
            <div className="flex justify-between items-center mb-3.5">
              <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#1A1A2E]">
                <span className="text-[#07DD05]">▤</span> Blog Stories
              </div>
              <button
                type="button"
                onClick={() => triggerFilter('blogs')}
                className="text-[11px] font-bold text-[#1A1A2E] hover:text-[#CF4400] cursor-pointer bg-transparent border-0 p-0 min-h-[44px] sm:min-h-0"
              >
                View All ›
              </button>
            </div>
            {blogs.length === 0 ? (
              <p className="text-[12px] text-[#9AA0AC] py-6 text-center">No blog stories yet.</p>
            ) : (
              blogs.map((content, index) => (
                <div
                  key={content.contentId}
                  className={cn(
                    index < blogs.length - 1 && 'border-b border-[#F1F1F3] pb-3.5 mb-3.5',
                  )}
                >
                  <FeedCard
                    content={content}
                    products={products}
                    onNavigate={onNavigateCard}
                    forceVariant="guide"
                    compactMedia
                    nowMs={nowMs}
                    className="!bg-transparent !border-0 !rounded-none !overflow-visible"
                  />
                </div>
              ))
            )}
          </aside>
        </div>
      )}

      {/* Choosify.dc.html — guides / expert / creators / community / trust */}
      <DiscoverLowerSections />
    </div>
  );
}
