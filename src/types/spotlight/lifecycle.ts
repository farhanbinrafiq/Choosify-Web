import type { SpotlightPlacementSurface } from './placement';
import type {
  SpotlightScheduleRecurrence,
  SpotlightScheduleBlackout,
} from './scheduling';

/**
 * Spotlight campaign lifecycle states.
 *
 * Draft → Pending Review → Approved → Scheduled → Published → Expired → Archived
 *                                    ↘ Rejected
 *
 * Granular multi-stage approval tracked separately via `approvalStage`.
 */
export type SpotlightCampaignStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'paused'
  | 'expired'
  | 'archived'
  | 'rejected';

export type SpotlightCampaignVisibility = 'public' | 'unlisted' | 'internal';

export interface SpotlightCampaignSchedule {
  /** ISO 8601 — when campaign becomes eligible for publish (alias: startDate) */
  startAt: string;
  /** ISO 8601 — when campaign auto-expires (alias: endDate) */
  endAt: string;
  /** IANA timezone for operator-facing schedule display */
  timezone?: string;
  /** Recurring campaign rules (future seasonal promotions) */
  recurrence?: SpotlightScheduleRecurrence;
  /** Dates when campaign is suppressed even within active window */
  blackoutDates?: SpotlightScheduleBlackout[];
  /** Auto-transition to expired status when endAt passes */
  autoExpire?: boolean;
}

export interface SpotlightCampaignCta {
  label: string;
  url: string;
  /** Opens in same tab vs new tab */
  target?: '_self' | '_blank';
  /** Track CTA variant for analytics (future ES-008) */
  variantId?: string;
}

/**
 * Rules governing where a campaign may appear.
 * Evaluated at render time against surface context.
 */
export interface SpotlightPlacementRule {
  /** Target surfaces */
  surfaces: SpotlightPlacementSurface[];
  /** Minimum priority to win a slot when multiple campaigns compete */
  minPriority?: number;
  /** Optional category scope — campaign only shows on matching category pages */
  categoryIds?: string[];
  /** Optional brand scope — campaign only shows on matching brand pages */
  brandIds?: string[];
  /** Max impressions per user per day (future monetization) */
  frequencyCapPerDay?: number;
  /** Geographic targeting codes (future) */
  geoCodes?: string[];
}

/** Valid state transitions for workflow enforcement (backend / CMS). */
export const SPOTLIGHT_CAMPAIGN_STATUS_TRANSITIONS: Record<
  SpotlightCampaignStatus,
  readonly SpotlightCampaignStatus[]
> = {
  draft: ['pending_review', 'archived'],
  pending_review: ['approved', 'rejected', 'draft'],
  approved: ['scheduled', 'published', 'archived'],
  scheduled: ['published', 'archived', 'draft'],
  published: ['paused', 'expired', 'archived'],
  paused: ['published', 'archived'],
  expired: ['archived', 'scheduled'],
  archived: [],
  rejected: ['draft', 'archived'],
};
