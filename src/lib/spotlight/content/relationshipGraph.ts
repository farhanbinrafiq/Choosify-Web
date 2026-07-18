import type { SpotlightContent } from '../../../types/spotlight/experience/content';

export interface ContentRelationshipEdge {
  fromId: string;
  toId: string;
  kind: 'product' | 'brand' | 'creator' | 'guide' | 'campaign' | 'collection' | 'series';
}

/** Build relationship graph edges from SpotlightContent connections */
export function buildContentRelationshipGraph(content: SpotlightContent): ContentRelationshipEdge[] {
  const edges: ContentRelationshipEdge[] = [];
  const from = content.contentId;

  content.connections.productIds.forEach((id) => {
    edges.push({ fromId: from, toId: id, kind: 'product' });
  });
  content.connections.brandIds.forEach((id) => {
    edges.push({ fromId: from, toId: id, kind: 'brand' });
  });
  content.connections.creatorIds.forEach((id) => {
    edges.push({ fromId: from, toId: id, kind: 'creator' });
  });
  content.connections.guideIds.forEach((id) => {
    edges.push({ fromId: from, toId: id, kind: 'guide' });
  });
  content.connections.campaignIds.forEach((id) => {
    edges.push({ fromId: from, toId: id, kind: 'campaign' });
  });
  content.graph.relatedCampaignIds.forEach((id) => {
    edges.push({ fromId: from, toId: id, kind: 'campaign' });
  });

  return edges;
}

export function relatedContentIds(content: SpotlightContent): string[] {
  return [
    ...content.graph.relatedGuideIds,
    ...content.graph.relatedCampaignIds,
    ...content.graph.relatedProductIds,
    ...content.graph.relatedCreatorIds,
    ...content.graph.relatedBrandIds,
  ];
}
