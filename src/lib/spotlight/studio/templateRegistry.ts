import type { SpotlightBlockType } from '../../../types/spotlight/studio';

export interface SpotlightTemplateDefinition {
  templateId: string;
  title: string;
  description: string;
  category: string;
  publisherContentType: string;
  /** Block types to pre-fill in order */
  blockTypes: SpotlightBlockType[];
  seoDefaults?: { metaTitle?: string; schemaType?: string };
}

export const TEMPLATE_REGISTRY: SpotlightTemplateDefinition[] = [
  { templateId: 'electronics-review', title: 'Electronics Review', description: 'Video review with specs and products', category: 'Reviews', publisherContentType: 'review', blockTypes: ['heading', 'embed_youtube', 'pros_cons', 'spec_table', 'products', 'cta'] },
  { templateId: 'hotel-review', title: 'Hotel Review', description: 'Hotel showcase with gallery and location', category: 'Travel', publisherContentType: 'hotel_feature', blockTypes: ['heading', 'gallery', 'feature_list', 'location', 'contact', 'cta'] },
  { templateId: 'restaurant-review', title: 'Restaurant Review', description: 'Restaurant feature with menu highlights', category: 'Local', publisherContentType: 'restaurant_feature', blockTypes: ['heading', 'single_image', 'quote', 'feature_list', 'location', 'cta'] },
  { templateId: 'buying-guide', title: 'Buying Guide', description: 'Structured buying guide', category: 'Guides', publisherContentType: 'guide', blockTypes: ['heading', 'paragraph', 'comparison_table', 'pros_cons', 'products', 'faq'] },
  { templateId: 'travel-guide', title: 'Travel Guide', description: 'Destination travel guide', category: 'Travel', publisherContentType: 'travel_guide', blockTypes: ['heading', 'gallery', 'timeline', 'highlight_box', 'related_content'] },
  { templateId: 'campaign', title: 'Campaign', description: 'Standard product campaign', category: 'Commerce', publisherContentType: 'campaign', blockTypes: ['heading', 'single_image', 'paragraph', 'products', 'offer', 'cta'] },
  { templateId: 'launch-event', title: 'Launch Event', description: 'Product launch with countdown', category: 'Commerce', publisherContentType: 'product_launch', blockTypes: ['announcement', 'countdown', 'video', 'products', 'cta'] },
  { templateId: 'brand-story', title: 'Brand Story', description: 'Brand narrative', category: 'Editorial', publisherContentType: 'brand_story', blockTypes: ['heading', 'rich_text', 'gallery', 'brand_profile', 'related_content'] },
  { templateId: 'creator-recommendation', title: 'Creator Recommendation', description: 'Creator pick template', category: 'Community', publisherContentType: 'creator_pick', blockTypes: ['heading', 'embed_youtube', 'creator_profile', 'products', 'cta'] },
  { templateId: 'mega-sale', title: 'Mega Sale Campaign', description: 'High-impact sale layout', category: 'Commerce', publisherContentType: 'campaign', blockTypes: ['announcement', 'countdown', 'offer', 'coupon', 'products', 'cta'] },
  { templateId: 'health-guide', title: 'Health Guide', description: 'Educational health content', category: 'Education', publisherContentType: 'educational', blockTypes: ['heading', 'paragraph', 'checklist', 'faq', 'highlight_box'] },
  { templateId: 'fashion-lookbook', title: 'Fashion Lookbook', description: 'Fashion editorial', category: 'Fashion', publisherContentType: 'blog', blockTypes: ['heading', 'gallery', 'products', 'tags'] },
  { templateId: 'automotive-review', title: 'Automotive Review', description: 'Vehicle review template', category: 'Reviews', publisherContentType: 'review', blockTypes: ['heading', 'video', 'spec_table', 'pros_cons', 'comparison_table'] },
  { templateId: 'real-estate', title: 'Real Estate Feature', description: 'Property showcase', category: 'Local', publisherContentType: 'service_showcase', blockTypes: ['heading', 'gallery', 'feature_list', 'location', 'contact', 'cta'] },
  { templateId: 'service-feature', title: 'Service Feature', description: 'Service business showcase', category: 'Services', publisherContentType: 'service_showcase', blockTypes: ['heading', 'service_card', 'feature_list', 'faq', 'contact'] },
];

export function getTemplate(id: string): SpotlightTemplateDefinition | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.templateId === id);
}
