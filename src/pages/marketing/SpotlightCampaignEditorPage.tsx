import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useSpotlightCampaignWizard } from '../../hooks/useSpotlightCampaignWizard';
import { MediaManagerPanel } from '../../components/spotlight/cms/MediaManagerPanel';
import { ProductMerchandisingPanel } from '../../components/spotlight/merchandising/ProductMerchandisingPanel';
import { PlacementManagerPanel } from '../../components/spotlight/cms/PlacementManagerPanel';
import { MerchandisingPreviewPanel } from '../../components/spotlight/merchandising/MerchandisingPreviewPanel';
import { MerchantGuidancePanel } from '../../components/spotlight/merchandising/MerchantGuidancePanel';
import { SPOTLIGHT_CAMPAIGN_TYPE_META } from '../../types/spotlight/campaignTypes';
import type { SpotlightCampaignType } from '../../types/spotlight/campaignTypes';
import {
  generateCampaignId,
  getCampaignById,
  slugifyCampaignName,
  upsertCampaign,
} from '../../services/spotlightCampaignStorage';
import type { SpotlightCampaignRecord } from '../../types/spotlight/cms';
import {
  buildPreviewMedia,
  validateCampaignForPublish,
  validateWizardStep,
} from '../../utils/spotlightCampaignValidation';
import { useGlobalState } from '../../context/GlobalStateContext';
import { mapUserRoleToCampaignActor, canModerate, canPublish } from '../../utils/spotlightCampaignPermissions';
import { calculateCampaignQualityScore, generateMerchantGuidance } from '../../utils/spotlightCampaignQuality';
import { migrateLegacyToMerchandising } from '../../utils/spotlightMerchandisingOrdering';
import { cn } from '../../lib/utils';

const STEPS = [
  'Campaign Basics',
  'Campaign Media',
  'Campaign Products',
  'Placement',
  'Schedule',
  'Review',
];

function recordFromDraft(
  draft: ReturnType<typeof useSpotlightCampaignWizard>['draft'],
  userId: string,
  existing?: SpotlightCampaignRecord,
): SpotlightCampaignRecord {
  const now = new Date().toISOString();
  return {
    campaignId: existing?.campaignId ?? draft.campaignId ?? generateCampaignId(),
    campaignName: draft.campaignName,
    campaignSlug: slugifyCampaignName(draft.campaignName),
    campaignType: draft.campaignType,
    status: existing?.status ?? 'draft',
    headline: draft.headline || draft.campaignName,
    subHeadline: draft.subHeadline,
    shortDescription: draft.shortDescription,
    linkedProductIds: draft.linkedProductIds,
    primaryProductId: draft.primaryProductId ?? draft.linkedProductIds[0],
    linkedBrandIds: draft.linkedBrandIds,
    linkedCategoryIds: draft.linkedCategoryIds,
    media: draft.mediaIds,
    primaryMediaId: draft.mediaIds[0],
    cta: draft.cta,
    priority: draft.priority,
    placementRules: {
      surfaces: draft.placementSurfaces,
      brandIds: draft.linkedBrandIds,
      categoryIds: draft.linkedCategoryIds,
    },
    campaignTags: draft.campaignTags,
    visibility: draft.visibility,
    isSponsored: draft.isSponsored,
    featuredUntil: draft.featuredUntil,
    schedule: draft.schedule,
    folderId: draft.folderId,
    sellerId: draft.sellerId,
    sellerName: draft.sellerName,
    brandName: draft.brandName,
    createdBy: existing?.createdBy ?? userId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    merchandising: draft.merchandising,
    campaignHealthScore: draft.merchandising?.qualityScore?.score,
  };
}

export function SpotlightCampaignEditorPage() {
  const { campaignId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const isNew = !campaignId || campaignId === 'new';
  const { draft, updateDraft, setStep } = useSpotlightCampaignWizard(isNew ? undefined : campaignId);
  const { allCatalogProducts } = useGlobalState();

  const actor = mapUserRoleToCampaignActor(currentUser.role);

  const qualityScore = useMemo(
    () => calculateCampaignQualityScore(draft, draft.linkedProductIds, allCatalogProducts),
    [draft, allCatalogProducts],
  );

  const merchantGuidance = useMemo(
    () => generateMerchantGuidance(draft, allCatalogProducts),
    [draft, allCatalogProducts],
  );

  const handleMerchandisingChange = useCallback(
    (
      merchandising: NonNullable<typeof draft.merchandising>,
      legacy: { linkedProductIds: string[]; primaryProductId?: string },
    ) => {
      updateDraft({
        merchandising,
        linkedProductIds: legacy.linkedProductIds,
        primaryProductId: legacy.primaryProductId,
      });
    },
    [updateDraft],
  );

  const previewLinks = useMemo(
    () =>
      draft.merchandising?.productLinks ??
      migrateLegacyToMerchandising(draft.linkedProductIds, draft.primaryProductId).productLinks,
    [draft.merchandising, draft.linkedProductIds, draft.primaryProductId],
  );

  useEffect(() => {
    if (!isNew && campaignId) {
      const existing = getCampaignById(campaignId);
      if (existing) {
        updateDraft({
          campaignId: existing.campaignId,
          campaignName: existing.campaignName,
          campaignType: existing.campaignType,
          shortDescription: existing.shortDescription ?? '',
          headline: existing.headline,
          subHeadline: existing.subHeadline,
          mediaIds: existing.media,
          linkedProductIds: existing.linkedProductIds,
          primaryProductId: existing.primaryProductId,
          linkedBrandIds: existing.linkedBrandIds,
          linkedCategoryIds: existing.linkedCategoryIds,
          placementSurfaces: existing.placementRules.surfaces,
          schedule: existing.schedule,
          priority: existing.priority,
          isSponsored: existing.isSponsored,
          featuredUntil: existing.featuredUntil,
          visibility: existing.visibility,
          campaignTags: existing.campaignTags,
          cta: existing.cta,
          brandName: existing.brandName,
          sellerId: existing.sellerId,
          sellerName: existing.sellerName,
          folderId: existing.folderId,
          merchandising: existing.merchandising,
        });
      }
    }
    const productId = searchParams.get('productId');
    if (productId && isNew) {
      updateDraft({
        linkedProductIds: [productId],
        primaryProductId: productId,
        campaignType: 'single_product',
      });
    }
  }, [campaignId, isNew, searchParams, updateDraft]);

  const saveDraft = () => {
    const existing = campaignId && !isNew ? getCampaignById(campaignId) : undefined;
    const record = recordFromDraft(draft, currentUser.id, existing);
    upsertCampaign(record);
    toast.success('Draft saved');
    if (isNew) navigate(`/marketing/spotlight/${record.campaignId}`, { replace: true });
  };

  const goNext = () => {
    const result = validateWizardStep(draft.step, draft);
    if (!result.valid) {
      toast.error(result.issues[0]?.message ?? 'Complete required fields');
      return;
    }
    if (draft.step < 6) setStep((draft.step + 1) as typeof draft.step);
  };

  const submitForReview = () => {
    const validation = validateCampaignForPublish(draft, draft.mediaIds);
    if (!validation.valid) {
      toast.error(validation.issues[0]?.message ?? 'Fix validation errors');
      return;
    }
    const existing = campaignId && !isNew ? getCampaignById(campaignId) : undefined;
    const record = recordFromDraft(draft, currentUser.id, existing);
    record.status = 'pending_review';
    upsertCampaign(record);
    toast.success('Submitted for review');
    navigate('/marketing/spotlight');
  };

  const approve = () => {
    if (!canModerate(actor)) return;
    const record = recordFromDraft(draft, currentUser.id, getCampaignById(campaignId!));
    record.status = 'approved';
    record.approvedBy = currentUser.id;
    upsertCampaign(record);
    toast.success('Campaign approved');
  };

  const publish = () => {
    if (!canPublish(actor)) return;
    const validation = validateCampaignForPublish(draft, draft.mediaIds);
    if (!validation.valid) {
      toast.error(validation.issues[0]?.message ?? 'Cannot publish');
      return;
    }
    const record = recordFromDraft(draft, currentUser.id, getCampaignById(campaignId!));
    record.status = 'published';
    upsertCampaign(record);
    toast.success('Campaign published');
    navigate('/marketing/spotlight');
  };

  const previewMedia = buildPreviewMedia(draft);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate('/marketing/spotlight')} className="text-sm text-gray-500 flex items-center gap-1">
          <ChevronLeft size={16} /> Back to campaigns
        </button>
        <button type="button" onClick={saveDraft} className="flex items-center gap-1 text-sm font-bold text-[#E8500A]">
          <Save size={14} /> Save Draft
        </button>
      </div>

      {(draft.step === 3 || draft.step === 6) && (
        <MerchantGuidancePanel guidance={merchantGuidance} qualityScore={qualityScore.score} />
      )}

      <ol className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase',
              draft.step === i + 1 ? 'bg-[#E8500A] text-white' : 'bg-white border border-[#e8edf2] text-gray-400',
            )}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="bg-white border border-[#e8edf2] rounded-lg p-6">
        {draft.step === 1 && (
          <div className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Campaign name"
              value={draft.campaignName}
              onChange={(e) => updateDraft({ campaignName: e.target.value, headline: e.target.value })}
            />
            <select
              className="w-full border rounded px-3 py-2"
              value={draft.campaignType}
              onChange={(e) => updateDraft({ campaignType: e.target.value as SpotlightCampaignType })}
            >
              {(Object.keys(SPOTLIGHT_CAMPAIGN_TYPE_META) as SpotlightCampaignType[]).map((t) => (
                <option key={t} value={t}>{SPOTLIGHT_CAMPAIGN_TYPE_META[t].label}</option>
              ))}
            </select>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Brand name"
              value={draft.brandName ?? ''}
              onChange={(e) => updateDraft({ brandName: e.target.value })}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Seller name"
              value={draft.sellerName ?? ''}
              onChange={(e) => updateDraft({ sellerName: e.target.value, sellerId: currentUser.id })}
            />
            <textarea
              className="w-full border rounded px-3 py-2 min-h-[100px]"
              placeholder="Campaign description"
              value={draft.shortDescription}
              onChange={(e) => updateDraft({ shortDescription: e.target.value })}
            />
          </div>
        )}

        {draft.step === 2 && (
          <MediaManagerPanel
            mediaIds={draft.mediaIds}
            primaryMediaId={draft.mediaIds[0]}
            onChange={(mediaIds) => updateDraft({ mediaIds })}
          />
        )}

        {draft.step === 3 && (
          <ProductMerchandisingPanel
            key={draft.campaignId ?? 'new'}
            merchandising={draft.merchandising}
            linkedProductIds={draft.linkedProductIds}
            primaryProductId={draft.primaryProductId}
            brandId={draft.brandId ?? draft.linkedBrandIds[0]}
            categoryId={draft.linkedCategoryIds[0]}
            onChange={handleMerchandisingChange}
          />
        )}

        {draft.step === 4 && (
          <PlacementManagerPanel
            selected={draft.placementSurfaces}
            onChange={(placementSurfaces) => updateDraft({ placementSurfaces })}
          />
        )}

        {draft.step === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm">
              Start date
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2 mt-1"
                value={draft.schedule.startAt.slice(0, 16)}
                onChange={(e) =>
                  updateDraft({ schedule: { ...draft.schedule, startAt: new Date(e.target.value).toISOString() } })
                }
              />
            </label>
            <label className="text-sm">
              End date
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2 mt-1"
                value={draft.schedule.endAt.slice(0, 16)}
                onChange={(e) =>
                  updateDraft({ schedule: { ...draft.schedule, endAt: new Date(e.target.value).toISOString() } })
                }
              />
            </label>
            <label className="text-sm">
              Priority (0–100)
              <input
                type="number"
                min={0}
                max={100}
                className="w-full border rounded px-3 py-2 mt-1"
                value={draft.priority}
                onChange={(e) => updateDraft({ priority: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={draft.isSponsored}
                onChange={(e) => updateDraft({ isSponsored: e.target.checked })}
              />
              Sponsored campaign
            </label>
            <label className="text-sm">
              Visibility
              <select
                className="w-full border rounded px-3 py-2 mt-1"
                value={draft.visibility}
                onChange={(e) => updateDraft({ visibility: e.target.value as typeof draft.visibility })}
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="internal">Internal</option>
              </select>
            </label>
          </div>
        )}

        {draft.step === 6 && (
          <div className="space-y-6">
            <MerchandisingPreviewPanel
              media={previewMedia}
              headline={draft.headline}
              productLinks={previewLinks}
              catalog={allCatalogProducts}
            />
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={saveDraft} className="px-4 py-2 border rounded text-sm font-bold">
                Save Draft
              </button>
              <button type="button" onClick={submitForReview} className="px-4 py-2 bg-[#E8500A] text-white rounded text-sm font-bold">
                Submit for Review
              </button>
              {canModerate(actor) && (
                <button type="button" onClick={approve} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold">
                  Approve
                </button>
              )}
              {canPublish(actor) && (
                <button type="button" onClick={publish} className="px-4 py-2 bg-green-600 text-white rounded text-sm font-bold">
                  Publish
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          disabled={draft.step === 1}
          onClick={() => setStep((draft.step - 1) as typeof draft.step)}
          className="flex items-center gap-1 px-4 py-2 border rounded disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        {draft.step < 6 && (
          <button type="button" onClick={goNext} className="flex items-center gap-1 px-4 py-2 bg-navy text-white rounded">
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
