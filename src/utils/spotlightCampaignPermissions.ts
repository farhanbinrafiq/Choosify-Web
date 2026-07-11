import type { UserRole } from '../types/schemas';
import type { SpotlightCampaignActorRole } from '../types/spotlight/cms';
import type { SpotlightCampaignStatus } from '../types/spotlight/lifecycle';

export function mapUserRoleToCampaignActor(role: UserRole): SpotlightCampaignActorRole | null {
  if (role === 'admin') return 'admin';
  if (role === 'moderator') return 'moderator';
  if (role === 'seller' || role === 'brand') return 'seller';
  return null;
}

export function canActOnCampaigns(role: UserRole): boolean {
  return mapUserRoleToCampaignActor(role) !== null;
}

export function canCreateCampaign(actor: SpotlightCampaignActorRole): boolean {
  return actor === 'seller' || actor === 'admin';
}

export function canEditCampaign(
  actor: SpotlightCampaignActorRole,
  status: SpotlightCampaignStatus,
  createdBy: string,
  userId: string,
): boolean {
  if (actor === 'admin') return true;
  if (actor === 'seller' && createdBy === userId) {
    return ['draft', 'rejected', 'pending_review'].includes(status);
  }
  return false;
}

export function canSubmitForReview(actor: SpotlightCampaignActorRole, createdBy: string, userId: string) {
  return (actor === 'seller' && createdBy === userId) || actor === 'admin';
}

export function canModerate(actor: SpotlightCampaignActorRole) {
  return actor === 'admin';
}

export function canPublish(actor: SpotlightCampaignActorRole) {
  return actor === 'admin';
}

export function canArchive(actor: SpotlightCampaignActorRole) {
  return actor === 'admin' || actor === 'seller';
}

export function canDelete(actor: SpotlightCampaignActorRole) {
  return actor === 'admin';
}

export const PERMISSION_MATRIX = {
  seller: ['create', 'edit_draft', 'submit_review', 'view_own'],
  moderator: ['approve', 'reject', 'request_changes', 'view_all'],
  admin: ['full_access', 'schedule', 'publish', 'archive', 'delete'],
} as const;
