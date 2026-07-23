import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { getAllBrandPosts } from '../../lib/brandPosts';
import { resolveSpotlightExperience } from '../../utils/spotlightContentResolver';
import {
  resolveLiveStatus,
  spotlightContentToPriorityInput,
} from '../../utils/contentPriority';
import { usePriorityClockMs } from '../../hooks/usePriorityClockMs';
import { rankCreatorContent } from '../../utils/listingRanking';
import {
  UniversalCommerceCard,
  spotlightToContentCardModel,
  resolveCommerceCardVariant,
} from '../content';
import { primaryProductForContent } from '../../utils/spotlightMixedFeed';
import { resolveFeedCardVariant } from '../../utils/spotlightMixedFeed';
import type { SpotlightContent } from '../../types/spotlight/experience/content';
import { cn } from '../../lib/utils';

const BRAND_LOGOS: Record<string, string> = {};

type StoryRowKind = 'live' | 'youtube' | 'reels' | 'blogs';

/**
 * Progressive reveal by visual grid rows (not type-section count).
 * First paint: 2 visual rows → Browse More adds 3 more until the feed ends.
 */
const INITIAL_VISUAL_ROWS = 2;
const BROWSE_MORE_VISUAL_ROWS = 3;

/** Cards that fill one visual row for each type’s grid. */
const CARDS_PER_VISUAL_ROW: Record<StoryRowKind, number> = {
  live: 2, // sm:grid-cols-2
  youtube: 4, // xl:grid-cols-4
  reels: 5, // xl:grid-cols-5
  blogs: 3, // lg:grid-cols-3
};

type StoryRow = {
  kind: StoryRowKind;
  title: string;
  icon: string;
  iconClassName?: string;
  items: SpotlightContent[];
  forceVariant: 'live' | 'landscape-video' | 'portrait-reel' | 'blog';
  gridClassName: string;
  compactMedia?: boolean;
};

function belongsToBrand(
  content: SpotlightContent,
  brandId: string | number,
  brandName: string,
  brandProductIds: Set<string>,
): boolean {
  const idStr = String(brandId);
  const idNum = String(Number(brandId));
  const name = brandName.trim().toLowerCase();
  if (content.connections.brandIds.some((id) => String(id) === idStr || String(id) === idNum)) {
    return true;
  }
  if (content.publisher?.name?.trim().toLowerCase() === name) return true;
  if (content.connections.productIds.some((pid) => brandProductIds.has(String(pid)))) {
    return true;
  }
  return false;
}

function isPinnedOrFeatured(content: SpotlightContent): boolean {
  if (content.isSponsored) return true;
  return Boolean(content.badges?.some((b) => /pin|feature|sponsor/i.test(b)));
}

/** How many visual rows the given card counts occupy for a type. */
function visualRowsForCardCount(kind: StoryRowKind, cardCount: number): number {
  if (cardCount <= 0) return 0;
  return Math.ceil(cardCount / CARDS_PER_VISUAL_ROW[kind]);
}

/**
 * Walk type rows in order and take enough cards to fill `visualRowBudget` grid rows.
 * Returns per-kind visible card counts.
 */
function takeCardsForVisualRows(
  rows: StoryRow[],
  visualRowBudget: number,
): Map<StoryRowKind, number> {
  const limits = new Map<StoryRowKind, number>();
  let budget = visualRowBudget;

  for (const row of rows) {
    if (budget <= 0) {
      limits.set(row.kind, 0);
      continue;
    }
    const perRow = CARDS_PER_VISUAL_ROW[row.kind];
    const maxCards = row.items.length;
    const rowsAffordable = Math.min(budget, Math.ceil(maxCards / perRow) || 0);
    const cards = Math.min(maxCards, rowsAffordable * perRow);
    limits.set(row.kind, cards);
    budget -= visualRowsForCardCount(row.kind, cards);
  }

  return limits;
}

function totalVisualRows(rows: StoryRow[]): number {
  return rows.reduce(
    (sum, row) => sum + visualRowsForCardCount(row.kind, row.items.length),
    0,
  );
}

/**
 * Brand Details — "Brand Story" grouped by type into rows with progressive reveal.
 * LIVE keeps featured size during active + 24h grace; then shrinks to YouTube row.
 */
export function BrandStorySection({
  brandId,
  brandName,
  className,
}: {
  brandId: string | number;
  brandName: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();
  const nowMs = usePriorityClockMs();
  const [visibleVisualRows, setVisibleVisualRows] = useState(INITIAL_VISUAL_ROWS);

  const items = useMemo(() => {
    const brandPosts = getAllBrandPosts();
    const all = resolveSpotlightExperience({
      catalog: allCatalogProducts,
      guides: allCatalogGuides ?? [],
      creators: allCreators ?? [],
      brandPosts,
      brandLogos: BRAND_LOGOS,
    });

    const brandProductIds = new Set(
      allCatalogProducts
        .filter(
          (p) =>
            String(p.brandId) === String(brandId) ||
            String(p.brandId) === String(Number(brandId)) ||
            (p.brandName || '').toLowerCase() === brandName.toLowerCase(),
        )
        .map((p) => String(p.id)),
    );

    const filtered = all.filter((c) =>
      belongsToBrand(c, brandId, brandName, brandProductIds),
    );

    return rankCreatorContent(
      filtered.map((c) => ({
        ...c,
        id: c.contentId,
        isLive: resolveLiveStatus(spotlightContentToPriorityInput(c), nowMs) === 'live',
        pinned: isPinnedOrFeatured(c),
        publishedAt: c.publishedAt,
        views: c.popularityScore ?? 0,
        likes: 0,
      })),
      nowMs,
    );
  }, [allCatalogProducts, allCatalogGuides, allCreators, brandId, brandName, nowMs]);

  const rows = useMemo((): StoryRow[] => {
    const live: SpotlightContent[] = [];
    const youtube: SpotlightContent[] = [];
    const reels: SpotlightContent[] = [];
    const blogs: SpotlightContent[] = [];

    for (const content of items) {
      const variant = resolveFeedCardVariant(content, nowMs);
      if (variant === 'live') live.push(content);
      else if (variant === 'reel') reels.push(content);
      else if (variant === 'blog') blogs.push(content);
      else youtube.push(content); // landscape / square / previously LIVE
    }

    const next: StoryRow[] = [];
    if (live.length) {
      next.push({
        kind: 'live',
        title: 'Live Now',
        icon: '◉',
        items: live,
        forceVariant: 'live',
        gridClassName: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
      });
    }
    if (youtube.length) {
      next.push({
        kind: 'youtube',
        title: 'YouTube',
        icon: '▶',
        items: youtube,
        forceVariant: 'landscape-video',
        gridClassName: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
      });
    }
    if (reels.length) {
      next.push({
        kind: 'reels',
        title: 'Reels',
        icon: '⏵',
        items: reels,
        forceVariant: 'portrait-reel',
        gridClassName:
          'grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5',
      });
    }
    if (blogs.length) {
      next.push({
        kind: 'blogs',
        title: 'Blogs',
        icon: '▤',
        iconClassName: 'text-[#07DD05]',
        items: blogs,
        forceVariant: 'blog',
        gridClassName: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
        compactMedia: true,
      });
    }
    return next;
  }, [items, nowMs]);

  const feedVisualRows = useMemo(() => totalVisualRows(rows), [rows]);
  const cardLimits = useMemo(
    () => takeCardsForVisualRows(rows, visibleVisualRows),
    [rows, visibleVisualRows],
  );

  const visibleRows = useMemo(
    () =>
      rows
        .map((row) => ({
          ...row,
          items: row.items.slice(0, cardLimits.get(row.kind) ?? 0),
        }))
        .filter((row) => row.items.length > 0),
    [rows, cardLimits],
  );

  const hasMore = visibleVisualRows < feedVisualRows;

  if (!items.length) {
    return (
      <section
        id="brand-story-section"
        className={cn('scroll-mt-36 w-full', className)}
        aria-labelledby="brand-story-heading"
      >
        <h3
          id="brand-story-heading"
          className="text-[15px] font-extrabold text-[#1A1A2E] mb-3.5"
        >
          Brand Story
        </h3>
        <div className="bg-white border border-dashed border-[#E8EDF2] rounded-[10px] py-12 text-center text-[13px] text-[#9AA0AC] font-semibold">
          No brand stories, videos, or guides published yet.
        </div>
      </section>
    );
  }

  return (
    <section
      id="brand-story-section"
      className={cn('scroll-mt-36 w-full', className)}
      aria-labelledby="brand-story-heading"
    >
      <div className="flex items-baseline justify-between gap-3 mb-3.5">
        <h3
          id="brand-story-heading"
          className="text-[15px] font-extrabold text-[#1A1A2E] m-0"
        >
          Brand Story
        </h3>
        <span className="text-[12px] font-bold text-[#9AA0AC]">{items.length} stories</span>
      </div>
      <p className="text-[12px] text-[#9AA0AC] m-0 mb-4">
        Guides, videos, reviews, live sessions, and updates from {brandName}.
      </p>

      <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 sm:p-5 space-y-8">
        {visibleRows.map((row) => (
          <div key={row.kind}>
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">
              <span className={cn('text-[#FF000D]', row.iconClassName)}>{row.icon}</span>
              {row.title}
            </div>
            <div className={row.gridClassName}>
              {row.items.map((content) => (
                <StoryCard
                  key={content.contentId}
                  content={content}
                  products={allCatalogProducts}
                  forceVariant={row.forceVariant}
                  nowMs={nowMs}
                  onNavigate={() => navigate(content.href)}
                  compactMedia={row.compactMedia}
                />
              ))}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() =>
                setVisibleVisualRows((n) =>
                  Math.min(n + BROWSE_MORE_VISUAL_ROWS, feedVisualRows),
                )
              }
              className="text-[12.5px] font-bold text-[#EB4501] hover:text-[#CF4400] bg-transparent border border-[#E8EDF2] hover:border-[#EB4501]/40 rounded-lg px-5 py-2.5 cursor-pointer transition-colors min-h-[44px]"
            >
              Browse More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StoryCard({
  content,
  products,
  forceVariant,
  onNavigate,
  compactMedia,
  nowMs,
}: {
  content: SpotlightContent;
  products: Parameters<typeof primaryProductForContent>[1];
  forceVariant?: 'landscape-video' | 'portrait-reel' | 'live' | 'guide' | 'blog';
  onNavigate: () => void;
  compactMedia?: boolean;
  nowMs: number;
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
      onNavigate={onNavigate}
      compactMedia={compactMedia}
      className="w-full"
    />
  );
}
