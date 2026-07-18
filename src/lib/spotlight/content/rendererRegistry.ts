/**
 * Renderer registry — maps SpotlightContentType to detail layout strategy.
 * All public item cards open the Guide Detail shell via Spotlight Content Page.
 */
import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';

export type SpotlightContentRendererId =
  | 'guide_rich'
  | 'review_media'
  | 'campaign_commerce'
  | 'live_player'
  | 'editorial_article'
  | 'event_card'
  | 'collection_entry'
  | 'series_episode';

export interface SpotlightRendererDefinition {
  rendererId: SpotlightContentRendererId;
  contentTypes: SpotlightContentType[];
  description: string;
  /** Reuses GuideDetailPage rich layout */
  reusesGuideDetail?: boolean;
}

export const RENDERER_REGISTRY: SpotlightRendererDefinition[] = [
  {
    rendererId: 'guide_rich',
    contentTypes: ['buying_guide', 'tutorial', 'tips', 'comparison', 'recommendation', 'editorial'],
    description: 'Full guide layout — winner, verdict, products, takeaways',
    reusesGuideDetail: true,
  },
  {
    rendererId: 'review_media',
    contentTypes: ['creator_review', 'product_review'],
    description: 'Video-first review with products and creator link',
    reusesGuideDetail: true,
  },
  {
    rendererId: 'campaign_commerce',
    contentTypes: ['campaign', 'promotion', 'new_launch', 'brand_story', 'announcement'],
    description: 'Campaign hero, merchandising, CTA — Guide Detail shell',
    reusesGuideDetail: true,
  },
  {
    rendererId: 'live_player',
    contentTypes: ['live', 'livestream_replay'],
    description: 'Live / replay in Guide Detail hero + live sections',
    reusesGuideDetail: true,
  },
  {
    rendererId: 'editorial_article',
    contentTypes: ['whats_on', 'community_pick'],
    description: 'Editorial article body',
    reusesGuideDetail: true,
  },
  {
    rendererId: 'event_card',
    contentTypes: ['event'],
    description: 'Event schedule and brand context',
    reusesGuideDetail: true,
  },
];

export function resolveRendererId(contentType: SpotlightContentType): SpotlightRendererDefinition {
  return (
    RENDERER_REGISTRY.find((r) => r.contentTypes.includes(contentType)) ?? {
      rendererId: 'editorial_article',
      contentTypes: [contentType],
      description: 'Default editorial layout',
      reusesGuideDetail: true,
    }
  );
}

/** All public content types use Guide Detail — kept for callers/docs */
export function contentPageUsesGuideLayout(_contentType?: SpotlightContentType): boolean {
  return true;
}
