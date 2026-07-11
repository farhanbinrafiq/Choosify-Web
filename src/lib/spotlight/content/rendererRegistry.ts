/**
 * Renderer registry — maps SpotlightContentType to detail layout strategy.
 * All public cards route to Spotlight Content Page; renderers adapt the layout.
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
    description: 'Campaign hero, merchandising, CTA',
  },
  {
    rendererId: 'live_player',
    contentTypes: ['live', 'livestream_replay'],
    description: 'Live / replay player with commerce overlay',
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
