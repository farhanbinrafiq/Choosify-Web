import type { SpotlightPersonalizedRail } from '../types/spotlight/discovery/relatedRails';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import { getRecentlySaved, getRecentlyViewed, listFollows } from './spotlightUserSignals';
import { sortByDiscoveryScore } from './spotlightDiscoveryScore';

export function buildPersonalizedRails(
  allContent: SpotlightContent[],
  recentlyViewedIds: string[] = getRecentlyViewed().map((h) => h.contentId),
): SpotlightPersonalizedRail[] {
  const byScore = [...allContent].sort(sortByDiscoveryScore);
  const viewed = allContent.filter((c) => recentlyViewedIds.includes(c.contentId));
  const followIds = new Set(listFollows().map((f) => f.targetId));
  const savedIds = new Set(getRecentlySaved().map((s) => s.targetId));

  const becauseViewed = viewed.length
    ? allContent
        .filter((c) => !recentlyViewedIds.includes(c.contentId))
        .filter((c) =>
          viewed.some(
            (v) =>
              c.connections.productIds.some((id) => v.connections.productIds.includes(id)) ||
              c.publisher.publisherId === v.publisher.publisherId,
          ),
        )
        .slice(0, 8)
    : byScore.slice(0, 6);

  const becauseFollow = allContent
    .filter((c) => followIds.has(c.publisher.publisherId) || c.connections.creatorIds.some((id) => followIds.has(id)))
    .slice(0, 8);

  const becauseSaved = allContent
    .filter((c) => savedIds.has(c.sourceId) || savedIds.has(c.contentId))
    .slice(0, 8);

  const editorsPicks = byScore.filter((c) => (c.discoveryScore?.factors.editorialPriority ?? 0) >= 70).slice(0, 8);
  const creatorPopular = allContent
    .filter((c) => c.publisher.publisherType === 'creator')
    .sort(sortByDiscoveryScore)
    .slice(0, 8);
  const brandPopular = allContent
    .filter((c) => c.publisher.publisherType === 'brand')
    .sort(sortByDiscoveryScore)
    .slice(0, 8);

  const rails: SpotlightPersonalizedRail[] = [];

  if (becauseViewed.length) {
    rails.push({
      kind: 'because_you_viewed',
      title: 'Because You Viewed',
      contentIds: becauseViewed.map((c) => c.contentId),
    });
  }

  if (becauseFollow.length) {
    rails.push({
      kind: 'because_you_follow',
      title: 'Because You Follow',
      contentIds: becauseFollow.map((c) => c.contentId),
    });
  }

  if (becauseSaved.length) {
    rails.push({
      kind: 'because_you_saved',
      title: 'Because You Saved',
      contentIds: becauseSaved.map((c) => c.contentId),
    });
  }

  rails.push({
    kind: 'trending_near_you',
    title: 'Trending Near You',
    contentIds: byScore.slice(0, 6).map((c) => c.contentId),
    isPlaceholder: true,
  });

  if (editorsPicks.length) {
    rails.push({
      kind: 'editors_picks',
      title: "Editor's Picks",
      contentIds: editorsPicks.map((c) => c.contentId),
    });
  }

  if (creatorPopular.length) {
    rails.push({
      kind: 'popular_among_creators',
      title: 'Popular Among Creators',
      contentIds: creatorPopular.map((c) => c.contentId),
    });
  }

  if (brandPopular.length) {
    rails.push({
      kind: 'popular_among_brands',
      title: 'Popular Among Brands',
      contentIds: brandPopular.map((c) => c.contentId),
    });
  }

  return rails;
}
