/**
 * Brand collaboration flows — invite creators, sellers, partners
 */

import type { SpotlightCollaborationInviteStatus } from './engine';

export type SpotlightBrandCollaborationAction =
  | 'invite_creator'
  | 'invite_seller'
  | 'invite_partner'
  | 'approve_collaboration'
  | 'feature_creator_content'
  | 'reject_collaboration';

export interface SpotlightBrandCollaborationPolicy {
  brandPublisherId: string;
  allowCreatorInvites: boolean;
  allowSellerInvites: boolean;
  requireApproval: boolean;
  autoFeatureCreatorContent: boolean;
  maxActiveCollaborations: number;
}

export interface SpotlightBrandCollaborationRecord {
  recordId: string;
  brandPublisherId: string;
  targetPublisherId: string;
  targetType: 'creator' | 'seller' | 'partner';
  action: SpotlightBrandCollaborationAction;
  campaignId?: string;
  contentId?: string;
  status: SpotlightCollaborationInviteStatus;
  createdAt: string;
}
