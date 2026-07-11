import type { SpotlightContentType } from '../../types/spotlight/experience/contentTypes';
import { spotlightContentHref } from '../spotlight/content';

/** Content-first routing — primary destination is always Spotlight Content Page */
export type ContentDestinationKind =
  | 'review'
  | 'guide'
  | 'recommendation'
  | 'campaign'
  | 'live'
  | 'collection'
  | 'series'
  | 'event'
  | 'announcement';

export interface ContentRouteRule {
  contentType: SpotlightContentType | '*';
  primaryRoute: (slug: string, entityId?: string) => string;
  ctaLabel: string;
  secondaryProfileRoute?: (entityId: string) => string;
}

export const CONTENT_ROUTE_REGISTRY: ContentRouteRule[] = [
  {
    contentType: 'creator_review',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Watch Review',
    secondaryProfileRoute: (id) => `/creators/${id}`,
  },
  {
    contentType: 'product_review',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Watch Review',
  },
  {
    contentType: 'buying_guide',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Read Guide',
  },
  {
    contentType: 'tutorial',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Read Guide',
  },
  {
    contentType: 'recommendation',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'View Recommendation',
  },
  {
    contentType: 'editorial',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Read Article',
  },
  {
    contentType: 'tips',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Read Guide',
  },
  {
    contentType: 'campaign',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Open Campaign',
  },
  {
    contentType: 'promotion',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'View Promotion',
  },
  {
    contentType: 'new_launch',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'View Launch',
  },
  {
    contentType: 'announcement',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'View Announcement',
  },
  {
    contentType: 'brand_story',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Read Story',
  },
  {
    contentType: 'live',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Watch Live',
  },
  {
    contentType: 'livestream_replay',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Watch Replay',
  },
  {
    contentType: 'event',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'View Event',
  },
  {
    contentType: 'whats_on',
    primaryRoute: (slug) => spotlightContentHref(slug),
    ctaLabel: 'Learn More',
  },
  {
    contentType: 'comparison',
    primaryRoute: () => '/compare',
    ctaLabel: 'Compare',
  },
];

export function resolveContentHref(
  contentType: SpotlightContentType,
  slug: string,
  options?: { isLive?: boolean; entityId?: string },
): string {
  if (contentType === 'comparison') return '/compare';
  const rule = CONTENT_ROUTE_REGISTRY.find((r) => r.contentType === contentType);
  if (rule) return rule.primaryRoute(slug, options?.entityId);
  return spotlightContentHref(slug);
}

export function collectionHref(slug: string): string {
  return `/spotlight/collections/${slug}`;
}

export function seriesHref(slug: string): string {
  return `/spotlight/series/${slug}`;
}

export function creatorReviewHref(creatorId: string): string {
  return spotlightContentHref(`creator-${creatorId}`);
}
