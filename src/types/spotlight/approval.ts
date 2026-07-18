/**
 * Multi-stage approval levels — architecture only.
 * Existing status workflow unchanged; approvalStage tracks granular progress.
 */

export type SpotlightApprovalStage =
  | 'draft'
  | 'seller_review'
  | 'moderator_review'
  | 'marketing_review'
  | 'legal_review'
  | 'approved';

export interface SpotlightApprovalStageRecord {
  stage: SpotlightApprovalStage;
  actorId?: string;
  actorRole?: string;
  startedAt?: string;
  completedAt?: string;
  comment?: string;
  action?: 'approve' | 'reject' | 'request_changes' | 'skip';
}

/** Ordered approval pipeline — legal_review is optional/future */
export const SPOTLIGHT_APPROVAL_PIPELINE: readonly SpotlightApprovalStage[] = [
  'draft',
  'seller_review',
  'moderator_review',
  'marketing_review',
  'legal_review',
  'approved',
] as const;
