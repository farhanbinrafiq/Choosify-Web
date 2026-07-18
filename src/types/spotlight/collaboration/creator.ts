/**
 * Creator commerce — publishable types with attached products
 */

import type { SpotlightContentType } from '../experience/contentTypes';
import type { SpotlightCollaborationRole } from './engine';

export type SpotlightCreatorPublishableContentType = Extract<
  SpotlightContentType,
  | 'creator_review'
  | 'live'
  | 'tutorial'
  | 'buying_guide'
  | 'recommendation'
  | 'campaign'
  | 'comparison'
  | 'brand_story'
  | 'product_review'
>;

export const CREATOR_PUBLISHABLE_TYPES: SpotlightCreatorPublishableContentType[] = [
  'creator_review',
  'live',
  'tutorial',
  'buying_guide',
  'recommendation',
  'campaign',
  'comparison',
  'brand_story',
  'product_review',
];

export interface SpotlightCreatorPublishingRequest {
  creatorPublisherId: string;
  contentType: SpotlightCreatorPublishableContentType;
  headline: string;
  productIds: string[];
  serviceIds?: string[];
  campaignId?: string;
  brandCollaborationId?: string;
}

export interface SpotlightCreatorCommerceProfile {
  creatorPublisherId: string;
  publishableTypes: SpotlightCreatorPublishableContentType[];
  attachedProductIds: string[];
  collaborationRoles: SpotlightCollaborationRole[];
  brandInviteIds: string[];
}
