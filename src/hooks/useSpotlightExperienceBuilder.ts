import { useCallback, useState } from 'react';
import type {
  SpotlightBlock,
  SpotlightExperienceDraft,
  SpotlightExperienceStatus,
  SpotlightPreviewMode,
} from '../types/spotlight/studio';
import { createBlock } from '../lib/spotlight/studio/blockRegistry';
import { getTemplate } from '../lib/spotlight/studio/templateRegistry';
import { getBlueprint } from '../lib/spotlight/studio/blueprintRegistry';
import { getPublisherContentType } from '../lib/spotlight/studio/publisherContentTypeRegistry';
import type { SpotlightBlockType } from '../types/spotlight/studio';

export type StudioPanelId = 'editor' | 'seo' | 'discovery' | 'ai' | 'preview' | 'relationships' | 'commerce' | 'media';

const DEFAULT_DRAFT = (): SpotlightExperienceDraft => ({
  publisherContentType: 'campaign',
  contentType: 'campaign',
  title: '',
  headline: '',
  description: '',
  status: 'draft',
  blocks: [],
  seo: {
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    twitterCard: 'summary_large_image',
    schemaType: 'Article',
    index: true,
    follow: true,
  },
  discovery: {
    collectionIds: [],
    seriesIds: [],
    categoryIds: [],
    tags: [],
    relatedContentIds: [],
    featured: false,
    trending: false,
    pinned: false,
    recommended: false,
    placements: [],
  },
  relationships: {
    productIds: [],
    brandIds: [],
    creatorIds: [],
    categoryIds: [],
    serviceIds: [],
    collectionIds: [],
    seriesIds: [],
    campaignIds: [],
    guideIds: [],
    reviewIds: [],
  },
  revisions: [],
});

export function useSpotlightExperienceBuilder(initial?: Partial<SpotlightExperienceDraft>) {
  const [draft, setDraft] = useState<SpotlightExperienceDraft>({ ...DEFAULT_DRAFT(), ...initial });
  const [activePanel, setActivePanel] = useState<StudioPanelId>('editor');
  const [previewMode, setPreviewMode] = useState<SpotlightPreviewMode>('desktop');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const updateDraft = useCallback((patch: Partial<SpotlightExperienceDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const setPublisherContentType = useCallback((typeId: string) => {
    const def = getPublisherContentType(typeId);
    if (!def) return;
    updateDraft({
      publisherContentType: typeId,
      contentType: def.contentType,
    });
  }, [updateDraft]);

  const addBlock = useCallback((type: SpotlightBlockType) => {
    setDraft((prev) => {
      const block = createBlock(type, prev.blocks.length);
      return { ...prev, blocks: [...prev.blocks, block] };
    });
    setSelectedBlockId(null);
  }, []);

  const updateBlock = useCallback((blockId: string, data: Record<string, unknown>) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.blockId === blockId ? { ...b, data: { ...b.data, ...data } } : b)),
    }));
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.blockId !== blockId).map((b, i) => ({ ...b, order: i })),
    }));
    setSelectedBlockId(null);
  }, []);

  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setDraft((prev) => {
      const idx = prev.blocks.findIndex((b) => b.blockId === blockId);
      if (idx < 0) return prev;
      const next = [...prev.blocks];
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...prev, blocks: next.map((b, i) => ({ ...b, order: i })) };
    });
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    const template = getTemplate(templateId);
    if (!template) return;
    const def = getPublisherContentType(template.publisherContentType);
    const blocks = template.blockTypes.map((type, i) => createBlock(type, i));
    updateDraft({
      templateId,
      publisherContentType: template.publisherContentType,
      contentType: def?.contentType ?? draft.contentType,
      title: template.title,
      headline: template.title,
      blocks,
      seo: {
        ...draft.seo,
        metaTitle: template.seoDefaults?.metaTitle ?? template.title,
        schemaType: template.seoDefaults?.schemaType ?? draft.seo.schemaType,
      },
    });
  }, [draft.contentType, draft.seo, updateDraft]);

  const applyBlueprint = useCallback((blueprintId: string) => {
    const blueprint = getBlueprint(blueprintId);
    if (!blueprint) return;
    const def = getPublisherContentType(blueprint.publisherContentType);
    const blocks = blueprint.recommendedBlocks.map((type, i) => createBlock(type, i));
    updateDraft({
      blueprintId,
      publisherContentType: blueprint.publisherContentType,
      contentType: def?.contentType ?? draft.contentType,
      title: blueprint.title,
      headline: blueprint.title,
      blocks,
      discovery: {
        ...draft.discovery,
        placements: blueprint.suggestedPlacements,
      },
    });
  }, [draft.contentType, draft.discovery, updateDraft]);

  const setStatus = useCallback((status: SpotlightExperienceStatus) => {
    updateDraft({ status });
  }, [updateDraft]);

  const saveRevision = useCallback((authorId: string, label = 'Manual save') => {
    setDraft((prev) => ({
      ...prev,
      revisions: [
        { revisionId: `rev-${Date.now()}`, savedAt: new Date().toISOString(), label, authorId },
        ...prev.revisions,
      ].slice(0, 20),
    }));
  }, []);

  return {
    draft,
    updateDraft,
    activePanel,
    setActivePanel,
    previewMode,
    setPreviewMode,
    selectedBlockId,
    setSelectedBlockId,
    setPublisherContentType,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    applyTemplate,
    applyBlueprint,
    setStatus,
    saveRevision,
  };
}

export type SpotlightExperienceBuilderState = ReturnType<typeof useSpotlightExperienceBuilder>;
