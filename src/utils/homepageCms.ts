import type { HomepageConfig, HomepageHeroBanner } from '../types/catalog';

const SECTION_ALIASES: Record<string, string[]> = {
  spotlight: ['spotlight', 'viral-today'],
  'viral-today': ['spotlight', 'viral-today'],
};

function sectionMatches(sectionId: string, candidateId: string): boolean {
  const aliases = SECTION_ALIASES[sectionId];
  if (aliases) return aliases.includes(candidateId);
  return sectionId === candidateId;
}

export const isHomeSectionVisible = (homepageConfig: HomepageConfig | null, sectionId: string): boolean => {
  if (!homepageConfig?.sections?.length) return true;
  const section = homepageConfig.sections.find((item) => sectionMatches(sectionId, item.id));
  return section ? section.isVisible : true;
};

export const getActiveHeroBanner = (homepageConfig: HomepageConfig | null): HomepageHeroBanner | null => {
  const banners = homepageConfig?.heroBanners?.filter((banner) => banner.isActive) ?? [];
  if (!banners.length) return null;
  return [...banners].sort((a, b) => a.order - b.order)[0];
};

export const getSectionItemIds = (homepageConfig: HomepageConfig | null, sectionId: string): string[] => {
  const section = homepageConfig?.sections?.find((item) => sectionMatches(sectionId, item.id));
  return section?.itemIds ?? [];
};

/** Normalize CMS section ids used by the storefront homepage. */
export function normalizeHomeSectionId(sectionId: string): string {
  if (sectionId === 'viral-today') return 'spotlight';
  return sectionId;
}

/** Default main-section order when CMS sections are absent. */
export const DEFAULT_HOME_SECTION_ORDER = [
  'categories',
  'spotlight',
  'trending',
  'deals',
  'compare',
  'recommended',
  'featured-brands',
  'services',
  'recently-viewed',
] as const;

/**
 * Ordered homepage section keys for rendering (hero stays locked at top separately).
 * When CMS sections exist, listed sections sort by `order`; unlisted known sections follow.
 */
export function getOrderedHomeSectionIds(homepageConfig: HomepageConfig | null): string[] {
  const defaults = [...DEFAULT_HOME_SECTION_ORDER];
  if (!homepageConfig?.sections?.length) return defaults;

  const orderMap = new Map<string, number>();
  for (const section of homepageConfig.sections) {
    const id = normalizeHomeSectionId(section.id);
    if (id === 'hero' || id === 'newsletter' || id === 'creators') continue;
    if (!defaults.includes(id as (typeof DEFAULT_HOME_SECTION_ORDER)[number])) continue;
    if (!orderMap.has(id)) orderMap.set(id, section.order);
  }

  const listed = defaults
    .filter((id) => orderMap.has(id))
    .sort((a, b) => (orderMap.get(a)! - orderMap.get(b)!));
  const unlisted = defaults.filter((id) => !orderMap.has(id));
  return [...listed, ...unlisted];
}
