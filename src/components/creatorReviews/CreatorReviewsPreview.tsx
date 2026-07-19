import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
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
import { resolvePosterImage, resolvePreviewImage } from '../media/types/mediaModel';
import { cn } from '../../lib/utils';

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

function creatorBadge(content: SpotlightContent): { label: string; bg: string } {
  if (content.isLive || content.contentType === 'live') return { label: 'LIVE', bg: '#FF000D' };
  if (isTallCreatorItem(content)) return { label: 'REELS', bg: '#E1306C' };
  if (content.contentType === 'creator_review' || content.contentType === 'product_review') {
    return { label: 'YOUTUBE', bg: '#FF000D' };
  }
  return { label: 'CREATOR', bg: '#EB4501' };
}

function CreatorReviewTile({
  content,
  tall,
}: {
  content: SpotlightContent;
  tall?: boolean;
}) {
  const badge = creatorBadge(content);
  const showPlay = Boolean(
    content.media?.videoUrl ||
      content.isLive ||
      content.contentType === 'live' ||
      content.contentType === 'livestream_replay',
  );
  const thumb = content.media
    ? resolvePosterImage(content.media) || resolvePreviewImage(content.media) || content.media.thumbnail
    : '';
  const creatorName = content.publisher?.name || 'Creator';
  const meta = content.popularityScore
    ? `${Math.round(content.popularityScore).toLocaleString()} score`
    : undefined;

  return (
    <Link to={content.href} className={cn('block min-w-0 group', tall && 'flex-[0_0_190px]')}>
      <div
        className={cn(
          'relative rounded-[10px] overflow-hidden mb-2 bg-[#F4F7F9]',
          tall ? 'h-[260px]' : 'h-[170px]',
        )}
      >
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        ) : null}
        <div
          className="absolute top-2 left-2 text-white text-[7.5px] font-extrabold px-1.5 py-0.5 rounded pointer-events-none"
          style={{ background: badge.bg }}
        >
          {badge.label}
        </div>
        {showPlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-black/40 border-[1.5px] border-white/90 flex items-center justify-center">
              <div
                className="border-solid border-transparent border-l-white ml-px"
                style={{ width: 0, height: 0, borderWidth: '5px 0 5px 8px' }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="text-[11px] font-bold text-[#1A1A2E] leading-snug mb-1 line-clamp-2">
        {content.headline || 'Creator review'}
      </div>
      <div className="text-[10px] text-[#4B5563] truncate">{creatorName}</div>
      {meta ? <div className="text-[9.5px] text-[#9AA0AC] truncate">{meta}</div> : null}
    </Link>
  );
}

function LegacyCreatorTile({
  item,
  tall,
}: {
  item: LegacyCreatorContentItem;
  tall?: boolean;
}) {
  const portrait = tall ?? isLegacyTall(item);
  const badge = portrait
    ? { label: 'REELS', bg: '#E1306C' }
    : { label: 'YOUTUBE', bg: '#FF000D' };

  return (
    <a
      href={item.videoUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('block min-w-0 group', portrait && 'flex-[0_0_190px]')}
    >
      <div
        className={cn(
          'relative rounded-[10px] overflow-hidden mb-2 bg-[#F4F7F9]',
          portrait ? 'h-[260px]' : 'h-[170px]',
        )}
      >
        {item.thumbnail ? (
          <img src={item.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : null}
        <div
          className="absolute top-2 left-2 text-white text-[7.5px] font-extrabold px-1.5 py-0.5 rounded pointer-events-none"
          style={{ background: badge.bg }}
        >
          {badge.label}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-black/40 border-[1.5px] border-white/90 flex items-center justify-center">
            <div
              className="border-solid border-transparent border-l-white ml-px"
              style={{ width: 0, height: 0, borderWidth: '5px 0 5px 8px' }}
            />
          </div>
        </div>
      </div>
      <div className="text-[11px] font-bold text-[#1A1A2E] leading-snug mb-1 line-clamp-2">
        {item.title || 'Creator review'}
      </div>
      <div className="text-[10px] text-[#4B5563] truncate">
        {item.creatorHandle?.replace('@', '') || 'Creator'}
      </div>
      {item.views ? (
        <div className="text-[9.5px] text-[#9AA0AC] truncate">{item.views} views</div>
      ) : null}
    </a>
  );
}

/** Compact Creator Reviews section — Choosify.dc.html wide + tall rows */
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

  const wideSource = showLegacyOnly
    ? legacyWide.length
      ? legacyWide
      : legacyFallback
    : wideItems;
  const tallSource = showLegacyOnly ? legacyTall : tallItems;
  const wideCols = Math.min(Math.max(wideSource.length, 1), 3);

  return (
    <section
      id="influencer-reviews-section"
      className={cn('w-full rounded-xl border border-[#E8EDF2] bg-white p-6', className)}
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

      {wideSource.length > 0 && (
        <div
          className="grid gap-3.5 mb-4"
          style={{ gridTemplateColumns: `repeat(${wideCols}, minmax(0, 1fr))` }}
        >
          {showLegacyOnly
            ? (legacyWide.length ? legacyWide : legacyFallback).map((item) => (
                <LegacyCreatorTile key={item.id} item={item} />
              ))
            : wideItems.map((content) => (
                <CreatorReviewTile key={content.contentId} content={content} />
              ))}
        </div>
      )}

      {tallSource.length > 0 && (
        <div className="flex gap-3.5 flex-wrap">
          {showLegacyOnly
            ? legacyTall.map((item) => (
                <LegacyCreatorTile key={`tall-${item.id}`} item={item} tall />
              ))
            : tallItems.map((content) => (
                <CreatorReviewTile key={content.contentId} content={content} tall />
              ))}
        </div>
      )}
    </section>
  );
}
