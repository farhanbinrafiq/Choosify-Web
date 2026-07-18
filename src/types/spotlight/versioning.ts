/**
 * Campaign version history — architecture for future rollback.
 * Snapshots stored in `spotlight_campaign_versions` subcollection.
 * No rollback UI in LE-005.3.1.
 */

export interface SpotlightCampaignVersioning {
  /** Monotonic document version — increments on each save */
  version: number;
  /** Version number last published to public surfaces */
  publishedVersion?: number;
  /** Working draft version (may differ from published while editing live) */
  draftVersion?: number;
  lastPublishedAt?: string;
  lastPublishedBy?: string;
  lastEditedBy?: string;
}

/** Immutable snapshot for rollback (stored separately from main campaign doc) */
export interface SpotlightCampaignVersionSnapshot {
  campaignId: string;
  version: number;
  snapshotAt: string;
  snapshotBy: string;
  /** Serialized campaign payload at this version */
  payload: Record<string, unknown>;
  changeSummary?: string;
}

/** Default versioning state for new campaigns */
export const SPOTLIGHT_DEFAULT_VERSIONING: SpotlightCampaignVersioning = {
  version: 1,
  draftVersion: 1,
};
