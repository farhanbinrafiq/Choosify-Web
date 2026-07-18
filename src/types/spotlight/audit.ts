import type { SpotlightApprovalStageRecord } from './approval';

/**
 * Extended audit metadata for moderation and compliance.
 * Root-level createdBy/approvedBy remain for Firestore index queries.
 */
export interface SpotlightCampaignAudit {
  updatedBy?: string;
  publishedBy?: string;
  archivedBy?: string;
  moderatedBy?: string;
  lastModeratedAt?: string;
  approvalComment?: string;
  /** Canonical rejection reason — root rejectedReason mirrors for backward compat */
  rejectionReason?: string;
  /** Multi-stage approval history (CTO: seller → moderator → marketing → legal) */
  approvalHistory?: SpotlightApprovalStageRecord[];
}
