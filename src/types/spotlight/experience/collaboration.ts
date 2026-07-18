/**
 * Collaboration model (CTO) — multiple contributors per Spotlight item
 */

export type SpotlightCollaboratorRole =
  | 'owner'
  | 'collaborating_brand'
  | 'creator'
  | 'official_distributor'
  | 'marketplace_editor'
  | 'sponsor';

export interface SpotlightCollaborator {
  publisherId: string;
  role: SpotlightCollaboratorRole;
  name: string;
  logoUrl?: string;
  isVerified: boolean;
  profileHref?: string;
}

export const SPOTLIGHT_COLLABORATOR_ROLE_LABELS: Record<SpotlightCollaboratorRole, string> = {
  owner: 'Publisher',
  collaborating_brand: 'Brand Partner',
  creator: 'Creator',
  official_distributor: 'Official Distributor',
  marketplace_editor: 'Editor',
  sponsor: 'Sponsor',
};

/** Brand ↔ creator invitation architecture (no backend) */
export interface SpotlightCreatorCollaborationInvite {
  inviteId: string;
  brandPublisherId: string;
  creatorPublisherId: string;
  campaignId?: string;
  contentId?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedAt: string;
  respondedAt?: string;
}
