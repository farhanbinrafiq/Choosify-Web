import type { CatalogGuide, CatalogProduct } from '../../types/catalog';
import type { SpotlightContent } from '../../types/spotlight/experience/content';
import type { UniversalAspectRatio } from '../media/types/mediaModel';
import { resolveCtaLabel } from '../../lib/spotlight/content/ctaRegistry';
import {
  resolveFeedCardVariant,
  type SpotlightFeedCardVariant,
} from '../../utils/spotlightMixedFeed';
import type {
  ContentCardAspectRatio,
  ContentCardLayoutVariant,
  ContentCardPlatform,
  UniversalContentCardModel,
} from './universalContentCardTypes';
import type { UniversalCommerceCardModel } from './universalCommerceCardTypes';
import type { LegacyCreatorContentItem } from '../../utils/creatorReviewsPreview';
import { buildCreatorReviewsViewAllHref } from '../../utils/creatorReviewsPreview';

const ASPECT_FROM_UNIVERSAL: Record<UniversalAspectRatio, ContentCardAspectRatio> = {
  '9:16': '9/16',
  '16:9': '16/9',
  '1:1': '1/1',
  '4:5': '4/5',
  '4:3': '3/4',
  '21:9': '16/9',
};

const VARIANT_ASPECT: Record<SpotlightFeedCardVariant, ContentCardAspectRatio> = {
  reel: '9/16',
  landscape: '16/9',
  square: '1/1',
  blog: '16/10',
  live: '16/9',
};

const VARIANT_LAYOUT: Record<SpotlightFeedCardVariant, ContentCardLayoutVariant> = {
  reel: 'reel',
  landscape: 'landscape',
  square: 'square',
  blog: 'blog',
  live: 'live',
};

function platformForVariant(variant: SpotlightFeedCardVariant): ContentCardPlatform {
  if (variant === 'reel') return 'instagram';
  if (variant === 'live') return 'live';
  if (variant === 'landscape') return 'youtube';
  return 'blog';
}

function badgeForVariant(variant: SpotlightFeedCardVariant): string {
  if (variant === 'reel') return 'REEL';
  if (variant === 'live') return 'LIVE';
  if (variant === 'landscape') return 'VIDEO';
  if (variant === 'square') return 'SHOP';
  return 'GUIDE';
}

function resolveAspectRatio(
  content: SpotlightContent,
  variant: SpotlightFeedCardVariant,
): ContentCardAspectRatio {
  const ratio = content.media?.aspectRatio;
  if (ratio && ASPECT_FROM_UNIVERSAL[ratio]) return ASPECT_FROM_UNIVERSAL[ratio];
  return VARIANT_ASPECT[variant];
}

function compactCtaLabel(content: SpotlightContent): string {
  if (content.isLive || content.contentType === 'live') return 'Watch Live';
  return resolveCtaLabel(content.contentType);
}

function formatPopularity(score?: number): string | undefined {
  if (score === undefined) return undefined;
  if (score >= 1_000_000) return `${(score / 1_000_000).toFixed(1)}M`;
  if (score >= 1_000) return `${(score / 1_000).toFixed(1)}K`;
  return String(Math.round(score));
}

export function spotlightToContentCardModel(
  content: SpotlightContent,
  product?: CatalogProduct,
): UniversalCommerceCardModel {
  const variant = resolveFeedCardVariant(content);
  const thumb =
    content.media?.thumbnail ??
    content.media?.posterImage ??
    content.media?.previewImage ??
    product?.image ??
    content.publisher.logoUrl;


  return {
    id: content.contentId,
    href: content.href,
    title: content.headline,
    excerpt: content.description,
    layoutVariant: VARIANT_LAYOUT[variant],
    aspectRatio: resolveAspectRatio(content, variant),
    image: thumb,
    videoUrl: content.media?.videoUrl,
    liveEmbedUrl: variant === 'live' ? content.live?.embedUrl : undefined,
    badgeLabel: badgeForVariant(variant),
    platform: platformForVariant(variant),
    platformLabel:
      variant === 'reel'
        ? 'Instagram'
        : variant === 'landscape' || variant === 'live'
          ? 'Youtube'
          : 'Guide',
    duration: content.media?.duration
      ? `${Math.floor(content.media.duration / 60)}:${String(content.media.duration % 60).padStart(2, '0')}`
      : undefined,
    isSponsored: content.isSponsored,
    brandName:
      content.publisher.publisherType === 'brand'
        ? content.publisher.name
        : content.connections.brandIds.length
          ? content.publisher.name
          : undefined,
    creatorName:
      content.publisher.publisherType === 'creator' || content.publisher.publisherType === 'influencer'
        ? content.publisher.name
        : undefined,
    product: product
      ? {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          slug: product.slug,
        }
      : undefined,
    ctaLabel: compactCtaLabel(content),
    primaryCta: { label: compactCtaLabel(content), href: content.href },
    views: formatPopularity(content.popularityScore),
    popularityScore: content.popularityScore,
    publishedAt: content.publishedAt,
    creatorAvatar: content.publisher.logoUrl,
    engagement: {
      entityType: 'guide',
      entityId: content.sourceId,
      payload: { contentId: content.contentId, headline: content.headline, spotlight: true },
    },
  };
}

function guideLayoutVariant(guide: CatalogGuide): ContentCardLayoutVariant {
  if (guide.type === 'reels' || guide.type === 'shorts') return 'reel';
  if (guide.type === 'video') return 'landscape';
  return 'blog';
}

function guideAspectRatio(guide: CatalogGuide): ContentCardAspectRatio {
  if (guide.type === 'reels' || guide.type === 'shorts') return '9/16';
  if (guide.type === 'video') return '16/9';
  return '16/10';
}

function guidePlatform(guide: CatalogGuide): ContentCardPlatform {
  if (guide.type === 'reels' || guide.type === 'shorts') return 'instagram';
  if (guide.type === 'video') return 'youtube';
  return 'blog';
}

export function spotlightToPreviewContentCardModel(
  content: SpotlightContent,
  brandName?: string,
): UniversalCommerceCardModel {
  const base = spotlightToContentCardModel(content);
  const creatorName =
    content.publisher.publisherType === 'creator' || content.publisher.publisherType === 'influencer'
      ? content.publisher.name
      : content.connections.creatorIds.length
        ? content.publisher.name
        : undefined;

  return {
    ...base,
    product: undefined,
    secondaryCta: undefined,
    compareHref: undefined,
    brandName: brandName ?? base.brandName ?? content.publisher.name,
    creatorName,
    creatorAvatar: content.publisher.logoUrl,
    ctaLabel: primaryCtaLabelForContent(content),
    primaryCta: {
      label: primaryCtaLabelForContent(content),
      href: content.href,
    },
    views: formatPopularity(content.popularityScore),
    popularityScore: content.popularityScore,
    publishedAt: content.publishedAt,
    engagement: undefined,
  };
}

function primaryCtaLabelForContent(content: SpotlightContent): string {
  if (content.isLive || content.contentType === 'live') return 'Watch Live';
  return resolveCtaLabel(content.contentType);
}

export function legacyCreatorContentToPreviewModel(
  item: LegacyCreatorContentItem,
  options?: { brandName?: string; productId?: string },
): UniversalCommerceCardModel {
  const platformKey = item.platform.toLowerCase();
  const isPortrait = platformKey.includes('insta') || platformKey.includes('tiktok');
  const platform: ContentCardPlatform = platformKey.includes('insta')
    ? 'instagram'
    : platformKey.includes('tiktok')
      ? 'tiktok'
      : platformKey.includes('facebook')
        ? 'facebook'
        : 'youtube';

  return {
    id: String(item.id),
    href: buildCreatorReviewsViewAllHref({ productId: options?.productId }),
    title: item.title,
    layoutVariant: isPortrait ? 'reel' : 'landscape',
    aspectRatio: (isPortrait ? '9/16' : '16/9') as ContentCardAspectRatio,
    image: item.thumbnail,
    videoUrl: item.videoUrl,
    badgeLabel: isPortrait ? 'REEL' : 'VIDEO',
    platform,
    platformLabel: platform === 'instagram' ? 'Instagram' : platform === 'youtube' ? 'Youtube' : 'Review',
    duration: item.views ? `${item.views} views` : undefined,
    brandName: options?.brandName,
    creatorName: item.creatorHandle?.replace('@', ''),
    ctaLabel: 'Watch Review',
    primaryCta: { label: 'Watch Review', href: buildCreatorReviewsViewAllHref({ productId: options?.productId }) },
    views: item.views,
  };
}

export function guideToContentCardModel(guide: CatalogGuide & { excerpt?: string }): UniversalCommerceCardModel {
  const layoutVariant = guideLayoutVariant(guide);
  const platform = guidePlatform(guide);

  return {
    id: String(guide.id),
    href: `/guides/${guide.id}`,
    title: guide.title,
    excerpt: guide.excerpt,
    layoutVariant,
    aspectRatio: guideAspectRatio(guide),
    image: guide.image,
    videoUrl: guide.videoUrl,
    badgeLabel:
      layoutVariant === 'reel' ? 'REEL' : layoutVariant === 'landscape' ? 'VIDEO' : 'GUIDE',
    platform,
    platformLabel:
      platform === 'instagram' ? 'Instagram' : platform === 'youtube' ? 'Youtube' : 'Blog',
    duration: guide.duration,
    readTime: guide.readTime ?? '5 MIN READ',
    views: guide.views,
    likes: guide.views,
    shares: guide.shares,
    ctaLabel:
      layoutVariant === 'reel'
        ? 'Watch Review'
        : layoutVariant === 'landscape'
          ? 'Watch Review'
          : 'Read Guide',
    engagement: {
      entityType: 'guide',
      entityId: guide.id,
      payload: guide as unknown as Record<string, unknown>,
    },
  };
}
