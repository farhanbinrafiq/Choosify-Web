import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useSpotlightExperienceBuilder } from '../../hooks/useSpotlightExperienceBuilder';
import { useSpotlightCampaignWizard } from '../../hooks/useSpotlightCampaignWizard';
import {
  SpotlightEditorShell,
  SpotlightBlockLibrary,
  SpotlightBlockRenderer,
  SpotlightTemplatePicker,
  SpotlightSeoPanel,
  SpotlightDiscoveryPanel,
  SpotlightAiPanel,
  SpotlightRelationshipPanel,
  SpotlightPreview,
  SpotlightCommercePanel,
  SpotlightMediaPanel,
} from '../../components/spotlight/studio';
import {
  PUBLISHER_CONTENT_TYPE_REGISTRY,
  getPublisherContentType,
} from '../../lib/spotlight/studio/publisherContentTypeRegistry';
import type { SpotlightCampaignType } from '../../types/spotlight/campaignTypes';
import type { SpotlightCampaignRecord } from '../../types/spotlight/cms';
import {
  generateCampaignId,
  getCampaignById,
  slugifyCampaignName,
  upsertCampaign,
} from '../../services/spotlightCampaignStorage';
import { validateCampaignForPublish } from '../../utils/spotlightCampaignValidation';
import { cn } from '../../lib/utils';

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

function ContentTypePicker({
  onSelect,
}: {
  onSelect: (typeId: string, campaignType: SpotlightCampaignType) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <Sparkles className="h-10 w-10 text-[#E8500A] mx-auto mb-3" aria-hidden />
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">Create Spotlight Content</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
          Choose a content type. One universal editor adapts to how your experience is rendered.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PUBLISHER_CONTENT_TYPE_REGISTRY.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id, (t.campaignType ?? 'brand_campaign') as SpotlightCampaignType)}
            className={cn(
              'flex flex-col items-start gap-1 rounded-xl border border-[#e8edf2] bg-white p-4 text-left',
              'hover:border-[#E8500A]/40 hover:bg-[#E8500A]/5 transition-colors',
            )}
          >
            <span className="text-2xl" aria-hidden>
              {t.icon}
            </span>
            <span className="font-bold text-sm text-navy">{t.label}</span>
            <span className="text-xs text-gray-500 line-clamp-2 capitalize">{t.group}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-6">
        Campaign is one content type among many — not the only way to publish on Spotlight.
      </p>
    </div>
  );
}

export default function SpotlightPublisherStudioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const isNew = !id || id === 'new';
  const [pickedType, setPickedType] = useState<string | null>(null);

  const wizard = useSpotlightCampaignWizard(isNew ? undefined : id);

  const builder = useSpotlightExperienceBuilder(
    wizard.experienceDraft ?? {
      publisherContentType: pickedType ?? 'campaign',
      title: wizard.draft.campaignName,
      headline: wizard.draft.headline,
      description: wizard.draft.shortDescription,
      seo: {
        slug: slugifyCampaignName(wizard.draft.campaignName),
        metaTitle: wizard.draft.headline || wizard.draft.campaignName,
        metaDescription: wizard.draft.shortDescription,
        keywords: wizard.draft.campaignTags,
        twitterCard: 'summary_large_image',
        schemaType: 'Article',
        index: true,
        follow: true,
      },
      discovery: {
        collectionIds: [],
        seriesIds: [],
        categoryIds: wizard.draft.linkedCategoryIds,
        tags: wizard.draft.campaignTags,
        relatedContentIds: [],
        featured: false,
        trending: false,
        pinned: false,
        recommended: false,
        placements: wizard.draft.placementSurfaces,
      },
      relationships: {
        productIds: wizard.draft.linkedProductIds,
        brandIds: wizard.draft.linkedBrandIds,
        creatorIds: [],
        categoryIds: wizard.draft.linkedCategoryIds,
        serviceIds: [],
        collectionIds: [],
        seriesIds: [],
        campaignIds: [],
        guideIds: [],
        reviewIds: [],
      },
    },
  );

  useEffect(() => {
    if (!isNew && id) {
      const existing = getCampaignById(id);
      if (existing) {
        wizard.updateDraft({
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
        const match = PUBLISHER_CONTENT_TYPE_REGISTRY.find((t) => t.campaignType === existing.campaignType);
        if (match) setPickedType(match.id);
      }
    }
  }, [id, isNew, wizard.updateDraft]);

  const syncWizardFromBuilder = useCallback(() => {
    const d = builder.draft;
    wizard.updateDraft({
      campaignName: d.title,
      shortDescription: d.description,
      headline: d.headline,
      campaignTags: d.discovery.tags.length ? d.discovery.tags : d.seo.keywords,
      linkedProductIds: d.relationships.productIds,
      linkedBrandIds: d.relationships.brandIds,
      linkedCategoryIds: d.relationships.categoryIds,
      placementSurfaces: d.discovery.placements as typeof wizard.draft.placementSurfaces,
    });
    wizard.setExperienceDraft(d);
  }, [builder.draft, wizard]);

  const handleSave = useCallback(() => {
    syncWizardFromBuilder();
    const existing = id && !isNew ? getCampaignById(id) : undefined;
    const record = recordFromDraft(wizard.draft, currentUser.id, existing);
    upsertCampaign(record);
    builder.saveRevision(currentUser.id);
    toast.success('Draft saved');
    if (isNew) navigate(`/marketing/studio/${record.campaignId}`, { replace: true });
  }, [syncWizardFromBuilder, wizard.draft, currentUser.id, id, isNew, navigate, builder]);

  const handleSubmit = useCallback(() => {
    syncWizardFromBuilder();
    const validation = validateCampaignForPublish(wizard.draft, wizard.draft.mediaIds);
    if (!validation.valid) {
      toast.error(validation.issues[0]?.message ?? 'Fix validation errors');
      return;
    }
    const existing = id && !isNew ? getCampaignById(id) : undefined;
    const record = recordFromDraft(wizard.draft, currentUser.id, existing);
    record.status = 'pending_review';
    upsertCampaign(record);
    builder.setStatus('pending_review');
    toast.success('Submitted for review');
    navigate('/marketing/studio');
  }, [syncWizardFromBuilder, wizard.draft, currentUser.id, id, isNew, navigate, builder]);

  const handlePickType = (typeId: string, campaignType: SpotlightCampaignType) => {
    setPickedType(typeId);
    wizard.updateDraft({ campaignType, step: 1 });
    builder.setPublisherContentType(typeId);
  };

  const contentTypeMeta = pickedType ? getPublisherContentType(pickedType) : null;

  const panelContent = useMemo(() => {
    switch (builder.activePanel) {
      case 'editor':
        return (
          <div className="p-6 space-y-6 max-w-3xl mx-auto">
            <SpotlightTemplatePicker
              onSelectTemplate={builder.applyTemplate}
              onSelectBlueprint={builder.applyBlueprint}
            />
            <SpotlightBlockRenderer
              blocks={builder.draft.blocks}
              selectedBlockId={builder.selectedBlockId}
              onSelect={builder.setSelectedBlockId}
              onUpdate={builder.updateBlock}
              onRemove={builder.removeBlock}
              onMove={builder.moveBlock}
            />
          </div>
        );
      case 'media':
        return (
          <SpotlightMediaPanel
            mediaIds={wizard.draft.mediaIds}
            onChange={(mediaIds) => wizard.updateDraft({ mediaIds })}
          />
        );
      case 'commerce':
        return (
          <SpotlightCommercePanel
            productIds={wizard.draft.linkedProductIds}
            primaryProductId={wizard.draft.primaryProductId}
            brandId={wizard.draft.linkedBrandIds[0]}
            categoryId={wizard.draft.linkedCategoryIds[0]}
            onProductsChange={(linkedProductIds, primaryProductId) =>
              wizard.updateDraft({ linkedProductIds, primaryProductId })
            }
          />
        );
      case 'relationships':
        return (
          <SpotlightRelationshipPanel
            relationships={builder.draft.relationships}
            onChange={(patch) => builder.updateDraft({ relationships: { ...builder.draft.relationships, ...patch } })}
          />
        );
      case 'seo':
        return (
          <SpotlightSeoPanel
            seo={builder.draft.seo}
            title={builder.draft.title}
            onChange={(patch) => builder.updateDraft({ seo: { ...builder.draft.seo, ...patch } })}
          />
        );
      case 'discovery':
        return (
          <SpotlightDiscoveryPanel
            discovery={builder.draft.discovery}
            onChange={(patch) => builder.updateDraft({ discovery: { ...builder.draft.discovery, ...patch } })}
          />
        );
      case 'ai':
        return <SpotlightAiPanel />;
      case 'preview':
        return (
          <SpotlightPreview
            draft={builder.draft}
            mode={builder.previewMode}
            onModeChange={builder.setPreviewMode}
          />
        );
      default:
        return null;
    }
  }, [builder, wizard.draft, wizard.updateDraft]);

  if (isNew && !pickedType) {
    return (
      <div className="min-h-screen bg-[#F8FBFD]">
        <div className="border-b border-[#e8edf2] bg-white px-4 py-3">
          <Link
            to="/marketing/studio"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E8500A]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Publisher Studio
          </Link>
        </div>
        <ContentTypePicker onSelect={handlePickType} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <div className="border-b border-[#e8edf2] bg-white px-4 py-2">
        <Link
          to="/marketing/studio"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#E8500A]"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Publisher Studio
          {contentTypeMeta && (
            <span className="text-gray-300">·</span>
          )}
          {contentTypeMeta && (
            <span className="font-bold text-navy">{contentTypeMeta.icon} {contentTypeMeta.label}</span>
          )}
        </Link>
      </div>
      <SpotlightEditorShell
        builder={builder}
        onSave={handleSave}
        onSubmit={handleSubmit}
        library={<SpotlightBlockLibrary onAdd={builder.addBlock} />}
      >
        {panelContent}
      </SpotlightEditorShell>
    </div>
  );
}
