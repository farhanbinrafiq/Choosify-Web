import type { SpotlightCampaign } from './campaign';
import type { SpotlightPlacementSurface } from './placement';
import type {
  SpotlightCampaignStatus,
  SpotlightCampaignVisibility,
  SpotlightCampaignSchedule,
  SpotlightCampaignCta,
} from './lifecycle';
import type { SpotlightCampaignType } from './campaignTypes';
import type { SpotlightCampaignMerchandising } from './merchandising/model';

/** CMS folder labels — virtual folders, not separate DB collections */
export type SpotlightCampaignFolderId =
  | 'all'
  | 'my-campaigns'
  | 'drafts'
  | 'sponsored'
  | 'archived'
  | string;

export interface SpotlightCampaignFolder {
  folderId: string;
  name: string;
  icon?: string;
  isSystem?: boolean;
  createdBy?: string;
  createdAt: string;
}

export type SpotlightCampaignActorRole = 'seller' | 'moderator' | 'admin';

/** CMS-specific metadata not on public campaign documents */
export interface SpotlightCampaignCmsMeta {
  folderId?: string;
  sellerId?: string;
  sellerName?: string;
  brandName?: string;
  primaryMediaId?: string;
  moderatorNotes?: string;
  reviewerComments?: string;
}

/** Wizard draft persisted while creating/editing */
export interface SpotlightCampaignWizardDraft {
  campaignId?: string;
  step: 1 | 2 | 3 | 4 | 5 | 6;
  campaignName: string;
  campaignType: SpotlightCampaignType;
  brandId?: string;
  brandName?: string;
  sellerId?: string;
  sellerName?: string;
  shortDescription: string;
  headline: string;
  subHeadline?: string;
  mediaIds: string[];
  linkedProductIds: string[];
  primaryProductId?: string;
  linkedBrandIds: string[];
  linkedCategoryIds: string[];
  placementSurfaces: SpotlightPlacementSurface[];
  schedule: SpotlightCampaignSchedule;
  priority: number;
  isSponsored: boolean;
  featuredUntil?: string;
  visibility: SpotlightCampaignVisibility;
  campaignTags: string[];
  folderId?: string;
  cta: SpotlightCampaignCta;
  /** LE-005.4 merchandising engine state */
  merchandising?: SpotlightCampaignMerchandising;
  /** LE-005 Phase 5.3 — block editor state (session/local only, not Firestore) */
  experienceDraft?: import('./studio').SpotlightExperienceDraft;
}

export interface SpotlightCampaignListFilters {
  query?: string;
  status?: SpotlightCampaignStatus | 'all';
  campaignType?: SpotlightCampaignType | 'all';
  sponsorStatus?: 'all' | 'sponsored' | 'organic';
  scheduleStatus?: 'all' | 'active' | 'upcoming' | 'expired';
  brandId?: string;
  creatorId?: string;
  folderId?: SpotlightCampaignFolderId;
}

export type SpotlightCampaignSortKey =
  | 'updatedAt'
  | 'createdAt'
  | 'campaignName'
  | 'priority'
  | 'status'
  | 'campaignHealthScore';

export interface SpotlightCampaignListQuery {
  filters: SpotlightCampaignListFilters;
  sortBy: SpotlightCampaignSortKey;
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
  view: 'grid' | 'table';
}

/**
 * Extended campaign document for CMS storage.
 * Composes core campaign + CMS meta — no field duplication.
 */
export interface SpotlightCampaignRecord extends SpotlightCampaign, SpotlightCampaignCmsMeta {}

export const SYSTEM_CAMPAIGN_FOLDERS: SpotlightCampaignFolder[] = [
  { folderId: 'my-campaigns', name: 'My Campaigns', icon: '📁', isSystem: true, createdAt: '' },
  { folderId: 'drafts', name: 'Drafts', icon: '📁', isSystem: true, createdAt: '' },
  { folderId: 'sponsored', name: 'Sponsored', icon: '📁', isSystem: true, createdAt: '' },
  { folderId: 'archived', name: 'Archived', icon: '📁', isSystem: true, createdAt: '' },
];
