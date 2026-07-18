import type { SpotlightBlockType } from '../../../types/spotlight/studio';

/** Blueprint — business workflow + recommended structure (CTO upgrade) */
export interface SpotlightBlueprintDefinition {
  blueprintId: string;
  title: string;
  description: string;
  icon: string;
  publisherContentType: string;
  recommendedBlocks: SpotlightBlockType[];
  requiredMedia: ('landscape' | 'portrait' | 'square' | 'video')[];
  seoChecklist: string[];
  suggestedCtas: string[];
  productLinkStrategy: string;
  suggestedPlacements: string[];
  workflowSteps: ('draft' | 'review' | 'schedule' | 'publish')[];
}

export const BLUEPRINT_REGISTRY: SpotlightBlueprintDefinition[] = [
  {
    blueprintId: 'product-launch',
    title: 'Product Launch Blueprint',
    description: 'Launch workflow with countdown, media, and product linking',
    icon: '🚀',
    publisherContentType: 'product_launch',
    recommendedBlocks: ['announcement', 'countdown', 'video', 'products', 'cta', 'offer'],
    requiredMedia: ['landscape', 'video'],
    seoChecklist: ['Meta title includes product name', 'OG image set', 'Schema: Product'],
    suggestedCtas: ['Shop Now', 'Pre-order', 'Notify Me'],
    productLinkStrategy: 'Primary product + 3 related accessories',
    suggestedPlacements: ['homepage_carousel', 'spotlight_featured', 'category_page'],
    workflowSteps: ['draft', 'review', 'schedule', 'publish'],
  },
  {
    blueprintId: 'restaurant-promotion',
    title: 'Restaurant Promotion Blueprint',
    description: 'Local dining promotion with location and offers',
    icon: '🍽',
    publisherContentType: 'restaurant_feature',
    recommendedBlocks: ['heading', 'gallery', 'offer', 'location', 'contact', 'cta'],
    requiredMedia: ['square', 'landscape'],
    seoChecklist: ['Local business schema', 'Location in meta description'],
    suggestedCtas: ['Book Table', 'View Menu', 'Order Now'],
    productLinkStrategy: 'Link menu items as products where applicable',
    suggestedPlacements: ['spotlight_local', 'category_page'],
    workflowSteps: ['draft', 'review', 'publish'],
  },
  {
    blueprintId: 'hotel-showcase',
    title: 'Hotel Showcase Blueprint',
    description: 'Hospitality feature with gallery and booking CTA',
    icon: '🏨',
    publisherContentType: 'hotel_feature',
    recommendedBlocks: ['heading', 'gallery', 'feature_list', 'location', 'cta'],
    requiredMedia: ['landscape', 'square'],
    seoChecklist: ['Hotel schema', 'Canonical URL', 'OG image'],
    suggestedCtas: ['Book Now', 'Check Availability'],
    productLinkStrategy: 'Room types as linked products',
    suggestedPlacements: ['spotlight_travel', 'homepage_carousel'],
    workflowSteps: ['draft', 'review', 'publish'],
  },
  {
    blueprintId: 'travel-experience',
    title: 'Travel Experience Blueprint',
    description: 'Destination guide with timeline and related content',
    icon: '✈️',
    publisherContentType: 'travel_guide',
    recommendedBlocks: ['heading', 'gallery', 'timeline', 'highlight_box', 'related_content'],
    requiredMedia: ['landscape'],
    seoChecklist: ['Travel schema', 'Keywords for destination'],
    suggestedCtas: ['Explore Deals', 'Plan Trip'],
    productLinkStrategy: 'Travel products and packages',
    suggestedPlacements: ['spotlight_travel'],
    workflowSteps: ['draft', 'review', 'publish'],
  },
  {
    blueprintId: 'creator-review',
    title: 'Creator Review Blueprint',
    description: 'Video-first creator review workflow',
    icon: '🎥',
    publisherContentType: 'review',
    recommendedBlocks: ['heading', 'embed_youtube', 'creator_profile', 'pros_cons', 'products'],
    requiredMedia: ['video'],
    seoChecklist: ['Video schema', 'Creator attribution'],
    suggestedCtas: ['Watch Review', 'Shop Featured'],
    productLinkStrategy: 'Featured product + alternatives',
    suggestedPlacements: ['spotlight_reviews', 'creator_page'],
    workflowSteps: ['draft', 'review', 'publish'],
  },
  {
    blueprintId: 'mega-sale',
    title: 'Mega Sale Campaign Blueprint',
    description: 'High-urgency sale with offers and bundles',
    icon: '🛍',
    publisherContentType: 'campaign',
    recommendedBlocks: ['announcement', 'countdown', 'offer', 'coupon', 'products', 'bundle'],
    requiredMedia: ['landscape', 'square'],
    seoChecklist: ['Sale event schema', 'Offer expiry in meta'],
    suggestedCtas: ['Shop Sale', 'Grab Deal'],
    productLinkStrategy: 'Bundle primary + category grid',
    suggestedPlacements: ['homepage_carousel', 'deals_page', 'spotlight_featured'],
    workflowSteps: ['draft', 'review', 'schedule', 'publish'],
  },
  {
    blueprintId: 'event-announcement',
    title: 'Event Announcement Blueprint',
    description: 'Event promo with schedule and speakers',
    icon: '🎉',
    publisherContentType: 'announcement',
    recommendedBlocks: ['announcement', 'timeline', 'countdown', 'faq', 'cta'],
    requiredMedia: ['landscape'],
    seoChecklist: ['Event schema', 'Date in title'],
    suggestedCtas: ['Register', 'Learn More'],
    productLinkStrategy: 'Event tickets as products',
    suggestedPlacements: ['spotlight_calendar', 'homepage_carousel'],
    workflowSteps: ['draft', 'review', 'schedule', 'publish'],
  },
];

export function getBlueprint(id: string): SpotlightBlueprintDefinition | undefined {
  return BLUEPRINT_REGISTRY.find((b) => b.blueprintId === id);
}
