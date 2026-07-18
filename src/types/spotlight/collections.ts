/**
 * Firestore collection names for the Spotlight campaign platform.
 * Architecture-only — no migration or seed data in LE-005.1.
 *
 * Catalog collections (products, brands, categories) remain the single source
 * of truth for merchandising data. Spotlight collections store campaign metadata
 * and references only.
 */
export const SPOTLIGHT_COLLECTIONS = {
  /** Core campaign documents */
  CAMPAIGNS: 'spotlight_campaigns',
  /** Immutable version snapshots for rollback */
  CAMPAIGN_VERSIONS: 'spotlight_campaign_versions',
  /** Campaign hierarchy collections (Samsung Launch → Galaxy Phone…) */
  CAMPAIGN_COLLECTIONS: 'spotlight_campaign_collections',
  /** Locale-specific content overrides */
  CAMPAIGN_LOCALIZATIONS: 'spotlight_campaign_localizations',
  /** Normalized media assets (videos, images, carousels) */
  MEDIA: 'spotlight_media',
  /** Reusable campaign layout presets (future CMS templates) */
  TEMPLATES: 'spotlight_templates',
  /** Campaign taxonomy / grouping (seasonal, festival, vertical) */
  CATEGORIES: 'spotlight_categories',
  /** Aggregated metrics snapshots (future ES-008) */
  CAMPAIGN_METRICS: 'spotlight_campaign_metrics',
  /** Placement slot assignments linking campaigns to surfaces */
  PLACEMENTS: 'spotlight_placements',
  /** Audit trail for lifecycle transitions (future ES-009) */
  MODERATION_EVENTS: 'spotlight_moderation_events',
} as const;

export type SpotlightCollectionName =
  (typeof SPOTLIGHT_COLLECTIONS)[keyof typeof SPOTLIGHT_COLLECTIONS];

/**
 * Recommended composite / single-field indexes for Firestore queries at scale.
 * Backend implements these; frontend documents the contract.
 */
export const SPOTLIGHT_INDEX_FIELDS = {
  CAMPAIGN_STATUS: 'status',
  CAMPAIGN_TYPE: 'campaignType',
  CAMPAIGN_SLUG: 'campaignSlug',
  PRIORITY: 'priority',
  FEATURED_UNTIL: 'featuredUntil',
  SCHEDULE_START: 'schedule.startAt',
  SCHEDULE_END: 'schedule.endAt',
  VISIBILITY: 'visibility',
  IS_SPONSORED: 'isSponsored',
  PRIMARY_PRODUCT_ID: 'primaryProductId',
  LINKED_BRAND_IDS: 'linkedBrandIds',
  PLACEMENT_SURFACE: 'placementRules.surfaces',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  CAMPAIGN_OBJECTIVE: 'objective',
  APPROVAL_STAGE: 'approvalStage',
  CAMPAIGN_HEALTH_SCORE: 'campaignHealthScore',
  PARENT_CAMPAIGN_ID: 'relationships.parentCampaignId',
  COLLECTION_ID: 'relationships.collectionId',
} as const;

/** Default page size for campaign list queries */
export const SPOTLIGHT_DEFAULT_PAGE_SIZE = 24;

/** Maximum linked products per campaign (guardrail for card/detail UX) */
export const SPOTLIGHT_MAX_LINKED_PRODUCTS = 50;
