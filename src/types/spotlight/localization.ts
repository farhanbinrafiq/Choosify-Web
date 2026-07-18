import type { SpotlightCampaignCta } from './lifecycle';
import type { SpotlightCampaignSeo } from './seo';

/**
 * Supported locale codes — extensible for future markets.
 */
export type SpotlightLocaleCode =
  | 'en'
  | 'bn'
  | 'ar'
  | 'hi'
  | string;

export interface SpotlightLocalizedContent {
  headline?: string;
  subHeadline?: string;
  shortDescription?: string;
  cta?: SpotlightCampaignCta;
  seo?: SpotlightCampaignSeo;
}

/**
 * Multi-language campaign content.
 * Default language content may also exist on the root campaign document.
 */
export interface SpotlightCampaignLocalization {
  defaultLanguage: SpotlightLocaleCode;
  availableLanguages: SpotlightLocaleCode[];
  /** Locale-keyed overrides — stored inline or in `spotlight_campaign_localizations` */
  locales: Partial<Record<SpotlightLocaleCode, SpotlightLocalizedContent>>;
}

export const SPOTLIGHT_DEFAULT_LOCALE: SpotlightLocaleCode = 'en';
