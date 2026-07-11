/**
 * Creator ecosystem architecture — no backend
 */

import type { SpotlightContentType } from './contentTypes';

export type SpotlightCreatorPublishableType = Extract<
  SpotlightContentType,
  | 'creator_review'
  | 'live'
  | 'campaign'
  | 'buying_guide'
  | 'tips'
  | 'recommendation'
  | 'tutorial'
>;

export const SPOTLIGHT_CREATOR_PUBLISHABLE_TYPES: SpotlightCreatorPublishableType[] = [
  'creator_review',
  'live',
  'campaign',
  'buying_guide',
  'tips',
  'recommendation',
  'tutorial',
];

export interface SpotlightCreatorPublishingProfile {
  creatorId: string;
  displayName: string;
  publishableTypes: SpotlightCreatorPublishableType[];
  invitedBrandIds: string[];
  collaborationInviteIds: string[];
  reputationScore?: number;
}
