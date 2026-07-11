import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightCollection } from '../types/spotlight/discovery/collections';
import { SPOTLIGHT_CONTENT_TYPE_META } from '../types/spotlight/experience/contentTypes';
import { listSpotlightCollections } from './spotlightCollections';
import { resolveSpotlightExperience } from './spotlightContentResolver';
import type { SpotlightExperienceSources } from './spotlightContentResolver';

export interface SpotlightHeroCarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  href: string;
  ctaLabel: string;
  priority: number;
}

function contentToCarouselItem(content: SpotlightContent, priority: number): SpotlightHeroCarouselItem {
  const typeLabel = SPOTLIGHT_CONTENT_TYPE_META[content.contentType]?.label ?? 'Spotlight';
  const image =
    content.media?.posterImage ??
    content.media?.thumbnail ??
    content.media?.previewImage ??
    content.publisher.logoUrl ??
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80';

  let ctaLabel = content.ctaLabel || 'Explore';
  if (content.isLive || content.contentType === 'live') ctaLabel = 'Watch Live';

  return {
    id: content.contentId,
    title: content.headline,
    subtitle: content.publisher.name,
    image,
    badge: content.isLive ? 'Live' : typeLabel,
    href: content.href,
    ctaLabel,
    priority,
  };
}

function collectionToCarouselItem(col: SpotlightCollection, priority: number): SpotlightHeroCarouselItem {
  return {
    id: col.collectionId,
    title: col.name,
    subtitle: col.kind.replace('_', ' '),
    image: col.coverImageUrl ?? 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80',
    badge: 'Collection',
    href: `/spotlight/collections/${col.slug}`,
    ctaLabel: 'Explore Collection',
    priority,
  };
}

/** Priority: Live → Launches → Campaigns → Sponsored → Creator Picks → Announcements → Collections */
export function buildSpotlightHeroCarouselItems(
  sources: SpotlightExperienceSources,
): SpotlightHeroCarouselItem[] {
  const allContent = resolveSpotlightExperience(sources);
  const collections = listSpotlightCollections(allContent);
  const items: SpotlightHeroCarouselItem[] = [];
  const seen = new Set<string>();

  const add = (item: SpotlightHeroCarouselItem) => {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    items.push(item);
  };

  allContent
    .filter((c) => c.isLive || c.contentType === 'live' || c.live?.status === 'live')
    .slice(0, 4)
    .forEach((c) => add(contentToCarouselItem(c, 100)));

  allContent
    .filter((c) => c.contentType === 'new_launch')
    .slice(0, 4)
    .forEach((c) => add(contentToCarouselItem(c, 90)));

  allContent
    .filter((c) => ['campaign', 'promotion', 'whats_on', 'event'].includes(c.contentType))
    .slice(0, 6)
    .forEach((c) => add(contentToCarouselItem(c, 80)));

  allContent
    .filter((c) => c.isSponsored)
    .slice(0, 4)
    .forEach((c) => add(contentToCarouselItem(c, 70)));

  allContent
    .filter((c) => c.contentType === 'creator_review' || c.publisher.publisherType === 'creator')
    .slice(0, 4)
    .forEach((c) => add(contentToCarouselItem(c, 60)));

  allContent
    .filter((c) => c.contentType === 'announcement')
    .slice(0, 3)
    .forEach((c) => add(contentToCarouselItem(c, 50)));

  collections
    .filter((c) => c.isFeatured)
    .slice(0, 3)
    .forEach((c) => add(collectionToCarouselItem(c, 40)));

  return items.sort((a, b) => b.priority - a.priority).slice(0, 12);
}
