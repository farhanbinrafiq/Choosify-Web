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
import { useOpenPageFilters } from '../../FilterEngine';
import { DiscoverLowerSections } from './DiscoverLowerSections';

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
  className?: string;
}

const DISCOVER_FORMAT_TABS: Array<{
  id: string;
  label: string;
  /** quickFilters id to click when available */
  filterId: string;
}> = [
  { id: 'all', label: 'All', filterId: 'all' },
  { id: 'guides', label: 'Buying Guides', filterId: 'guides' },
  { id: 'videos', label: 'Videos', filterId: 'videos' },
  { id: 'reviews', label: 'Creator Reviews', filterId: 'reviews' },
  { id: 'collections', label: 'Collections', filterId: 'collections' },
  { id: 'brands', label: 'Brand Stories', filterId: 'brands' },
  { id: 'campaigns', label: 'Campaigns', filterId: 'campaigns' },
  { id: 'blogs', label: 'Blogs', filterId: 'blogs' },
  { id: 'offers', label: 'Deals', filterId: 'offers' },
  { id: 'reels', label: 'Reels', filterId: 'reels' },
  { id: 'live', label: 'Live', filterId: 'live' },
];

const LANE_LIMITS = {
  youtube: 4,
  reels: 6,
  live: 2,
  blogs: 4,
} as const;

const DISCOVER_SORT_PILLS = [
  { id: 'filters', label: 'Filters' },
  { id: 'newest', label: 'Newest' },
  { id: 'trending', label: 'Trending' },
  { id: 'most_viewed', label: 'Most Viewed' },
  { id: 'most_helpful', label: 'Most Helpful' },
  { id: 'expert', label: 'Expert Picks' },
  { id: 'official', label: 'Official' },
  { id: 'verified', label: 'Verified' },
] as const;

type DiscoverSortPillId = (typeof DISCOVER_SORT_PILLS)[number]['id'];

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
        className="text-[12px] font-bold text-[#1A1A2E] hover:text-[#FF5B00] cursor-pointer bg-transparent border-0 p-0 min-h-[44px] sm:min-h-0"
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
}: {
  content: SpotlightContent;
  products: CatalogProduct[];
  onNavigate: (content: SpotlightContent) => void;
  className?: string;
  forceVariant?: 'landscape-video' | 'portrait-reel' | 'live' | 'guide' | 'blog';
}) {
  const product = primaryProductForContent(content, products);
  const model = spotlightToContentCardModel(content, product);
  const variant =
    forceVariant ?? resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio);

  return (
    <UniversalCommerceCard
      mode="commerce"
      variant={variant}
      model={model}
      onNavigate={() => onNavigate(content)}
      className={className}
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
  className,
}: DiscoverStructuredFeedProps) {
  const navigate = useNavigate();
  const { canOpenFilters, openFilters } = useOpenPageFilters();

  const filterById = useMemo(() => {
    const map = new Map(quickFilters.map((f) => [f.id, f]));
    return map;
  }, [quickFilters]);

  const activeFormatId = useMemo(() => {
    for (const tab of DISCOVER_FORMAT_TABS) {
      if (tab.id === 'all') continue;
      const qf = filterById.get(tab.filterId);
      if (qf?.active) return tab.id;
    }
    if (activeTab === 'featured' && !filters.contentTypes.length) return 'all';
    const byTab = DISCOVER_FORMAT_TABS.find((t) => t.id === activeTab);
    return byTab?.id ?? 'all';
  }, [filterById, activeTab, filters.contentTypes.length]);

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

  const onFormatNavigate = useCallback(
    (id: string) => {
      const tab = DISCOVER_FORMAT_TABS.find((t) => t.id === id);
      triggerFilter(tab?.filterId ?? id);
    },
    [triggerFilter],
  );

  const activeSortPill = useMemo((): DiscoverSortPillId => {
    if (filters.trendingOnly) return 'trending';
    if (filters.verifiedOnly) return 'verified';
    if (filters.publisherTypes.includes('brand')) return 'official';
    if (activeTab === 'recommendations') return 'expert';
    return 'newest';
  }, [filters.trendingOnly, filters.verifiedOnly, filters.publisherTypes, activeTab]);

  const onSortPill = useCallback(
    (id: DiscoverSortPillId) => {
      switch (id) {
        case 'filters':
          if (canOpenFilters) openFilters();
          break;
        case 'newest':
          setFilters({
            ...filters,
            trendingOnly: false,
            verifiedOnly: false,
            publisherTypes: [],
          });
          navigate('/spotlight?tab=featured');
          break;
        case 'trending':
        case 'most_viewed':
        case 'most_helpful': {
          const trending = filterById.get('trending');
          if (trending) trending.onClick();
          else setFilters({ ...filters, trendingOnly: !filters.trendingOnly });
          break;
        }
        case 'expert':
          navigate('/spotlight?tab=recommendations');
          break;
        case 'official': {
          const brands = filterById.get('brands');
          if (brands) brands.onClick();
          else {
            setFilters({
              ...filters,
              publisherTypes: filters.publisherTypes.includes('brand') ? [] : ['brand'],
            });
          }
          break;
        }
        case 'verified':
          setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly });
          break;
        default:
          break;
      }
    },
    [canOpenFilters, openFilters, setFilters, filters, navigate, filterById],
  );

  const onAiDiscover = useCallback(() => {
    navigate('/spotlight/search');
  }, [navigate]);

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

  const lanes = useMemo(() => partitionDiscoverFeedLanes(items), [items]);
  const youtube = lanes.youtube.slice(0, LANE_LIMITS.youtube);
  const reels = lanes.reels.slice(0, LANE_LIMITS.reels);
  const live = lanes.live.slice(0, LANE_LIMITS.live);
  const blogs = lanes.blogs.slice(0, LANE_LIMITS.blogs);

  const hasAnyLane =
    youtube.length > 0 || reels.length > 0 || live.length > 0 || blogs.length > 0;

  return (
    <div className={cn('w-full', className)}>
      {/* Format tabs — Choosify.dc.html sticky underline bar, overlaps hero */}
      <div className="choosify-sticky-section-nav sticky top-[104px] z-40 -mt-[16px] sm:-mt-[24px] md:-mt-[30px] mb-0 relative">
        <div className="flex items-end gap-6 bg-white border border-[#E8EDF2] rounded-[14px] h-[88px] px-[18px] sm:px-[26px] overflow-x-auto shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          {DISCOVER_FORMAT_TABS.map((tab) => {
            const active = tab.id === activeFormatId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFormatNavigate(tab.id)}
                className={cn(
                  'shrink-0 py-3.5 text-[12.5px] font-bold cursor-pointer whitespace-nowrap border-0 border-b-2 bg-transparent transition-colors',
                  active
                    ? 'text-[#FF5B00] border-[#FF5B00]'
                    : 'text-[#6B7280] border-transparent hover:text-[#1A1A2E]',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter pills + AI Discover */}
      <div className="flex justify-between items-center py-4 pb-6 flex-wrap gap-2.5">
        <div className="flex gap-2.5 flex-wrap">
          {DISCOVER_SORT_PILLS.map((pill) => {
            const active = pill.id === 'filters' ? false : activeSortPill === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onSortPill(pill.id)}
                className={cn(
                  'px-3.5 py-2 rounded-[18px] text-[11.5px] font-bold cursor-pointer border transition-colors min-h-[36px]',
                  active
                    ? 'bg-[#FF5B00] text-white border-[#FF5B00]'
                    : 'bg-white text-[#1A1A2E] border-[#E5E7EB] hover:border-[#FF5B00]/40',
                )}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onAiDiscover}
          className="bg-gradient-to-r from-[#FF5B00] to-[#2323FF] text-white text-[11.5px] font-bold px-4 py-2 rounded-[20px] cursor-pointer border-0 min-h-[36px] shrink-0"
        >
          ✦ AI Discover
        </button>
      </div>

      {items.length === 0 || !hasAnyLane ? (
        <div className="text-center py-16 border border-dashed border-[#e8edf2] rounded-lg bg-white">
          <p className="text-sm text-gray-500">No Discover content matches your filters.</p>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-4 text-xs font-bold uppercase text-[#FF5B00] hover:underline min-h-[44px] px-4 cursor-pointer bg-transparent border-0"
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
            {youtube.length > 0 && (
              <section className="mb-9" aria-label="YouTube Picks">
                <LaneHeader
                  icon="▶"
                  title="YouTube Picks"
                  onViewAll={() => triggerFilter('videos')}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {youtube.map((content) => (
                    <FeedCard
                      key={content.contentId}
                      content={content}
                      products={products}
                      onNavigate={onNavigateCard}
                      forceVariant="landscape-video"
                    />
                  ))}
                </div>
              </section>
            )}

            {reels.length > 0 && (
              <section className="mb-9" aria-label="Reels & Shorts">
                <LaneHeader
                  icon="⏵"
                  title="Reels & Shorts"
                  onViewAll={() => triggerFilter('reels')}
                />
                <div className="flex flex-wrap gap-3.5">
                  {reels.map((content) => (
                    <FeedCard
                      key={content.contentId}
                      content={content}
                      products={products}
                      onNavigate={onNavigateCard}
                      forceVariant="portrait-reel"
                      className="w-[150px]"
                    />
                  ))}
                </div>
              </section>
            )}

            {live.length > 0 && (
              <section aria-label="Live Now">
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
                className="text-[11px] font-bold text-[#1A1A2E] hover:text-[#FF5B00] cursor-pointer bg-transparent border-0 p-0 min-h-[44px] sm:min-h-0"
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
