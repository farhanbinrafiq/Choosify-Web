import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { getAllBrandPosts } from '../../lib/brandPosts';
import { resolveSpotlightExperience } from '../../utils/spotlightContentResolver';
import {
  adaptiveBrandPreviewCount,
  adaptiveProductPreviewCount,
  resolveCreatorReviewsPreview,
  type CreatorReviewsPreviewContext,
  type LegacyCreatorContentItem,
} from '../../utils/creatorReviewsPreview';
import type { SpotlightContent } from '../../types/spotlight/experience/content';
import {
  UniversalCommerceCard,
  spotlightToContentCardModel,
  legacyCreatorContentToPreviewModel,
} from '../content';
import { primaryProductForContent } from '../../utils/spotlightMixedFeed';
import { usePriorityClockMs } from '../../hooks/usePriorityClockMs';
import { cn } from '../../lib/utils';
import type { CatalogProduct } from '../../types/catalog';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

export interface CreatorReviewsPreviewProps {
  context: CreatorReviewsPreviewContext;
  productId?: string;
  brandId?: string;
  brandName?: string;
  productTitle?: string;
  featuredContentId?: string;
  legacyCreatorContent?: LegacyCreatorContentItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

function isTallCreatorItem(content: SpotlightContent): boolean {
  const ratio = content.media?.aspectRatio;
  if (ratio === '9:16' || ratio === '4:5') return true;
  const badge = content.badges.join(' ').toLowerCase();
  if (badge.includes('reel') || badge.includes('short')) return true;
  return false;
}

function isLegacyTall(item: LegacyCreatorContentItem): boolean {
  const platformKey = item.platform.toLowerCase();
  return platformKey.includes('insta') || platformKey.includes('tiktok');
}

/** Same YouTube / Reels cards used on Discover & Brand Story — no custom tile. */
function ReviewCard({
  content,
  products,
  forceVariant,
  nowMs,
  onNavigate,
}: {
  content: SpotlightContent;
  products: CatalogProduct[];
  forceVariant: 'landscape-video' | 'portrait-reel';
  nowMs: number;
  onNavigate: () => void;
}) {
  const product = primaryProductForContent(content, products);
  const model = spotlightToContentCardModel(content, product, nowMs);

  return (
    <UniversalCommerceCard
      mode="commerce"
      variant={forceVariant}
      model={model}
      onNavigate={onNavigate}
      className="w-full"
    />
  );
}

export function CreatorReviewsPreview({
  context,
  productId,
  brandId,
  brandName,
  productTitle,
  featuredContentId,
  legacyCreatorContent,
  eyebrow,
  title,
  subtitle,
  className,
}: CreatorReviewsPreviewProps) {
  const navigate = useNavigate();
  const nowMs = usePriorityClockMs();
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();

  const allContent = useMemo(
    () =>
      resolveSpotlightExperience({
        catalog: allCatalogProducts,
        guides: allCatalogGuides,
        creators: allCreators,
        brandPosts: getAllBrandPosts(),
        brandLogos: BRAND_LOGOS,
      }),
    [allCatalogProducts, allCatalogGuides, allCreators],
  );

  const preview = useMemo(
    () =>
      resolveCreatorReviewsPreview(allContent, {
        context,
        productId,
        brandId,
        brandName,
        featuredContentId,
        legacyCreatorContent,
      }),
    [
      allContent,
      context,
      productId,
      brandId,
      brandName,
      featuredContentId,
      legacyCreatorContent,
    ],
  );

  const legacyFallback = useMemo(() => {
    if (preview.totalCount > 0 || !legacyCreatorContent?.length) return [];
    const cap =
      context === 'product'
        ? adaptiveProductPreviewCount(legacyCreatorContent.length)
        : adaptiveBrandPreviewCount(legacyCreatorContent.length);
    return legacyCreatorContent.slice(0, cap);
  }, [preview.totalCount, legacyCreatorContent, context]);

  const showLegacyOnly = preview.totalCount === 0 && legacyFallback.length > 0;
  const showViewAll =
    preview.showViewAll ||
    (showLegacyOnly && (legacyCreatorContent?.length ?? 0) > legacyFallback.length);

  const resolvedTitle =
    title ?? (context === 'brand' ? 'CREATORS REVIEW' : 'CREATOR REVIEWS');
  const resolvedSubtitle =
    subtitle ?? 'Video reviews from YouTube, Instagram & Facebook creators';

  const wideItems = preview.items.filter((c) => !isTallCreatorItem(c));
  const tallItems = preview.items.filter((c) => isTallCreatorItem(c));
  const legacyWide = legacyFallback.filter((i) => !isLegacyTall(i));
  const legacyTall = legacyFallback.filter((i) => isLegacyTall(i));

  if (preview.totalCount === 0 && !legacyCreatorContent?.length) {
    return (
      <section
        id="influencer-reviews-section"
        className={cn(
          'w-full rounded-xl border border-dashed border-[#E8EDF2] bg-white p-6 text-center',
          className,
        )}
      >
        <p className="text-sm font-semibold text-[#9AA0AC]">Creator reviews coming soon</p>
        <Link
          to={preview.viewAllHref}
          className="mt-3 inline-block text-[11.5px] font-extrabold text-[#EB4501] hover:underline"
        >
          Browse Spotlight Reviews →
        </Link>
      </section>
    );
  }

  const youtubeSource = showLegacyOnly ? legacyWide : wideItems;
  const reelsSource = showLegacyOnly ? legacyTall : tallItems;

  return (
    <section
      id="influencer-reviews-section"
      className={cn('w-full rounded-xl border border-[#E8EDF2] bg-white p-4 sm:p-5', className)}
      aria-labelledby="creator-reviews-preview-heading"
    >
      <header className="mb-3.5 text-left">
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#9AA0AC] mb-1">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2
            id="creator-reviews-preview-heading"
            className="text-[14px] sm:text-[15px] font-extrabold text-[#1A1A2E] tracking-tight m-0"
          >
            {resolvedTitle}
          </h2>
          {showViewAll && (
            <Link
              to={preview.viewAllHref}
              className="text-[12px] font-bold text-[#1A1A2E] hover:text-[#CF4400] shrink-0"
            >
              VIEW ALL ›
            </Link>
          )}
        </div>
        <p className="text-[11px] sm:text-[11.5px] text-[#9AA0AC] mt-0.5 m-0">{resolvedSubtitle}</p>
        {productTitle && context === 'product' ? (
          <p className="sr-only">Reviews for {productTitle}</p>
        ) : null}
      </header>

      {/* Same YouTube card size as Discover / Brand Story — flex-wrap (not grid) so a
          partial row keeps each card at its normal size instead of stretching to fill. */}
      {youtubeSource.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4 last:mb-0">
          {showLegacyOnly
            ? youtubeSource.map((item) => {
                const legacy = item as LegacyCreatorContentItem;
                const model = legacyCreatorContentToPreviewModel(legacy, {
                  brandName,
                  productId,
                });
                return (
                  <div
                    key={legacy.id}
                    className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)] shrink-0 grow-0"
                  >
                    <UniversalCommerceCard
                      mode="commerce"
                      variant="landscape-video"
                      model={model}
                      onNavigate={() => {
                        if (legacy.videoUrl) window.open(legacy.videoUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full"
                    />
                  </div>
                );
              })
            : (youtubeSource as SpotlightContent[]).map((content) => (
                <div
                  key={content.contentId}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)] shrink-0 grow-0"
                >
                  <ReviewCard
                    content={content}
                    products={allCatalogProducts}
                    forceVariant="landscape-video"
                    nowMs={nowMs}
                    onNavigate={() => navigate(content.href)}
                  />
                </div>
              ))}
        </div>
      )}

      {/* Same Reels card size as Discover / Brand Story — flex-wrap so a partial row
          doesn't stretch cards taller/wider than the standard reel tile. */}
      {reelsSource.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {showLegacyOnly
            ? (reelsSource as LegacyCreatorContentItem[]).map((legacy) => {
                const model = legacyCreatorContentToPreviewModel(legacy, {
                  brandName,
                  productId,
                });
                return (
                  <div
                    key={legacy.id}
                    className="w-[calc(50%-0.375rem)] min-[480px]:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.5625rem)] xl:w-[calc(20%-0.6rem)] shrink-0 grow-0"
                  >
                    <UniversalCommerceCard
                      mode="commerce"
                      variant="portrait-reel"
                      model={model}
                      onNavigate={() => {
                        if (legacy.videoUrl) window.open(legacy.videoUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full"
                    />
                  </div>
                );
              })
            : (reelsSource as SpotlightContent[]).map((content) => (
                <div
                  key={content.contentId}
                  className="w-[calc(50%-0.375rem)] min-[480px]:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.5625rem)] xl:w-[calc(20%-0.6rem)] shrink-0 grow-0"
                >
                  <ReviewCard
                    content={content}
                    products={allCatalogProducts}
                    forceVariant="portrait-reel"
                    nowMs={nowMs}
                    onNavigate={() => navigate(content.href)}
                  />
                </div>
              ))}
        </div>
      )}
    </section>
  );
}
