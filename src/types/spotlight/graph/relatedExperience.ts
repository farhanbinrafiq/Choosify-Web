/**
 * Related Experience — architecture for "You may also like" across entity types
 */

import type { SpotlightRelatedContentBundle } from '../experience/relatedContent';

export type SpotlightRelatedExperienceKind =
  | 'campaigns'
  | 'creators'
  | 'products'
  | 'guides'
  | 'live'
  | 'recommendations'
  | 'announcements'
  | 'events';

export interface SpotlightRelatedExperienceSection {
  kind: SpotlightRelatedExperienceKind;
  title: string;
  entityIds: string[];
  contentIds: string[];
  scores?: number[];
}

export interface SpotlightRelatedExperienceBundle {
  sourceContentId: string;
  sourcePublisherId?: string;
  sections: SpotlightRelatedExperienceSection[];
  generatedAt: string;
  strategy: 'rule_based' | 'graph_traversal' | 'ai_personalized';
}

export interface SpotlightRelatedExperienceContract {
  resolve(sourceContentId: string): Promise<SpotlightRelatedExperienceBundle>;
}

/** Maps legacy related content bundle to experience sections */
export function mapRelatedBundleToExperience(
  bundle: SpotlightRelatedContentBundle,
): SpotlightRelatedExperienceSection[] {
  return [
    { kind: 'campaigns' as const, title: 'Related Campaigns', entityIds: bundle.campaigns.map((c) => c.entityId), contentIds: bundle.campaigns.map((c) => c.contentId ?? c.entityId) },
    { kind: 'creators' as const, title: 'Related Creators', entityIds: bundle.creatorVideos.map((c) => c.entityId), contentIds: bundle.creatorVideos.map((c) => c.contentId ?? c.entityId) },
    { kind: 'guides' as const, title: 'Related Guides', entityIds: bundle.guides.map((g) => g.entityId), contentIds: bundle.guides.map((g) => g.contentId ?? g.entityId) },
    { kind: 'products' as const, title: 'Related Products', entityIds: bundle.products.map((p) => p.entityId), contentIds: [] },
    { kind: 'live' as const, title: 'Related Live', entityIds: bundle.liveSessions.map((l) => l.entityId), contentIds: bundle.liveSessions.map((l) => l.contentId ?? l.entityId) },
  ].filter((s) => s.entityIds.length > 0);
}
