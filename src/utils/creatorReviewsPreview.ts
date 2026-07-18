/**
 * LE-005 UX-05 — Creator Reviews preview utilities (Product + Brand detail pages)
 */

import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightContentType } from '../types/spotlight/experience/contentTypes';
import { resolveCtaLabel } from '../lib/spotlight/content/ctaRegistry';
import { mixSpotlightFeedItems } from './spotlightMixedFeed';

/** Review-oriented Spotlight content types for mixed preview grids */
export const CREATOR_REVIEW_CONTENT_TYPES: SpotlightContentType[] = [
  'creator_review',
  'product_review',
  'recommendation',
  'buying_guide',
  'tutorial',
  'comparison',
  'editorial',
  'live',
  'livestream_replay',
  'campaign',
  'promotion',
];

export const PRODUCT_REVIEW_MAX_UPLOADS = 10;
export const PRODUCT_REVIEW_RECOMMENDED = 5;
export const PRODUCT_PREVIEW_CAP = 4;
export const BRAND_PREVIEW_CAP = 6;

export type CreatorReviewsPreviewContext = 'product' | 'brand';

export interface LegacyCreatorContentItem {
  id: string;
  platform: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  creatorHandle?: string;
  views?: string;
}

export interface CreatorReviewsPreviewOptions {
  context: CreatorReviewsPreviewContext;
  productId?: string;
  brandId?: string;
  brandName?: string;
  /** Seller/admin pinned featured review (Spotlight contentId or sourceId) */
  featuredContentId?: string;
  legacyCreatorContent?: LegacyCreatorContentItem[];
}

export function isCreatorReviewContent(content: SpotlightContent): boolean {
  return (
    CREATOR_REVIEW_CONTENT_TYPES.includes(content.contentType) ||
    content.publisher.publisherType === 'creator' ||
    content.publisher.publisherType === 'influencer'
  );
}

function scoreContent(content: SpotlightContent): number {
  const featuredBoost = content.badges.some((b) => b.toLowerCase().includes('featured')) ? 40 : 0;
  const discovery = content.discoveryScore?.overall ?? 0;
  const popularity = content.popularityScore ?? 0;
  const recency =
    content.publishedAt ? Math.max(0, 30 - (Date.now() - Date.parse(content.publishedAt)) / 86400000) : 0;
  return featuredBoost + discovery * 0.6 + popularity * 0.3 + recency;
}

function findFeaturedReview(
  items: SpotlightContent[],
  featuredContentId?: string,
): SpotlightContent | undefined {
  if (featuredContentId) {
    return items.find(
      (c) => c.contentId === featuredContentId || c.sourceId === featuredContentId,
    );
  }
  return items.find((c) => c.badges.some((b) => b.toLowerCase().includes('featured review') || b === 'featured'));
}

export function rankCreatorReviewContent(
  items: SpotlightContent[],
  featuredContentId?: string,
): SpotlightContent[] {
  const featured = findFeaturedReview(items, featuredContentId);
  const rest = items.filter((c) => c !== featured);
  rest.sort((a, b) => scoreContent(b) - scoreContent(a));
  return featured ? [featured, ...rest] : rest;
}

export function filterCreatorReviewsForEntity(
  allContent: SpotlightContent[],
  options: Pick<CreatorReviewsPreviewOptions, 'productId' | 'brandId'>,
): SpotlightContent[] {
  const { productId, brandId } = options;

  return allContent.filter((content) => {
    if (!isCreatorReviewContent(content)) return false;

    if (productId) {
      const linked = content.connections.productIds.some((id) => String(id) === String(productId));
      const featured = content.commerce.featuredProductIds.some((id) => String(id) === String(productId));
      if (!linked && !featured) return false;
    }

    if (brandId) {
      if (!content.connections.brandIds.some((id) => String(id) === String(brandId))) return false;
    }

    return true;
  });
}

/** Adaptive visible count — product: show 1–4 naturally, cap at 4 when 5+ */
export function adaptiveProductPreviewCount(total: number): number {
  if (total <= 0) return 0;
  return Math.min(total, PRODUCT_PREVIEW_CAP);
}

export function shouldShowProductViewAll(total: number): boolean {
  return total > PRODUCT_PREVIEW_CAP;
}

export function adaptiveBrandPreviewCount(total: number): number {
  if (total <= 0) return 0;
  return Math.min(total, BRAND_PREVIEW_CAP);
}

export function shouldShowBrandViewAll(total: number): boolean {
  return total > BRAND_PREVIEW_CAP;
}

export function buildCreatorReviewsViewAllHref(options: {
  productId?: string;
  brandId?: string;
}): string {
  const params = new URLSearchParams({ tab: 'reviews' });
  if (options.productId) params.set('product', String(options.productId));
  if (options.brandId) params.set('brand', String(options.brandId));
  return `/spotlight?${params.toString()}`;
}

export function primaryCtaLabelForContent(content: SpotlightContent): string {
  if (content.isLive || content.contentType === 'live') return 'Watch Live';
  return resolveCtaLabel(content.contentType);
}

export function resolveCreatorReviewsPreview(
  allContent: SpotlightContent[],
  options: CreatorReviewsPreviewOptions,
): {
  items: SpotlightContent[];
  totalCount: number;
  visibleCount: number;
  showViewAll: boolean;
  viewAllHref: string;
} {
  const spotlightItems = filterCreatorReviewsForEntity(allContent, options);
  const ranked = rankCreatorReviewContent(spotlightItems, options.featuredContentId);

  const maxPool =
    options.context === 'product' ? PRODUCT_REVIEW_MAX_UPLOADS : PRODUCT_REVIEW_MAX_UPLOADS + 2;
  const pool = ranked.slice(0, maxPool);

  const totalCount = pool.length;
  const visibleCount =
    options.context === 'product'
      ? adaptiveProductPreviewCount(totalCount)
      : adaptiveBrandPreviewCount(totalCount);

  const showViewAll =
    options.context === 'product'
      ? shouldShowProductViewAll(totalCount)
      : shouldShowBrandViewAll(totalCount);

  const mixed = mixSpotlightFeedItems(pool);
  const items = mixed.slice(0, visibleCount);

  return {
    items,
    totalCount,
    visibleCount,
    showViewAll,
    viewAllHref: buildCreatorReviewsViewAllHref({
      productId: options.productId,
      brandId: options.brandId,
    }),
  };
}
