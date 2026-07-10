import type { SpotlightCampaignRecord, SpotlightCampaignWizardDraft } from '../types/spotlight/cms';
import type { UniversalMedia } from '../components/media/types/mediaModel';
import { getMediaById } from '../services/spotlightCampaignStorage';

export interface CampaignValidationIssue {
  field: string;
  message: string;
}

export interface CampaignValidationResult {
  valid: boolean;
  issues: CampaignValidationIssue[];
}

function push(issues: CampaignValidationIssue[], field: string, message: string) {
  issues.push({ field, message });
}

export function validateCampaignForPublish(
  campaign: SpotlightCampaignRecord | SpotlightCampaignWizardDraft,
  mediaIds: string[],
): CampaignValidationResult {
  const issues: CampaignValidationIssue[] = [];

  if (!campaign.campaignName?.trim()) {
    push(issues, 'campaignName', 'Campaign name is required.');
  }
  if (!campaign.headline?.trim()) {
    push(issues, 'headline', 'Headline is required.');
  }
  if (!mediaIds.length) {
    push(issues, 'media', 'At least one media asset is required.');
  } else {
    const missing = mediaIds.filter((id) => !getMediaById(id));
    if (missing.length) {
      push(issues, 'media', `Missing media assets: ${missing.join(', ')}`);
    }
  }

  const productIds = campaign.linkedProductIds ?? [];
  if (!productIds.length) {
    push(issues, 'linkedProductIds', 'At least one catalog product must be attached.');
  }

  const primaryId = campaign.primaryProductId;
  if (productIds.length > 0) {
    const resolvedPrimary = primaryId && productIds.includes(primaryId) ? primaryId : productIds[0];
    if (!resolvedPrimary) {
      push(issues, 'primaryProductId', 'Primary product must be selected.');
    }
  }

  const schedule = campaign.schedule;
  if (!schedule?.startAt || !schedule?.endAt) {
    push(issues, 'schedule', 'Start and end dates are required.');
  } else if (new Date(schedule.endAt) <= new Date(schedule.startAt)) {
    push(issues, 'schedule', 'End date must be after start date.');
  }

  const surfaces =
    'placementSurfaces' in campaign
      ? campaign.placementSurfaces
      : (campaign as SpotlightCampaignRecord).placementRules?.surfaces;
  if (!surfaces?.length) {
    push(issues, 'placement', 'At least one placement surface must be selected.');
  }

  return { valid: issues.length === 0, issues };
}

export function validateWizardStep(
  step: number,
  draft: SpotlightCampaignWizardDraft,
): CampaignValidationResult {
  const issues: CampaignValidationIssue[] = [];
  if (step === 1) {
    if (!draft.campaignName.trim()) push(issues, 'campaignName', 'Campaign name is required.');
    if (!draft.campaignType) push(issues, 'campaignType', 'Campaign type is required.');
    if (!draft.shortDescription.trim()) push(issues, 'shortDescription', 'Description is required.');
  }
  if (step === 2 && !draft.mediaIds.length) {
    push(issues, 'mediaIds', 'Upload at least one media asset.');
  }
  if (step === 3 && !draft.linkedProductIds.length) {
    push(issues, 'linkedProductIds', 'Attach at least one product.');
  }
  if (step === 4 && !draft.placementSurfaces.length) {
    push(issues, 'placementSurfaces', 'Select at least one placement.');
  }
  if (step === 5) {
    if (!draft.schedule.startAt || !draft.schedule.endAt) {
      push(issues, 'schedule', 'Schedule dates are required.');
    }
  }
  return { valid: issues.length === 0, issues };
}

export function buildPreviewMedia(draft: SpotlightCampaignWizardDraft): UniversalMedia | null {
  const primaryId = draft.mediaIds[0];
  if (!primaryId) return null;
  return getMediaById(primaryId) ?? null;
}
