import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightRelatedContentBundle } from '../types/spotlight/experience/relatedContent';

/**
 * Rule-based related content stub — future AI / ES-010 integration
 */
export function resolveRelatedContentStub(
  source: SpotlightContent,
  allContent: SpotlightContent[],
): SpotlightRelatedContentBundle {
  const others = allContent.filter((c) => c.contentId !== source.contentId);

  const bySharedProducts = others.filter((c) =>
    c.connections.productIds.some((id) => source.connections.productIds.includes(id)),
  );
  const bySharedBrand = others.filter((c) =>
    c.connections.brandIds.some((id) => source.connections.brandIds.includes(id)),
  );
  const bySharedCreator = others.filter((c) =>
    c.connections.creatorIds.some((id) => source.connections.creatorIds.includes(id)),
  );

  const campaigns = [...bySharedBrand, ...bySharedProducts]
    .filter((c) => ['campaign', 'promotion', 'new_launch'].includes(c.contentType))
    .slice(0, 6)
    .map((c) => ({ kind: 'campaign' as const, entityId: c.sourceId, contentId: c.contentId, score: c.popularityScore }));

  const guides = others
    .filter((c) => ['buying_guide', 'tutorial', 'tips', 'recommendation'].includes(c.contentType))
    .slice(0, 6)
    .map((c) => ({ kind: 'guide' as const, entityId: c.sourceId, contentId: c.contentId, score: c.popularityScore }));

  const creatorVideos = bySharedCreator
    .filter((c) => c.contentType === 'creator_review')
    .slice(0, 6)
    .map((c) => ({ kind: 'creator_video' as const, entityId: c.sourceId, contentId: c.contentId, score: c.popularityScore }));

  const products = source.connections.productIds.slice(0, 6).map((id) => ({
    kind: 'product' as const,
    entityId: id,
    score: 50,
  }));

  const liveSessions = others
    .filter((c) => c.isLive || c.contentType === 'live')
    .slice(0, 4)
    .map((c) => ({ kind: 'live_session' as const, entityId: c.sourceId, contentId: c.contentId }));

  return {
    sourceContentId: source.contentId,
    campaigns,
    creatorVideos,
    guides,
    products,
    liveSessions,
    generatedAt: new Date().toISOString(),
    strategy: 'rule_based',
  };
}
