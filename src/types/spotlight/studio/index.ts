/**
 * Spotlight Publisher Studio — LE-005 Phase 5.3
 * Block-based experience builder contracts (frontend-only).
 */

import type { SpotlightContentType } from '../experience/contentTypes';

export type SpotlightExperienceStatus =
  | 'draft'
  | 'pending_review'
  | 'scheduled'
  | 'published'
  | 'live'
  | 'expired'
  | 'archived'
  | 'revision'
  | 'rejected';

export type SpotlightBlockCategory =
  | 'content'
  | 'media'
  | 'commerce'
  | 'live'
  | 'layout'
  | 'relationship';

export type SpotlightBlockType =
  | 'heading'
  | 'paragraph'
  | 'rich_text'
  | 'quote'
  | 'checklist'
  | 'divider'
  | 'gallery'
  | 'single_image'
  | 'video'
  | 'embedded_video'
  | 'embed_facebook'
  | 'embed_youtube'
  | 'embed_tiktok'
  | 'embed_instagram'
  | 'pdf'
  | 'audio'
  | 'button'
  | 'cta'
  | 'timeline'
  | 'countdown'
  | 'offer'
  | 'coupon'
  | 'announcement'
  | 'faq'
  | 'comparison_table'
  | 'pros_cons'
  | 'spec_table'
  | 'feature_list'
  | 'highlight_box'
  | 'alert'
  | 'related_content'
  | 'creator_profile'
  | 'brand_profile'
  | 'service_card'
  | 'location'
  | 'contact'
  | 'tags'
  | 'products'
  | 'services'
  | 'collections'
  | 'series'
  | 'live_session'
  | 'replay'
  | 'product_card'
  | 'brand_card'
  | 'compare_table'
  | 'wishlist'
  | 'bundle';

export interface SpotlightBlock {
  blockId: string;
  type: SpotlightBlockType;
  category: SpotlightBlockCategory;
  data: Record<string, unknown>;
  order: number;
}

export interface SpotlightExperienceSeo {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonical?: string;
  keywords: string[];
  ogImage?: string;
  twitterCard: 'summary' | 'summary_large_image';
  schemaType: string;
  index: boolean;
  follow: boolean;
  structuredData?: Record<string, unknown>;
}

export interface SpotlightExperienceDiscovery {
  collectionIds: string[];
  seriesIds: string[];
  categoryIds: string[];
  tags: string[];
  relatedContentIds: string[];
  featured: boolean;
  trending: boolean;
  pinned: boolean;
  recommended: boolean;
  placements: string[];
}

export interface SpotlightExperienceRelationships {
  productIds: string[];
  brandIds: string[];
  creatorIds: string[];
  categoryIds: string[];
  serviceIds: string[];
  collectionIds: string[];
  seriesIds: string[];
  campaignIds: string[];
  guideIds: string[];
  reviewIds: string[];
}

export interface SpotlightExperienceRevision {
  revisionId: string;
  savedAt: string;
  label: string;
  authorId: string;
}

export interface SpotlightExperienceDraft {
  experienceId?: string;
  /** Publisher-facing content type */
  publisherContentType: string;
  /** Maps to SpotlightContentType at publish */
  contentType: SpotlightContentType;
  title: string;
  headline: string;
  description: string;
  status: SpotlightExperienceStatus;
  blocks: SpotlightBlock[];
  seo: SpotlightExperienceSeo;
  discovery: SpotlightExperienceDiscovery;
  relationships: SpotlightExperienceRelationships;
  templateId?: string;
  blueprintId?: string;
  revisions: SpotlightExperienceRevision[];
  /** Legacy campaign wizard step (1-6) when using campaign flow */
  wizardStep?: number;
}

export type SpotlightPreviewMode =
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | 'homepage'
  | 'carousel'
  | 'content_page'
  | 'brand_page'
  | 'category_page'
  | 'product_page'
  | 'creator_page'
  | 'social';

export interface SpotlightPublisherContentTypeDefinition {
  id: string;
  label: string;
  icon: string;
  contentType: SpotlightContentType;
  /** Maps to campaign wizard type when persisted as campaign */
  campaignType?: string;
  group: 'editorial' | 'commerce' | 'live' | 'local' | 'community';
}
