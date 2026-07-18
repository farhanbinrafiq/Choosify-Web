/**
 * Collaboration Engine — Phase 2 (architecture only, no backend)
 */

export type SpotlightCollaborationRole =
  | 'publisher'
  | 'creator'
  | 'brand'
  | 'official_partner'
  | 'distributor'
  | 'retailer'
  | 'editor'
  | 'moderator'
  | 'sponsor'
  | 'support';

export type SpotlightCollaborationInviteStatus =
  | 'draft'
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'revoked';

export type SpotlightCollaborationApprovalStatus =
  | 'not_required'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'changes_requested';

export interface SpotlightCollaborationPermission {
  canEdit: boolean;
  canPublish: boolean;
  canInvite: boolean;
  canApprove: boolean;
  canAttachProducts: boolean;
  canAttachMedia: boolean;
  canViewAnalytics: boolean;
  canMonetize: boolean;
}

export const COLLABORATION_ROLE_PERMISSIONS: Record<SpotlightCollaborationRole, SpotlightCollaborationPermission> = {
  publisher: { canEdit: true, canPublish: true, canInvite: true, canApprove: true, canAttachProducts: true, canAttachMedia: true, canViewAnalytics: true, canMonetize: true },
  brand: { canEdit: true, canPublish: false, canInvite: true, canApprove: true, canAttachProducts: true, canAttachMedia: true, canViewAnalytics: true, canMonetize: true },
  creator: { canEdit: true, canPublish: false, canInvite: false, canApprove: false, canAttachProducts: true, canAttachMedia: true, canViewAnalytics: true, canMonetize: false },
  official_partner: { canEdit: false, canPublish: false, canInvite: false, canApprove: false, canAttachProducts: true, canAttachMedia: false, canViewAnalytics: true, canMonetize: false },
  distributor: { canEdit: false, canPublish: false, canInvite: false, canApprove: false, canAttachProducts: true, canAttachMedia: false, canViewAnalytics: true, canMonetize: false },
  retailer: { canEdit: false, canPublish: false, canInvite: false, canApprove: false, canAttachProducts: true, canAttachMedia: false, canViewAnalytics: false, canMonetize: false },
  editor: { canEdit: true, canPublish: false, canInvite: false, canApprove: false, canAttachProducts: false, canAttachMedia: true, canViewAnalytics: false, canMonetize: false },
  moderator: { canEdit: false, canPublish: false, canInvite: false, canApprove: true, canAttachProducts: false, canAttachMedia: false, canViewAnalytics: true, canMonetize: false },
  sponsor: { canEdit: false, canPublish: false, canInvite: false, canApprove: false, canAttachProducts: false, canAttachMedia: false, canViewAnalytics: true, canMonetize: true },
  support: { canEdit: false, canPublish: false, canInvite: false, canApprove: false, canAttachProducts: false, canAttachMedia: false, canViewAnalytics: false, canMonetize: false },
};

export const COLLABORATION_ROLE_LABELS: Record<SpotlightCollaborationRole, string> = {
  publisher: 'Publisher',
  creator: 'Creator',
  brand: 'Brand',
  official_partner: 'Official Partner',
  distributor: 'Distributor',
  retailer: 'Retailer',
  editor: 'Editor',
  moderator: 'Moderator',
  sponsor: 'Sponsor',
  support: 'Support',
};

/** Invitation architecture */
export interface SpotlightCollaborationInvite {
  inviteId: string;
  campaignId?: string;
  contentId?: string;
  fromPublisherId: string;
  toPublisherId: string;
  role: SpotlightCollaborationRole;
  status: SpotlightCollaborationInviteStatus;
  message?: string;
  invitedAt: string;
  respondedAt?: string;
  expiresAt?: string;
}

/** Approval architecture */
export interface SpotlightCollaborationApproval {
  approvalId: string;
  campaignId?: string;
  contentId?: string;
  contributorPublisherId: string;
  requestedBy: string;
  status: SpotlightCollaborationApprovalStatus;
  reviewerId?: string;
  notes?: string;
  requestedAt: string;
  resolvedAt?: string;
}

/** Active collaborator on content/campaign */
export interface SpotlightCollaborationMember {
  publisherId: string;
  name: string;
  logoUrl?: string;
  role: SpotlightCollaborationRole;
  isVerified: boolean;
  permissions: SpotlightCollaborationPermission;
  contributionTypes: string[];
  profileHref?: string;
  joinedAt: string;
}

/** Brand × Creator collaboration hub (CTO) */
export interface SpotlightBrandCreatorCollaboration {
  collaborationId: string;
  brandPublisherId: string;
  campaignId: string;
  campaignName: string;
  invitedCreators: Array<{
    creatorPublisherId: string;
    creatorName: string;
    role: SpotlightCollaborationRole;
    contributionType: string;
    status: SpotlightCollaborationInviteStatus;
    contentId?: string;
  }>;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
}

export interface SpotlightCollaborationEngineContract {
  invite(req: Omit<SpotlightCollaborationInvite, 'inviteId' | 'invitedAt' | 'status'>): Promise<SpotlightCollaborationInvite>;
  respond(inviteId: string, accept: boolean): Promise<void>;
  approve(approvalId: string, approved: boolean, reviewerId: string): Promise<void>;
  listMembers(campaignId: string): Promise<SpotlightCollaborationMember[]>;
}
