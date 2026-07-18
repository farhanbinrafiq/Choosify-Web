import type { CmsContentTypeDefinition, CmsContentTypeId } from '../../types/marketing/cms';
import type { SpotlightPageSectionConfig, SpotlightPageSectionId } from '../../types/spotlight/experience/pageSections';
import { defaultSectionsForContentType } from '../spotlight/content/sectionManifestRegistry';
import type { SpotlightContentType } from '../../types/spotlight/experience/contentTypes';

function cfg(id: SpotlightPageSectionId, visible = true): SpotlightPageSectionConfig {
  return { id, visible };
}

const CMS_TO_SPOTLIGHT_TYPE: Partial<Record<CmsContentTypeId, SpotlightContentType>> = {
  product_review: 'product_review',
  buying_guide: 'buying_guide',
  brand_story: 'brand_story',
  brand_campaign: 'campaign',
  product_launch: 'new_launch',
  live_event: 'live',
  editorial: 'editorial',
  blog: 'editorial',
  offer: 'campaign',
  collection: 'editorial',
  series: 'editorial',
  announcement: 'announcement',
  service_promotion: 'whats_on',
  restaurant_promotion: 'event',
  hotel_promotion: 'event',
  travel_promotion: 'buying_guide',
};

function defaultSectionsFor(id: CmsContentTypeId): SpotlightPageSectionConfig[] {
  const spotlightType = CMS_TO_SPOTLIGHT_TYPE[id];
  if (spotlightType) {
    return defaultSectionsForContentType(spotlightType);
  }
  return [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('associated_products'),
    cfg('related_spotlight'),
  ];
}

export const CMS_CONTENT_TYPE_REGISTRY: CmsContentTypeDefinition[] = [
  {
    id: 'product_review',
    label: 'Product Review',
    icon: '⭐',
    group: 'editorial',
    fields: ['headline', 'summary', 'media', 'products', 'pros', 'cons', 'verdict', 'creator'],
    defaultSections: defaultSectionsFor('product_review'),
  },
  {
    id: 'buying_guide',
    label: 'Buying Guide',
    icon: '📖',
    group: 'editorial',
    fields: ['headline', 'summary', 'media', 'winner', 'top_picks', 'products', 'verdict'],
    defaultSections: defaultSectionsFor('buying_guide'),
  },
  {
    id: 'brand_story',
    label: 'Brand Story',
    icon: '🏢',
    group: 'commerce',
    fields: ['headline', 'summary', 'media', 'brand', 'timeline', 'gallery'],
    defaultSections: defaultSectionsFor('brand_story'),
  },
  {
    id: 'brand_campaign',
    label: 'Brand Campaign',
    icon: '📣',
    group: 'commerce',
    fields: ['headline', 'summary', 'media', 'brand', 'products', 'cta', 'schedule'],
    defaultSections: defaultSectionsFor('brand_campaign'),
  },
  {
    id: 'product_launch',
    label: 'Product Launch',
    icon: '🚀',
    group: 'commerce',
    fields: ['headline', 'summary', 'media', 'products', 'countdown', 'cta'],
    defaultSections: defaultSectionsFor('product_launch'),
  },
  {
    id: 'live_event',
    label: 'Live Event',
    icon: '🔴',
    group: 'live',
    fields: ['headline', 'summary', 'media', 'schedule', 'live_status', 'products'],
    defaultSections: defaultSectionsFor('live_event'),
  },
  {
    id: 'editorial',
    label: 'Editorial',
    icon: '📰',
    group: 'editorial',
    fields: ['headline', 'summary', 'media', 'description', 'related'],
    defaultSections: defaultSectionsFor('editorial'),
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: '✍',
    group: 'editorial',
    fields: ['headline', 'summary', 'media', 'description', 'creator', 'tags'],
    defaultSections: defaultSectionsFor('blog'),
  },
  {
    id: 'offer',
    label: 'Offer',
    icon: '🏷',
    group: 'promotion',
    fields: ['headline', 'summary', 'media', 'products', 'cta', 'schedule'],
    defaultSections: defaultSectionsFor('offer'),
  },
  {
    id: 'collection',
    label: 'Collection',
    icon: '📚',
    group: 'editorial',
    fields: ['headline', 'summary', 'media', 'products', 'collections'],
    defaultSections: defaultSectionsFor('collection'),
  },
  {
    id: 'series',
    label: 'Series',
    icon: '📺',
    group: 'editorial',
    fields: ['headline', 'summary', 'media', 'related', 'timeline'],
    defaultSections: defaultSectionsFor('series'),
  },
  {
    id: 'announcement',
    label: 'Announcement',
    icon: '📢',
    group: 'editorial',
    fields: ['headline', 'summary', 'media', 'schedule', 'cta'],
    defaultSections: defaultSectionsFor('announcement'),
  },
  {
    id: 'service_promotion',
    label: 'Service Promotion',
    icon: '🛎',
    group: 'local',
    fields: ['headline', 'summary', 'media', 'services', 'brand', 'cta'],
    defaultSections: defaultSectionsFor('service_promotion'),
  },
  {
    id: 'restaurant_promotion',
    label: 'Restaurant Promotion',
    icon: '🍽',
    group: 'local',
    fields: ['headline', 'summary', 'media', 'services', 'location', 'cta'],
    defaultSections: defaultSectionsFor('restaurant_promotion'),
  },
  {
    id: 'hotel_promotion',
    label: 'Hotel Promotion',
    icon: '🏨',
    group: 'local',
    fields: ['headline', 'summary', 'media', 'services', 'gallery', 'cta'],
    defaultSections: defaultSectionsFor('hotel_promotion'),
  },
  {
    id: 'travel_promotion',
    label: 'Travel Promotion',
    icon: '✈️',
    group: 'local',
    fields: ['headline', 'summary', 'media', 'services', 'timeline', 'top_picks'],
    defaultSections: defaultSectionsFor('travel_promotion'),
  },
];

export function getCmsContentType(id: CmsContentTypeId): CmsContentTypeDefinition | undefined {
  return CMS_CONTENT_TYPE_REGISTRY.find((t) => t.id === id);
}

export function cmsContentTypesByGroup(group: CmsContentTypeDefinition['group']) {
  return CMS_CONTENT_TYPE_REGISTRY.filter((t) => t.group === group);
}
