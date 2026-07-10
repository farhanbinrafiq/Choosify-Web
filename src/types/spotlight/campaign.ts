import type {
  SpotlightCampaignStatus,
  SpotlightCampaignVisibility,
  SpotlightCampaignSchedule,
  SpotlightCampaignCta,
  SpotlightPlacementRule,
} from './lifecycle';
import type { SpotlightCampaignType } from './campaignTypes';
import type { SpotlightCampaignVersioning } from './versioning';
import type { SpotlightCampaignObjective } from './objectives';
import type { SpotlightCampaignSeo } from './seo';
import type { SpotlightCampaignLocalization } from './localization';
import type { SpotlightAudienceTargeting } from './targeting';
import type { SpotlightCampaignBudget } from './budget';
import type { SpotlightCampaignRelationships } from './relationships';
import type { SpotlightCampaignAsset } from './assets';
import type { SpotlightCampaignKeywords } from './keywords';
import type { SpotlightCampaignLandingPageConfig } from './landingPage';
import type { SpotlightCampaignAudit } from './audit';
import type { SpotlightApprovalStage } from './approval';
import type { SpotlightCampaignAiMetadata } from './aiMetadata';
import type { SpotlightCampaignHealth } from './health';

/**
 * Core Spotlight campaign document.
 *
 * IMPORTANT: Product name, price, specs, images, brand, category, and inventory
 * are NEVER duplicated here. Use linkedProductIds / primaryProductId and
 * resolve from CatalogProduct at render time.
 */
export interface SpotlightCampaign {
  campaignId: string;
  campaignName: string;
  campaignSlug: string;
  campaignType: SpotlightCampaignType;
  status: SpotlightCampaignStatus;

  headline: string;
  subHeadline?: string;
  shortDescription?: string;

  /** Catalog product IDs — never embed product payloads */
  linkedProductIds: string[];
  /** When multiple products — drives homepage card, thumbnail, price, CTA */
  primaryProductId?: string;
  /** Catalog brand IDs */
  linkedBrandIds: string[];
  /** Catalog category IDs */
  linkedCategoryIds: string[];
  /** Optional buying guide reference */
  linkedGuideIds?: string[];
  /** Future creator hub reference */
  linkedCreatorIds?: string[];

  /** Ordered media asset references (resolve from spotlight_media) */
  media: string[];

  cta: SpotlightCampaignCta;
  priority: number;
  placementRules: SpotlightPlacementRule;
  /** @deprecated Prefer keywords.campaignTags — kept for backward compatibility */
  campaignTags: string[];
  visibility: SpotlightCampaignVisibility;
  isSponsored: boolean;
  featuredUntil?: string;
  schedule: SpotlightCampaignSchedule;

  /** External analytics correlation id (future ES-008) */
  analyticsId?: string;
  /** Optional template preset used to create this campaign */
  templateId?: string;

  createdBy: string;
  approvedBy?: string;
  /** @deprecated Prefer audit.rejectionReason — kept for backward compatibility */
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;

  // ── LE-005.3.1 enterprise extensions (all optional) ──────────────────

  versioning?: SpotlightCampaignVersioning;
  objective?: SpotlightCampaignObjective;
  seo?: SpotlightCampaignSeo;
  localization?: SpotlightCampaignLocalization;
  targeting?: SpotlightAudienceTargeting;
  budget?: SpotlightCampaignBudget;
  relationships?: SpotlightCampaignRelationships;
  assets?: SpotlightCampaignAsset[];
  keywords?: SpotlightCampaignKeywords;
  landingPage?: SpotlightCampaignLandingPageConfig;
  audit?: SpotlightCampaignAudit;
  /** Multi-stage approval progress (CTO: seller → moderator → marketing → legal) */
  approvalStage?: SpotlightApprovalStage;
  aiMetadata?: SpotlightCampaignAiMetadata;
  /** Denormalized health score 0–100 for list queries */
  campaignHealthScore?: number;
  health?: SpotlightCampaignHealth;
}

/**
 * Lightweight campaign summary for list views / pagination.
 * Avoids loading full media arrays on index queries.
 */
export interface SpotlightCampaignSummary {
  campaignId: string;
  campaignName: string;
  campaignSlug: string;
  campaignType: SpotlightCampaignType;
  status: SpotlightCampaignStatus;
  headline: string;
  primaryProductId?: string;
  thumbnailMediaId?: string;
  priority: number;
  isSponsored: boolean;
  featuredUntil?: string;
  schedule: SpotlightCampaignSchedule;
  objective?: SpotlightCampaignObjective;
  campaignHealthScore?: number;
  approvalStage?: SpotlightApprovalStage;
  updatedAt: string;
}

/** Paginated list response contract (API / Firestore cursor pagination) */
export interface SpotlightCampaignPage {
  items: SpotlightCampaignSummary[];
  nextCursor?: string;
  totalEstimate?: number;
  pageSize: number;
}
