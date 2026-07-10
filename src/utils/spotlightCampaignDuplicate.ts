import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import { generateCampaignId, slugifyCampaignName } from '../services/spotlightCampaignStorage';

/** Duplicate campaign — copies everything except id, dates, status */
export function duplicateCampaign(
  source: SpotlightCampaignRecord,
  newName?: string,
): SpotlightCampaignRecord {
  const campaignName = newName ?? `${source.campaignName} (Copy)`;
  const now = new Date().toISOString();
  const start = new Date();
  start.setDate(start.getDate() + 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 14);

  return {
    ...source,
    campaignId: generateCampaignId(),
    campaignName,
    campaignSlug: slugifyCampaignName(campaignName),
    status: 'draft',
    schedule: {
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      timezone: source.schedule.timezone,
    },
    featuredUntil: undefined,
    approvedBy: undefined,
    rejectedReason: undefined,
    reviewerComments: undefined,
    approvalStage: 'draft',
    campaignHealthScore: undefined,
    health: undefined,
    versioning: {
      version: 1,
      draftVersion: 1,
    },
    audit: undefined,
    createdAt: now,
    updatedAt: now,
  };
}
