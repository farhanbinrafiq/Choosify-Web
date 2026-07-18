/**
 * Related Content Engine (CTO) — reserved for "You may also like" experiences
 */

export type SpotlightRelatedContentKind =
  | 'campaign'
  | 'creator_video'
  | 'guide'
  | 'product'
  | 'live_session'
  | 'brand_story'
  | 'recommendation';

export interface SpotlightRelatedContentRef {
  kind: SpotlightRelatedContentKind;
  entityId: string;
  contentId?: string;
  score?: number;
  reason?: string;
}

export interface SpotlightRelatedContentBundle {
  sourceContentId: string;
  campaigns: SpotlightRelatedContentRef[];
  creatorVideos: SpotlightRelatedContentRef[];
  guides: SpotlightRelatedContentRef[];
  products: SpotlightRelatedContentRef[];
  liveSessions: SpotlightRelatedContentRef[];
  /** Future AI ranking metadata */
  generatedAt?: string;
  strategy?: 'rule_based' | 'collaborative' | 'ai_personalized';
}

export interface SpotlightRelatedContentEngineContract {
  resolveRelated(contentId: string): Promise<SpotlightRelatedContentBundle>;
}
