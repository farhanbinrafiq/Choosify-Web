import type { SpotlightPublisherContentTypeDefinition } from '../../../types/spotlight/studio';

/** Publisher-facing content types — maps to SpotlightContent + campaign storage */
export const PUBLISHER_CONTENT_TYPE_REGISTRY: SpotlightPublisherContentTypeDefinition[] = [
  { id: 'guide', label: 'Guide', icon: '📖', contentType: 'buying_guide', campaignType: 'buying_guide', group: 'editorial' },
  { id: 'review', label: 'Review', icon: '⭐', contentType: 'product_review', campaignType: 'creator_review', group: 'community' },
  { id: 'recommendation', label: 'Recommendation', icon: '👍', contentType: 'recommendation', campaignType: 'editors_pick', group: 'editorial' },
  { id: 'creator_pick', label: 'Creator Pick', icon: '🎬', contentType: 'creator_review', campaignType: 'creator_campaign', group: 'community' },
  { id: 'video', label: 'Video', icon: '▶', contentType: 'product_review', campaignType: 'creator_review', group: 'editorial' },
  { id: 'reel', label: 'Reel', icon: '📱', contentType: 'recommendation', campaignType: 'creator_review', group: 'editorial' },
  { id: 'blog', label: 'Blog', icon: '✍', contentType: 'editorial', campaignType: 'brand_story', group: 'editorial' },
  { id: 'campaign', label: 'Campaign', icon: '📣', contentType: 'campaign', campaignType: 'brand_campaign', group: 'commerce' },
  { id: 'announcement', label: 'Announcement', icon: '📢', contentType: 'announcement', campaignType: 'announcement', group: 'editorial' },
  { id: 'product_launch', label: 'Product Launch', icon: '🚀', contentType: 'new_launch', campaignType: 'new_launch', group: 'commerce' },
  { id: 'live_event', label: 'Live Event', icon: '🔴', contentType: 'live', campaignType: 'livestream', group: 'live' },
  { id: 'replay', label: 'Replay', icon: '↺', contentType: 'livestream_replay', campaignType: 'livestream', group: 'live' },
  { id: 'collection', label: 'Collection', icon: '📚', contentType: 'editorial', group: 'editorial' },
  { id: 'series', label: 'Series', icon: '📺', contentType: 'editorial', group: 'editorial' },
  { id: 'story', label: 'Story', icon: '⭕', contentType: 'brand_story', campaignType: 'brand_story', group: 'editorial' },
  { id: 'article', label: 'Article', icon: '📄', contentType: 'editorial', campaignType: 'brand_story', group: 'editorial' },
  { id: 'educational', label: 'Educational Content', icon: '🎓', contentType: 'tutorial', campaignType: 'buying_guide', group: 'editorial' },
  { id: 'service_showcase', label: 'Service Showcase', icon: '🛎', contentType: 'whats_on', group: 'local' },
  { id: 'restaurant_feature', label: 'Restaurant Feature', icon: '🍽', contentType: 'event', group: 'local' },
  { id: 'hotel_feature', label: 'Hotel Feature', icon: '🏨', contentType: 'event', group: 'local' },
  { id: 'travel_guide', label: 'Travel Guide', icon: '✈️', contentType: 'buying_guide', campaignType: 'buying_guide', group: 'local' },
  { id: 'brand_story', label: 'Brand Story', icon: '🏢', contentType: 'brand_story', campaignType: 'brand_story', group: 'commerce' },
];

export function getPublisherContentType(id: string): SpotlightPublisherContentTypeDefinition | undefined {
  return PUBLISHER_CONTENT_TYPE_REGISTRY.find((t) => t.id === id);
}

export function publisherTypesByGroup(group: SpotlightPublisherContentTypeDefinition['group']) {
  return PUBLISHER_CONTENT_TYPE_REGISTRY.filter((t) => t.group === group);
}
