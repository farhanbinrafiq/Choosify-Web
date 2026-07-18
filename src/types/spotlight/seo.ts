/**
 * Campaign SEO model — architecture only, no rendering in LE-005.3.1.
 */

export type SpotlightRobotsDirective =
  | 'index,follow'
  | 'noindex,follow'
  | 'index,nofollow'
  | 'noindex,nofollow';

export type SpotlightTwitterCardType = 'summary' | 'summary_large_image' | 'player' | 'app';

/** Slug change record for redirects */
export interface SpotlightSlugHistoryEntry {
  slug: string;
  changedAt: string;
  changedBy?: string;
}

/** JSON-LD structured data placeholder — schema.org types resolved at render time */
export interface SpotlightStructuredData {
  '@type': 'Product' | 'Offer' | 'Event' | 'Article' | 'CollectionPage' | string;
  payload: Record<string, unknown>;
}

export interface SpotlightCampaignSeo {
  metaTitle?: string;
  metaDescription?: string;
  /** Public URL slug — mirrors campaignSlug on root for query convenience */
  slug?: string;
  slugHistory?: SpotlightSlugHistoryEntry[];
  canonicalUrl?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterCard?: SpotlightTwitterCardType;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: SpotlightRobotsDirective;
  structuredData?: SpotlightStructuredData[];
}
