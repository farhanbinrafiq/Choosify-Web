import type { SpotlightPreviewMode } from '../../../types/spotlight/studio';

export interface SpotlightPreviewDefinition {
  mode: SpotlightPreviewMode;
  label: string;
  width: number;
  description: string;
}

export const PREVIEW_REGISTRY: SpotlightPreviewDefinition[] = [
  { mode: 'desktop', label: 'Desktop', width: 1280, description: 'Full desktop viewport' },
  { mode: 'tablet', label: 'Tablet', width: 768, description: 'Tablet viewport' },
  { mode: 'mobile', label: 'Mobile', width: 390, description: 'Mobile viewport' },
  { mode: 'homepage', label: 'Homepage', width: 1280, description: 'Homepage section preview' },
  { mode: 'carousel', label: 'Spotlight Carousel', width: 1280, description: 'Hero carousel card' },
  { mode: 'content_page', label: 'Content Page', width: 960, description: 'Spotlight Content Page' },
  { mode: 'brand_page', label: 'Brand Page', width: 1280, description: 'Brand detail rail' },
  { mode: 'category_page', label: 'Category Page', width: 1280, description: 'Category integration' },
  { mode: 'product_page', label: 'Product Page', width: 960, description: 'Product spotlight rail' },
  { mode: 'creator_page', label: 'Creator Page', width: 960, description: 'Creator library' },
  { mode: 'social', label: 'Social Share', width: 520, description: 'OG / Twitter card preview' },
];

export const COMMERCE_BLOCK_TYPES = [
  'cta', 'products', 'product_card', 'brand_card', 'compare_table', 'wishlist', 'bundle',
  'offer', 'coupon', 'services', 'service_card',
] as const;

export const AI_ACTIONS_REGISTRY = [
  { id: 'generate_headline', label: 'Generate Headline', phase: '6' },
  { id: 'generate_summary', label: 'Generate Summary', phase: '6' },
  { id: 'generate_tags', label: 'Generate Tags', phase: '6' },
  { id: 'generate_seo', label: 'Generate SEO', phase: '6' },
  { id: 'translate', label: 'Translate', phase: '6' },
  { id: 'rewrite', label: 'Rewrite', phase: '6' },
  { id: 'suggest_cta', label: 'Suggest CTA', phase: '6' },
  { id: 'suggest_products', label: 'Suggest Products', phase: '6' },
  { id: 'suggest_related', label: 'Suggest Related Content', phase: '6' },
  { id: 'suggest_blueprint', label: 'Suggest Blueprint', phase: '6' },
] as const;
