/**
 * LE-006.4 — Marketing CMS types (mock localStorage only)
 */

import type { SponsoredPlacementKind, SponsoredPlacementSurface } from '../commerce/sponsoredPlacement';
import type { SpotlightPageSectionConfig } from '../spotlight/experience/pageSections';
import type { SpotlightCampaignCta, SpotlightCampaignSchedule } from '../spotlight/lifecycle';
import type { SpotlightExperienceDraft } from '../spotlight/studio';

/** CMS-managed Spotlight content types */
export type CmsContentTypeId =
  | 'product_review'
  | 'buying_guide'
  | 'brand_story'
  | 'brand_campaign'
  | 'product_launch'
  | 'live_event'
  | 'editorial'
  | 'blog'
  | 'offer'
  | 'collection'
  | 'series'
  | 'announcement'
  | 'service_promotion'
  | 'restaurant_promotion'
  | 'hotel_promotion'
  | 'travel_promotion';

export type CmsContentStatus = 'draft' | 'scheduled' | 'published' | 'expired';

export type CmsAssociationKind = 'product' | 'service' | 'brand' | 'collection';

export interface CmsAssociationItem {
  id: string;
  kind: CmsAssociationKind;
  label: string;
  imageUrl?: string;
  isPrimary?: boolean;
  order: number;
}

/** Section-based Spotlight content record */
export interface MarketingContentRecord {
  contentId: string;
  title: string;
  slug: string;
  contentType: CmsContentTypeId;
  status: CmsContentStatus;
  headline: string;
  summary: string;
  pageSections: SpotlightPageSectionConfig[];
  associations: CmsAssociationItem[];
  mediaIds: string[];
  primaryMediaId?: string;
  schedule?: SpotlightCampaignSchedule;
  tags: string[];
  experienceDraft?: SpotlightExperienceDraft;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type SponsoredCampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'expired';

/** Sponsored Discovery campaign — mock only */
export interface SponsoredCampaignRecord {
  campaignId: string;
  name: string;
  campaignType: SponsoredPlacementKind;
  placements: SponsoredPlacementSurface[];
  priority: number;
  startDate: string;
  endDate: string;
  cta: SpotlightCampaignCta;
  mediaId?: string;
  brandId?: string;
  brandName?: string;
  productIds: string[];
  serviceIds: string[];
  categoryIds: string[];
  collectionIds: string[];
  status: SponsoredCampaignStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsCalendarEvent {
  eventId: string;
  title: string;
  date: string;
  status: CmsContentStatus | SponsoredCampaignStatus;
  kind: 'content' | 'sponsored';
  refId: string;
}

export interface CmsContentTypeDefinition {
  id: CmsContentTypeId;
  label: string;
  icon: string;
  group: 'editorial' | 'commerce' | 'live' | 'local' | 'promotion';
  /** CMS field keys exposed for this type */
  fields: string[];
  /** Default page sections */
  defaultSections: SpotlightPageSectionConfig[];
}

export interface CmsTemplateDefinition {
  id: string;
  label: string;
  description: string;
  icon: string;
  contentType: CmsContentTypeId;
  defaultSections: SpotlightPageSectionConfig[];
  experienceDraft?: Partial<SpotlightExperienceDraft>;
}

export type CmsPreviewMode =
  | 'spotlight_card'
  | 'spotlight_detail'
  | 'sponsored_card'
  | 'mobile'
  | 'desktop';
