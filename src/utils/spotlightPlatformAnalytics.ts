/** ES-008 prep — Spotlight platform integration analytics */
export type SpotlightPlatformAnalyticsEvent =
  | 'homepage_to_spotlight'
  | 'categories_to_spotlight'
  | 'brand_to_spotlight'
  | 'product_to_spotlight'
  | 'search_to_spotlight'
  | 'creator_to_spotlight'
  | 'hero_carousel_click'
  | 'discover_learn_tab'
  | 'featured_brands_tab';

export function trackSpotlightPlatformEvent(
  type: SpotlightPlatformAnalyticsEvent,
  metadata?: Record<string, unknown>,
) {
  if (import.meta.env.DEV) {
    console.debug('[spotlight-platform]', type, metadata);
  }
}
