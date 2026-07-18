/**
 * ES-009 Moderation contract — LE-005.3.2
 */

import type { SpotlightApiMeta } from '../api/common';

export type SpotlightModerationAction =
  | 'submit'
  | 'approve'
  | 'reject'
  | 'request_changes'
  | 'moderate_media'
  | 'moderate_campaign'
  | 'moderate_assets'
  | 'flag'
  | 'archive';

export interface SpotlightModerationRecord {
  eventId: string;
  campaignId: string;
  action: SpotlightModerationAction;
  actorId: string;
  actorRole?: string;
  reason?: string;
  comment?: string;
  targetType?: 'campaign' | 'media' | 'asset';
  targetId?: string;
  createdAt: string;
}

export interface SpotlightFraudSignal {
  signalId: string;
  campaignId: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: string;
}

export interface SpotlightTrustScoreHook {
  campaignId: string;
  sellerId: string;
  score: number;
  factors: Record<string, number>;
  calculatedAt: string;
}

export interface SpotlightModerationSubmitRequest {
  campaignId: string;
  actorId: string;
  comment?: string;
}

export interface SpotlightModerationDecisionRequest {
  campaignId: string;
  actorId: string;
  reason?: string;
  comment?: string;
}

export interface SpotlightModerationHistoryResponse {
  data: SpotlightModerationRecord[];
  meta: SpotlightApiMeta;
}

export interface SpotlightModerationServiceContract {
  submit(req: SpotlightModerationSubmitRequest): Promise<void>;
  approve(req: SpotlightModerationDecisionRequest): Promise<void>;
  reject(req: SpotlightModerationDecisionRequest): Promise<void>;
  requestChanges(req: SpotlightModerationDecisionRequest): Promise<void>;
  moderateMedia(campaignId: string, mediaId: string, actorId: string, approved: boolean): Promise<void>;
  moderateCampaign(campaignId: string, actorId: string, approved: boolean): Promise<void>;
  moderateAssets(campaignId: string, assetId: string, actorId: string, approved: boolean): Promise<void>;
  getHistory(campaignId: string): Promise<SpotlightModerationHistoryResponse>;
  getFraudSignals(campaignId: string): Promise<SpotlightFraudSignal[]>;
  getTrustScore(campaignId: string): Promise<SpotlightTrustScoreHook | null>;
}

/** @deprecated Use SpotlightModerationRecord */
export interface SpotlightModerationEvent extends SpotlightModerationRecord {}

/** @deprecated Use SpotlightModerationServiceContract fields */
export interface SpotlightModerationRef {
  campaignId: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reviewerId?: string;
  notes?: string;
  reviewedAt?: string;
}
