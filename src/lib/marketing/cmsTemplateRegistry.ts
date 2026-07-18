import type { CmsTemplateDefinition } from '../../types/marketing/cms';
import { getCmsContentType } from './cmsContentTypeRegistry';

export const CMS_TEMPLATE_REGISTRY: CmsTemplateDefinition[] = [
  {
    id: 'buying_guide',
    label: 'Buying Guide',
    description: 'Winner, pros/cons, verdict, and top picks for product comparisons.',
    icon: '📖',
    contentType: 'buying_guide',
    defaultSections: getCmsContentType('buying_guide')!.defaultSections,
  },
  {
    id: 'product_launch',
    label: 'Product Launch',
    description: 'Hero media, countdown, featured product, and launch CTA.',
    icon: '🚀',
    contentType: 'product_launch',
    defaultSections: getCmsContentType('product_launch')!.defaultSections,
  },
  {
    id: 'flash_sale',
    label: 'Flash Sale',
    description: 'Limited-time offer with urgency blocks and product grid.',
    icon: '⚡',
    contentType: 'offer',
    defaultSections: getCmsContentType('offer')!.defaultSections,
  },
  {
    id: 'brand_campaign',
    label: 'Brand Campaign',
    description: 'Brand story, hero gallery, products, and campaign CTA.',
    icon: '📣',
    contentType: 'brand_campaign',
    defaultSections: getCmsContentType('brand_campaign')!.defaultSections,
  },
  {
    id: 'live_shopping',
    label: 'Live Shopping',
    description: 'Live status, schedule, and shoppable product rail.',
    icon: '🔴',
    contentType: 'live_event',
    defaultSections: getCmsContentType('live_event')!.defaultSections,
  },
  {
    id: 'creator_review',
    label: 'Creator Review',
    description: 'Creator profile, media gallery, verdict, and product links.',
    icon: '⭐',
    contentType: 'product_review',
    defaultSections: getCmsContentType('product_review')!.defaultSections,
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Long-form editorial with gallery and related content.',
    icon: '📰',
    contentType: 'editorial',
    defaultSections: getCmsContentType('editorial')!.defaultSections,
  },
  {
    id: 'service_promotion',
    label: 'Service Promotion',
    description: 'Service showcase with brand card and booking CTA.',
    icon: '🛎',
    contentType: 'service_promotion',
    defaultSections: getCmsContentType('service_promotion')!.defaultSections,
  },
];

export function getCmsTemplate(id: string): CmsTemplateDefinition | undefined {
  return CMS_TEMPLATE_REGISTRY.find((t) => t.id === id);
}
