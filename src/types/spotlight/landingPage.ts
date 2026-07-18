/**
 * Campaign landing page architecture — no frontend in LE-005.3.1.
 * Example URL: /spotlight/samsung-galaxy-launch
 */

export type SpotlightLandingSectionType =
  | 'hero'
  | 'media'
  | 'campaign_story'
  | 'featured_products'
  | 'campaign_collection'
  | 'buying_guide'
  | 'related_campaigns'
  | 'brand_information'
  | 'cta'
  | 'reviews';

export interface SpotlightLandingSection {
  sectionType: SpotlightLandingSectionType;
  enabled: boolean;
  displayOrder: number;
  /** Section-specific config (headline override, product limit, etc.) */
  config?: Record<string, unknown>;
}

export interface SpotlightCampaignLandingPageConfig {
  /** Public path segment — full path: /spotlight/{slug} */
  slug: string;
  enabled: boolean;
  sections: SpotlightLandingSection[];
  /** Custom theme token (future design system) */
  themeId?: string;
}

export const SPOTLIGHT_DEFAULT_LANDING_SECTIONS: SpotlightLandingSection[] = [
  { sectionType: 'hero', enabled: true, displayOrder: 0 },
  { sectionType: 'media', enabled: true, displayOrder: 1 },
  { sectionType: 'campaign_story', enabled: true, displayOrder: 2 },
  { sectionType: 'featured_products', enabled: true, displayOrder: 3 },
  { sectionType: 'campaign_collection', enabled: false, displayOrder: 4 },
  { sectionType: 'buying_guide', enabled: false, displayOrder: 5 },
  { sectionType: 'related_campaigns', enabled: true, displayOrder: 6 },
  { sectionType: 'brand_information', enabled: true, displayOrder: 7 },
  { sectionType: 'cta', enabled: true, displayOrder: 8 },
  { sectionType: 'reviews', enabled: false, displayOrder: 9 },
];
