/**
 * UX-03 — mixed shopping feed utilities (frontend only)
 */

import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightDiscoverFilters } from '../types/spotlight/experience/filters';
import type { CatalogGuide } from '../types/catalog';
import type { CatalogProduct } from '../types/catalog';
import { sortByDiscoveryScore } from './spotlightDiscoveryScore';

export type SpotlightFeedCardVariant = 'reel' | 'landscape' | 'blog' | 'square' | 'live';

export interface SpotlightFeedGroup {
  id: string;
  label: string;
  kind: 'brand' | 'creator' | 'campaign' | 'seller';
  items: SpotlightContent[];
}

export type SpotlightMixedFeedEntry =
  | { kind: 'item'; key: string; content: SpotlightContent }
  | { kind: 'group'; key: string; group: SpotlightFeedGroup };

const INITIAL_BATCH = 24;
const LOAD_BATCH = 12;

export const SPOTLIGHT_FEED_BATCH = { initial: INITIAL_BATCH, loadMore: LOAD_BATCH } as const;
export const SPOTLIGHT_FEED_SCROLL_KEY = 'choosify_spotlight_feed_scroll';
export const SPOTLIGHT_FEED_VISIBLE_KEY = 'choosify_spotlight_feed_visible_count';

export function resolveFeedCardVariant(content: SpotlightContent): SpotlightFeedCardVariant {
  const mediaType = content.media?.mediaType;
  if (content.isLive || content.contentType === 'live') return 'live';
  if (mediaType === 'vertical_video' || mediaType === 'portrait_image') return 'reel';
  if (mediaType === 'square_video' || mediaType === 'square_image') return 'square';
  if (mediaType === 'landscape_video' || mediaType === 'livestream' || content.media?.videoUrl) {
    return 'landscape';
  }
  if (['buying_guide', 'tutorial', 'tips', 'editorial', 'comparison'].includes(content.contentType)) {
    return 'blog';
  }
  if (content.contentType === 'creator_review' || content.contentType === 'product_review') {
    return content.media?.videoUrl ? 'landscape' : 'blog';
  }
  return content.media?.videoUrl ? 'landscape' : 'blog';
}

export function filterSpotlightFeedItems(
  items: SpotlightContent[],
  filters: SpotlightDiscoverFilters,
  options?: { followedPublisherIds?: Set<string>; savedContentIds?: Set<string>; activeTab?: string },
): SpotlightContent[] {
  const { followedPublisherIds, savedContentIds, activeTab } = options ?? {};

  return items.filter((item) => {
    if (activeTab === 'following' && followedPublisherIds && !followedPublisherIds.has(item.publisher.publisherId)) {
      return false;
    }
    if (activeTab === 'saved' && savedContentIds && !savedContentIds.has(item.contentId)) {
      return false;
    }
    if (filters.contentTypes.length && !filters.contentTypes.includes(item.contentType)) return false;
    if (filters.brandIds.length && !item.connections.brandIds.some((id) => filters.brandIds.includes(id))) return false;
    if (filters.publisherIds.length && !filters.publisherIds.includes(item.publisher.publisherId)) return false;
    if (filters.publisherTypes.length && !filters.publisherTypes.includes(item.publisher.publisherType)) return false;
    if (filters.liveOnly && !item.isLive && item.contentType !== 'live') return false;
    if (filters.promotionsOnly && !['promotion', 'campaign', 'new_launch'].includes(item.contentType)) return false;
    if (filters.sponsoredOnly && !item.isSponsored) return false;
    if (filters.trendingOnly && (item.discoveryScore?.overall ?? item.popularityScore ?? 0) < 60) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${item.headline} ${item.description ?? ''} ${item.publisher.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** Natural mix — commerce-first score with type de-clustering */
export function mixSpotlightFeedItems(items: SpotlightContent[]): SpotlightContent[] {
  const sorted = [...items].sort((a, b) => {
    const aCommerce = (a.commerce.featuredProductIds.length ? 3 : 0) + (a.connections.productIds.length ? 2 : 0);
    const bCommerce = (b.commerce.featuredProductIds.length ? 3 : 0) + (b.connections.productIds.length ? 2 : 0);
    if (bCommerce !== aCommerce) return bCommerce - aCommerce;
    return sortByDiscoveryScore(a, b);
  });

  const result: SpotlightContent[] = [];
  const deferred: SpotlightContent[] = [];

  for (const item of sorted) {
    const last = result[result.length - 1];
    const prev = result[result.length - 2];
    const sameTypeRun =
      last &&
      prev &&
      last.contentType === item.contentType &&
      prev.contentType === item.contentType;

    if (sameTypeRun) {
      deferred.push(item);
    } else {
      result.push(item);
    }
  }

  return [...result, ...deferred];
}

function groupKeyForItem(item: SpotlightContent): string | null {
  if (item.connections.campaignIds[0]) return `campaign:${item.connections.campaignIds[0]}`;
  if (item.publisher.publisherType === 'brand') return `brand:${item.publisher.publisherId}`;
  if (item.publisher.publisherType === 'creator' || item.publisher.publisherType === 'influencer') {
    return `creator:${item.publisher.publisherId}`;
  }
  if (item.connections.brandIds[0]) return `brand:${item.connections.brandIds[0]}`;
  return null;
}

/** Group consecutive items from same brand/creator/campaign */
export function buildMixedFeedEntries(items: SpotlightContent[]): SpotlightMixedFeedEntry[] {
  const mixed = mixSpotlightFeedItems(items);
  const entries: SpotlightMixedFeedEntry[] = [];
  let i = 0;

  while (i < mixed.length) {
    const key = groupKeyForItem(mixed[i]);
    if (!key) {
      entries.push({ kind: 'item', key: mixed[i].contentId, content: mixed[i] });
      i += 1;
      continue;
    }

    const groupItems = [mixed[i]];
    let j = i + 1;
    while (j < mixed.length && groupKeyForItem(mixed[j]) === key) {
      groupItems.push(mixed[j]);
      j += 1;
    }

    if (groupItems.length >= 2) {
      const first = groupItems[0];
      const label =
        first.publisher.publisherType === 'brand'
          ? `More from ${first.publisher.name}`
          : first.publisher.publisherType === 'creator'
            ? `More from ${first.publisher.name}`
            : 'Related Spotlight';
      entries.push({
        kind: 'group',
        key: `group-${key}-${i}`,
        group: {
          id: key,
          label,
          kind: key.startsWith('campaign:') ? 'campaign' : first.publisher.publisherType === 'brand' ? 'brand' : 'creator',
          items: groupItems,
        },
      });
    } else {
      entries.push({ kind: 'item', key: groupItems[0].contentId, content: groupItems[0] });
    }
    i = j;
  }

  return entries;
}

export function flattenFeedEntries(entries: SpotlightMixedFeedEntry[]): SpotlightContent[] {
  const out: SpotlightContent[] = [];
  for (const entry of entries) {
    if (entry.kind === 'item') out.push(entry.content);
    else out.push(...entry.group.items);
  }
  return out;
}

export function spotlightContentToGuideShape(
  content: SpotlightContent,
  catalogGuide?: CatalogGuide,
): CatalogGuide & { recommendedProducts?: string[] } {
  if (catalogGuide) {
    return {
      ...catalogGuide,
      recommendedProducts: content.connections.productIds,
    };
  }

  const variant = resolveFeedCardVariant(content);
  const type: CatalogGuide['type'] =
    variant === 'reel' ? 'reels' : variant === 'landscape' || variant === 'live' ? 'video' : 'article';

  return {
    id: content.sourceId,
    slug: content.slug,
    title: content.headline,
    author: content.publisher.name,
    authorAvatar: content.publisher.logoUrl,
    category: content.connections.categoryIds[0] ?? 'General',
    excerpt: content.description,
    image:
      content.media?.thumbnail ??
      content.media?.posterImage ??
      content.media?.previewImage ??
      content.publisher.logoUrl ??
      '',
    videoUrl: content.media?.videoUrl ?? content.live?.replayUrl,
    duration: (content.media as { durationLabel?: string } | null)?.durationLabel,
    type,
    readTime: '5 MIN READ',
    views: String(content.popularityScore ?? 1200),
    shares: '0',
    tags: content.badges,
    creatorId: content.connections.creatorIds[0],
    productIds: content.connections.productIds,
    whatWeLike: [],
    whatToConsider: [],
    status: 'live',
    publishedAt: content.publishedAt,
    updatedAt: content.publishedAt,
    date: content.publishedAt,
    recommendedProducts: content.connections.productIds,
  } as CatalogGuide & { date?: string; recommendedProducts?: string[] };
}

export function resolveHeroVariant(content: SpotlightContent): 'portrait' | 'landscape' | 'image' | 'carousel' | 'live' | 'replay' {
  if (content.isLive && content.contentType === 'live') return 'live';
  if (content.contentType === 'livestream_replay' || content.live?.status === 'replay') return 'replay';
  if (content.media?.mediaType === 'carousel') return 'carousel';
  if (content.media?.mediaType === 'vertical_video' || content.media?.orientation === 'portrait') return 'portrait';
  if (content.media?.videoUrl || content.media?.mediaType === 'landscape_video') return 'landscape';
  return 'image';
}

export function primaryProductForContent(
  content: SpotlightContent,
  products: CatalogProduct[],
): CatalogProduct | undefined {
  const id = content.commerce.featuredProductIds[0] ?? content.connections.productIds[0];
  return id ? products.find((p) => String(p.id) === String(id)) : undefined;
}
