import { useCallback, useEffect, useState } from 'react';
import type { SpotlightCampaignWizardDraft } from '../types/spotlight/cms';
import type { SpotlightExperienceDraft } from '../types/spotlight/studio';
import type { SpotlightCampaignType } from '../types/spotlight/campaignTypes';
import {
  clearWizardDraft,
  loadWizardDraft,
  saveWizardDraft,
} from '../services/spotlightCampaignStorage';

const defaultDraft = (): SpotlightCampaignWizardDraft => ({
  step: 1,
  campaignName: '',
  campaignType: 'single_product' as SpotlightCampaignType,
  shortDescription: '',
  headline: '',
  mediaIds: [],
  linkedProductIds: [],
  linkedBrandIds: [],
  linkedCategoryIds: [],
  placementSurfaces: [],
  schedule: {
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 14 * 86400000).toISOString(),
  },
  priority: 50,
  isSponsored: false,
  visibility: 'public',
  campaignTags: [],
  cta: { label: 'Shop Now', url: '/' },
});

export function useSpotlightCampaignWizard(campaignId?: string) {
  const [draft, setDraft] = useState<SpotlightCampaignWizardDraft>(() => {
    const saved = loadWizardDraft();
    if (saved && (!campaignId || saved.campaignId === campaignId)) return saved;
    return { ...defaultDraft(), campaignId };
  });

  useEffect(() => {
    saveWizardDraft(draft);
  }, [draft]);

  const updateDraft = useCallback((patch: Partial<SpotlightCampaignWizardDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const setStep = useCallback((step: SpotlightCampaignWizardDraft['step']) => {
    setDraft((prev) => ({ ...prev, step }));
  }, []);

  const resetWizard = useCallback(() => {
    clearWizardDraft();
    setDraft(defaultDraft());
  }, []);

  const setExperienceDraft = useCallback((experienceDraft: SpotlightExperienceDraft) => {
    setDraft((prev) => ({ ...prev, experienceDraft }));
  }, []);

  return {
    draft,
    updateDraft,
    setStep,
    resetWizard,
    setDraft,
    experienceDraft: draft.experienceDraft,
    setExperienceDraft,
  };
}
