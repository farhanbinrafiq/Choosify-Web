/** Unified Spotlight Content route — single detail destination */
export function spotlightContentHref(slug: string): string {
  return `/spotlight/${encodeURIComponent(slug)}`;
}

/** Catalog / CMS guide → same Guide Detail shell as Discover formats */
export function catalogGuideHref(guide: { slug?: string | null; id: string | number }): string {
  return spotlightContentHref(String(guide.slug || guide.id));
}

/** @deprecated Use spotlightContentHref — legacy path redirects to /spotlight/:slug */
export function legacySpotlightContentHref(slug: string): string {
  return `/spotlight/content/${encodeURIComponent(slug)}`;
}

export function spotlightContentHrefFromId(sourceKind: string, sourceId: string, slug: string): string {
  return spotlightContentHref(slug || sourceId);
}

export {
  SPOTLIGHT_CONTENT_TYPE_REGISTRY,
  resolveLegacyGuideContentType,
  contentTypesForTab,
  getContentTypeDefinition,
} from './contentTypeRegistry';
export { RENDERER_REGISTRY, resolveRendererId } from './rendererRegistry';
export { CTA_REGISTRY, resolveCtaLabel } from './ctaRegistry';
export { PUBLISHER_REGISTRY, publisherProfileHref } from './publisherRegistry';
export { MEDIA_REGISTRY, mediaEntryFor } from './mediaRegistry';
export { buildContentRelationshipGraph, relatedContentIds } from './relationshipGraph';
export {
  resolvePageSectionManifest,
  isPageSectionVisible,
  isGuideNavSectionVisible,
  defaultSectionsForContentType,
  sectionHasData,
  shouldShowBrandProfileCard,
  shouldShowCreatorProfileCard,
  isServiceForwardContent,
} from './sectionManifestRegistry';
export type { SpotlightPageSectionId, SpotlightPageSectionConfig } from '../../../types/spotlight/experience/pageSections';
