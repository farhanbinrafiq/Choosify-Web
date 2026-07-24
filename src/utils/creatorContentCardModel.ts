import type { Creator, MediaItem } from '../data/creators';
import { spotlightContentHref } from '../lib/spotlight/content';
import type {
  UniversalCommerceCardModel,
  ContentCardLayoutVariant,
  ContentCardAspectRatio,
  ContentCardPlatform,
} from '../components/content/universalCommerceCardTypes';

export type CreatorContentKind = 'video' | 'reel' | 'blog';

/** Same universal content card model used by Discover / Brand Story / Product Detail —
 * builds a UniversalCommerceCard model from a creator's video/reel/blog MediaItem. */
export function buildCreatorContentModel(
  kind: CreatorContentKind,
  item: MediaItem,
  creator: Creator,
): UniversalCommerceCardModel {
  const layoutVariant: ContentCardLayoutVariant =
    kind === 'video' ? 'landscape' : kind === 'reel' ? 'reel' : 'blog';
  const aspectRatio: ContentCardAspectRatio =
    kind === 'video' ? '16/9' : kind === 'reel' ? '9/16' : '4/5';
  const platform: ContentCardPlatform =
    kind === 'blog'
      ? 'blog'
      : ((creator.platforms?.[0]?.toLowerCase() as ContentCardPlatform) || 'youtube');

  return {
    id: `${kind}-${item.id}`,
    href: spotlightContentHref(String(item.associatedGuideId || item.id)),
    title: item.title,
    excerpt: item.excerpt,
    layoutVariant,
    aspectRatio,
    image: item.thumbnail,
    videoUrl: kind !== 'blog' ? item.url : undefined,
    badgeLabel: item.isLive
      ? 'LIVE'
      : item.pinned
        ? 'PINNED'
        : kind === 'blog'
          ? item.associatedGuideId
            ? 'BUYING GUIDE'
            : 'ARTICLE'
          : kind === 'reel'
            ? 'REEL'
            : item.associatedGuideId
              ? 'FULL GUIDE'
              : 'VIDEO',
    platform,
    creatorName: creator.name,
    creatorAvatar: creator.avatar,
    readTime: item.readTime,
    duration: item.duration,
    views: item.views,
    isVerified: creator.verifiedStatus,
    publisherTypeLabel: 'Creator',
  };
}
