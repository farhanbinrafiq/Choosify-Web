import type { SpotlightBlockCategory, SpotlightBlockType } from '../../../types/spotlight/studio';

export interface SpotlightBlockDefinition {
  type: SpotlightBlockType;
  category: SpotlightBlockCategory;
  label: string;
  description: string;
  icon: string;
  defaultData: Record<string, unknown>;
  /** Content types that commonly use this block */
  suggestedFor?: string[];
}

export const BLOCK_REGISTRY: SpotlightBlockDefinition[] = [
  { type: 'heading', category: 'content', label: 'Heading', description: 'Section title', icon: 'H', defaultData: { text: 'New heading', level: 2 } },
  { type: 'paragraph', category: 'content', label: 'Paragraph', description: 'Body text', icon: '¶', defaultData: { text: '' } },
  { type: 'rich_text', category: 'content', label: 'Rich Text', description: 'Formatted content', icon: 'RT', defaultData: { html: '' } },
  { type: 'quote', category: 'content', label: 'Quote', description: 'Pull quote', icon: '"', defaultData: { text: '', author: '' } },
  { type: 'checklist', category: 'content', label: 'Checklist', description: 'Bullet checklist', icon: '☑', defaultData: { items: [] } },
  { type: 'divider', category: 'layout', label: 'Divider', description: 'Visual separator', icon: '—', defaultData: {} },
  { type: 'gallery', category: 'media', label: 'Gallery', description: 'Image gallery', icon: '🖼', defaultData: { images: [] } },
  { type: 'single_image', category: 'media', label: 'Image', description: 'Single image', icon: '📷', defaultData: { url: '', alt: '' } },
  { type: 'video', category: 'media', label: 'Video', description: 'Uploaded video', icon: '▶', defaultData: { url: '' } },
  { type: 'embedded_video', category: 'media', label: 'Embedded Video', description: 'External embed', icon: '⧉', defaultData: { url: '' } },
  { type: 'embed_youtube', category: 'media', label: 'YouTube', description: 'YouTube embed', icon: 'YT', defaultData: { videoId: '' } },
  { type: 'embed_tiktok', category: 'media', label: 'TikTok', description: 'TikTok embed', icon: 'TT', defaultData: { url: '' } },
  { type: 'embed_instagram', category: 'media', label: 'Instagram', description: 'Instagram embed', icon: 'IG', defaultData: { url: '' } },
  { type: 'embed_facebook', category: 'media', label: 'Facebook', description: 'Facebook embed', icon: 'FB', defaultData: { url: '' } },
  { type: 'pdf', category: 'media', label: 'PDF', description: 'PDF document', icon: 'PDF', defaultData: { url: '', title: '' } },
  { type: 'audio', category: 'media', label: 'Audio', description: 'Audio clip', icon: '🔊', defaultData: { url: '' } },
  { type: 'button', category: 'content', label: 'Button', description: 'Action button', icon: 'Btn', defaultData: { label: 'Learn More', href: '/' } },
  { type: 'cta', category: 'commerce', label: 'Call To Action', description: 'Primary CTA block', icon: 'CTA', defaultData: { label: 'Shop Now', href: '/' } },
  { type: 'timeline', category: 'live', label: 'Timeline', description: 'Event timeline', icon: '📅', defaultData: { events: [] } },
  { type: 'countdown', category: 'live', label: 'Countdown', description: 'Launch countdown', icon: '⏱', defaultData: { targetDate: '' } },
  { type: 'offer', category: 'commerce', label: 'Offer', description: 'Promotional offer', icon: '🏷', defaultData: { title: '', code: '' } },
  { type: 'coupon', category: 'commerce', label: 'Coupon', description: 'Discount coupon', icon: '🎟', defaultData: { code: '', discount: '' } },
  { type: 'announcement', category: 'content', label: 'Announcement', description: 'Announcement banner', icon: '📢', defaultData: { text: '' } },
  { type: 'faq', category: 'content', label: 'FAQ', description: 'Questions & answers', icon: '?', defaultData: { items: [] } },
  { type: 'comparison_table', category: 'content', label: 'Comparison Table', description: 'Product comparison', icon: '⚖', defaultData: { columns: [], rows: [] } },
  { type: 'pros_cons', category: 'content', label: 'Pros & Cons', description: 'Pros and cons list', icon: '±', defaultData: { pros: [], cons: [] } },
  { type: 'spec_table', category: 'content', label: 'Spec Table', description: 'Specifications', icon: 'Spec', defaultData: { specs: [] } },
  { type: 'feature_list', category: 'content', label: 'Feature List', description: 'Key features', icon: '★', defaultData: { features: [] } },
  { type: 'highlight_box', category: 'content', label: 'Highlight Box', description: 'Highlighted callout', icon: '◆', defaultData: { text: '' } },
  { type: 'alert', category: 'content', label: 'Alert', description: 'Warning or info alert', icon: '!', defaultData: { variant: 'info', text: '' } },
  { type: 'related_content', category: 'relationship', label: 'Related Content', description: 'Related Spotlight items', icon: '↗', defaultData: { contentIds: [] } },
  { type: 'creator_profile', category: 'relationship', label: 'Creator Profile', description: 'Creator card embed', icon: '👤', defaultData: { creatorId: '' } },
  { type: 'brand_profile', category: 'relationship', label: 'Brand Profile', description: 'Brand card embed', icon: '🏢', defaultData: { brandId: '' } },
  { type: 'service_card', category: 'commerce', label: 'Service Card', description: 'Service offering', icon: '🛎', defaultData: { serviceId: '' } },
  { type: 'location', category: 'content', label: 'Location', description: 'Map / address', icon: '📍', defaultData: { address: '' } },
  { type: 'contact', category: 'content', label: 'Contact', description: 'Contact details', icon: '✉', defaultData: { email: '', phone: '' } },
  { type: 'tags', category: 'content', label: 'Tags', description: 'Content tags', icon: '#', defaultData: { tags: [] } },
  { type: 'products', category: 'commerce', label: 'Products', description: 'Product grid', icon: '🛍', defaultData: { productIds: [] } },
  { type: 'product_card', category: 'commerce', label: 'Product Card', description: 'Single product', icon: 'P', defaultData: { productId: '' } },
  { type: 'brand_card', category: 'commerce', label: 'Brand Card', description: 'Brand showcase', icon: 'B', defaultData: { brandId: '' } },
  { type: 'compare_table', category: 'commerce', label: 'Compare Table', description: 'Compare products', icon: '⇄', defaultData: { productIds: [] } },
  { type: 'wishlist', category: 'commerce', label: 'Wishlist', description: 'Save to wishlist CTA', icon: '♥', defaultData: {} },
  { type: 'bundle', category: 'commerce', label: 'Bundle', description: 'Product bundle', icon: '📦', defaultData: { productIds: [] } },
  { type: 'services', category: 'commerce', label: 'Services', description: 'Service list', icon: 'S', defaultData: { serviceIds: [] } },
  { type: 'collections', category: 'relationship', label: 'Collections', description: 'Linked collections', icon: 'Col', defaultData: { collectionIds: [] } },
  { type: 'series', category: 'relationship', label: 'Series', description: 'Linked series', icon: 'Ser', defaultData: { seriesIds: [] } },
  { type: 'live_session', category: 'live', label: 'Live Session', description: 'Live experience block', icon: '🔴', defaultData: { status: 'upcoming' } },
  { type: 'replay', category: 'live', label: 'Replay', description: 'Live replay', icon: '↺', defaultData: { replayUrl: '' } },
];

export function getBlockDefinition(type: SpotlightBlockType): SpotlightBlockDefinition {
  return BLOCK_REGISTRY.find((b) => b.type === type)!;
}

export function blocksByCategory(category: SpotlightBlockCategory): SpotlightBlockDefinition[] {
  return BLOCK_REGISTRY.filter((b) => b.category === category);
}

export function createBlock(type: SpotlightBlockType, order: number): import('../../../types/spotlight/studio').SpotlightBlock {
  const def = getBlockDefinition(type);
  return {
    blockId: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    category: def.category,
    data: { ...def.defaultData },
    order,
  };
}
