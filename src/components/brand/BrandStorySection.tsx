import React, { useMemo } from 'react';
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
  return Boolean(
    content.badges?.some((b) => /pin|feature|sponsor/i.test(b)),
  );
}

/**
 * Brand Details — "Brand Story" mixed content feed (Discover-style cards, all inline).
 * Ranking: shared LIVE → pinned/featured → newest → engagement resurfacing.
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

  // Lane-style layout: live / landscape / reel / blog mixed in a responsive grid
  const live = items.filter((c) => resolveFeedCardVariant(c) === 'live');
  const rest = items.filter((c) => resolveFeedCardVariant(c) !== 'live');

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
        {live.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">
              <span className="text-[#FF000D]">◉</span> Live Now
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {live.map((content) => (
                <StoryCard
                  key={content.contentId}
                  content={content}
                  products={allCatalogProducts}
                  forceVariant="live"
                  onNavigate={() => navigate(content.href)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rest.map((content) => {
            const variant = resolveFeedCardVariant(content);
            const force =
              variant === 'reel'
                ? ('portrait-reel' as const)
                : variant === 'blog'
                  ? ('blog' as const)
                  : ('landscape-video' as const);
            return (
              <StoryCard
                key={content.contentId}
                content={content}
                products={allCatalogProducts}
                forceVariant={force}
                onNavigate={() => navigate(content.href)}
                compactMedia={variant === 'blog'}
              />
            );
          })}
        </div>
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
}: {
  content: SpotlightContent;
  products: Parameters<typeof primaryProductForContent>[1];
  forceVariant?: 'landscape-video' | 'portrait-reel' | 'live' | 'guide' | 'blog';
  onNavigate: () => void;
  compactMedia?: boolean;
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
      onNavigate={onNavigate}
      compactMedia={compactMedia}
      className="w-full"
    />
  );
}
