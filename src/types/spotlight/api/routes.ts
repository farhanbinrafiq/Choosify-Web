/**
 * Future REST endpoint paths — documentation only, LE-005.3.2
 */

export const SPOTLIGHT_API_BASE = '/api/v1/spotlight' as const;

export const SPOTLIGHT_API_ROUTES = {
  // Campaigns
  CAMPAIGNS: SPOTLIGHT_API_BASE,
  CAMPAIGN_BY_ID: `${SPOTLIGHT_API_BASE}/:campaignId`,
  CAMPAIGN_SEARCH: `${SPOTLIGHT_API_BASE}/search`,
  CAMPAIGN_DUPLICATE: `${SPOTLIGHT_API_BASE}/:campaignId/duplicate`,
  CAMPAIGN_SUBMIT: `${SPOTLIGHT_API_BASE}/:campaignId/submit`,
  CAMPAIGN_APPROVE: `${SPOTLIGHT_API_BASE}/:campaignId/approve`,
  CAMPAIGN_REJECT: `${SPOTLIGHT_API_BASE}/:campaignId/reject`,
  CAMPAIGN_ARCHIVE: `${SPOTLIGHT_API_BASE}/:campaignId/archive`,
  CAMPAIGN_RESTORE: `${SPOTLIGHT_API_BASE}/:campaignId/restore`,
  CAMPAIGN_PUBLISH: `${SPOTLIGHT_API_BASE}/:campaignId/publish`,
  CAMPAIGN_SCHEDULE: `${SPOTLIGHT_API_BASE}/:campaignId/schedule`,
  CAMPAIGN_PREVIEW: `${SPOTLIGHT_API_BASE}/:campaignId/preview`,
  CAMPAIGN_METRICS: `${SPOTLIGHT_API_BASE}/:campaignId/metrics`,
  CAMPAIGN_HEALTH: `${SPOTLIGHT_API_BASE}/:campaignId/health`,
  CAMPAIGN_PRODUCTS: `${SPOTLIGHT_API_BASE}/:campaignId/products`,
  // Media
  MEDIA: `${SPOTLIGHT_API_BASE}/media`,
  MEDIA_BY_ID: `${SPOTLIGHT_API_BASE}/media/:mediaId`,
  CAMPAIGN_MEDIA: `${SPOTLIGHT_API_BASE}/:campaignId/media`,
  // Assets
  ASSETS: `${SPOTLIGHT_API_BASE}/:campaignId/assets`,
  ASSET_BY_ID: `${SPOTLIGHT_API_BASE}/:campaignId/assets/:assetId`,
  // Templates
  TEMPLATES: `${SPOTLIGHT_API_BASE}/templates`,
  TEMPLATE_BY_ID: `${SPOTLIGHT_API_BASE}/templates/:templateId`,
  // Versions
  VERSIONS: `${SPOTLIGHT_API_BASE}/:campaignId/versions`,
  VERSION_BY_NUMBER: `${SPOTLIGHT_API_BASE}/:campaignId/versions/:version`,
  // SEO
  SEO: `${SPOTLIGHT_API_BASE}/:campaignId/seo`,
  // Localization
  LOCALIZATION: `${SPOTLIGHT_API_BASE}/:campaignId/localization`,
  LOCALIZATION_LOCALE: `${SPOTLIGHT_API_BASE}/:campaignId/localization/:locale`,
  // Targeting
  TARGETING: `${SPOTLIGHT_API_BASE}/:campaignId/targeting`,
  // Publish / schedule (aliases)
  PUBLISH: `${SPOTLIGHT_API_BASE}/publish`,
  SCHEDULE: `${SPOTLIGHT_API_BASE}/schedule`,
} as const;

export type SpotlightApiRoute = (typeof SPOTLIGHT_API_ROUTES)[keyof typeof SPOTLIGHT_API_ROUTES];
