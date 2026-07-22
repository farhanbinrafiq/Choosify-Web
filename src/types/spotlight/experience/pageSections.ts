/**
 * CMS-driven Spotlight Content Page sections — LE-005 UX-08
 * The frontend renders only sections listed in each content record's configuration.
 */

export const SPOTLIGHT_PAGE_SECTION_IDS = [
  'hero_media',
  'content_summary',
  'media_gallery',
  'description',
  'schedule',
  'live_status',
  'countdown',
  'winner',
  'why_it_won',
  'verdict',
  'takeaways',
  'pros',
  'cons',
  'top_picks',
  'top_3',
  'top_5',
  /** Config-driven Content Detail — Items Mentioned (category-labeled) */
  'items_mentioned',
  'brands_mentioned',
  'how_review_was_made',
  'what_is_discussed',
  'products_reviewed',
  'services_reviewed',
  'comparison_table',
  'specifications',
  'pricing',
  'associated_products',
  'associated_services',
  'download_attachments',
  'image_gallery',
  'video_gallery',
  'timeline',
  'announcements',
  'brand_profile_card',
  'creator_profile_card',
  'related_spotlight',
  'related_products',
  'related_services',
  'related_brands',
  'tags',
  'share',
] as const;

export type SpotlightPageSectionId = (typeof SPOTLIGHT_PAGE_SECTION_IDS)[number];

/** Per-section CMS visibility — editors control individual pages */
export interface SpotlightPageSectionConfig {
  id: SpotlightPageSectionId;
  visible: boolean;
  order?: number;
}

/** Canonical page shell order (fixed visual structure) */
export const SPOTLIGHT_PAGE_SHELL_ORDER: SpotlightPageSectionId[] = [
  'hero_media',
  'content_summary',
  'live_status',
  'countdown',
  'schedule',
  'description',
  'media_gallery',
  'image_gallery',
  'video_gallery',
  'winner',
  'why_it_won',
  'verdict',
  'takeaways',
  'pros',
  'cons',
  'top_picks',
  'top_3',
  'top_5',
  'items_mentioned',
  'brands_mentioned',
  'how_review_was_made',
  'what_is_discussed',
  'comparison_table',
  'specifications',
  'products_reviewed',
  'services_reviewed',
  'pricing',
  'associated_products',
  'associated_services',
  'download_attachments',
  'timeline',
  'announcements',
  'brand_profile_card',
  'creator_profile_card',
  'tags',
  'share',
  'related_spotlight',
  'related_products',
  'related_services',
  'related_brands',
];
