import type { CtaPageKey, CtaPosition } from '../types/catalog';

/**
 * The single source of truth for where an editorial CTA can be placed.
 * Every entry here corresponds to a real, hand-wired anchor point in a real
 * page component (see the matching <CtaAnchor page="X" section="Y"
 * position="before|after"/> calls in that page's JSX) -- this is not a
 * cosmetic list. If a section isn't in this registry, the Admin CTA editor
 * cannot select it, and it would not render anywhere even if it could.
 *
 * Sections were chosen from an audit of each page's actual, unconditional
 * render boundaries (not every div — only genuinely distinct, stable
 * content blocks). Kept deliberately small (2 sections/page) rather than
 * fabricating fake subdivisions.
 */
export interface CtaPlacementSection {
  section: string;
  label: string;
  /** Which positions this section actually supports (some are "end of page" anchors where only "after" is meaningful). */
  positions: CtaPosition[];
}

export const CTA_PLACEMENT_REGISTRY: Record<CtaPageKey, { label: string; route: string; sections: CtaPlacementSection[] }> = {
  home: {
    label: 'Home',
    route: '/',
    sections: [
      { section: 'home-deals', label: "Today's Deals section", positions: ['before', 'after'] },
      { section: 'home-featured-brands', label: 'Featured Brands section', positions: ['before', 'after'] },
      { section: 'home-end', label: 'End of page', positions: ['after'] },
    ],
  },
  brands: {
    label: 'Brands',
    route: '/brands',
    sections: [
      { section: 'brands-grid', label: 'Brand card grid', positions: ['before', 'after'] },
      { section: 'brands-follow-cta-strip', label: '"Want exclusive brand deals?" strip', positions: ['before', 'after'] },
    ],
  },
  deals: {
    label: 'Deals',
    route: '/deals',
    sections: [
      { section: 'deals-flash-dotd', label: 'Flash Deals & Deal of the Day', positions: ['before', 'after'] },
      { section: 'deals-subscribe-banner', label: 'Newsletter subscribe banner', positions: ['before', 'after'] },
    ],
  },
  categories: {
    label: 'Categories',
    route: '/categories',
    sections: [
      { section: 'categories-feed-header', label: 'Page header', positions: ['before', 'after'] },
      { section: 'categories-browse-body', label: 'Category browse grid', positions: ['after'] },
    ],
  },
  products: {
    label: 'Products & Services',
    route: '/products',
    sections: [
      { section: 'products-grid', label: 'Product grid', positions: ['before', 'after'] },
      { section: 'products-end', label: 'End of page', positions: ['after'] },
    ],
  },
  search: {
    label: 'Search',
    route: '/search',
    sections: [
      { section: 'search-pill-tabs', label: 'Result-type tabs', positions: ['before', 'after'] },
      { section: 'search-end', label: 'End of results', positions: ['after'] },
    ],
  },
  creators: {
    label: 'Creators',
    route: '/creators',
    sections: [
      { section: 'creators-feed-header', label: 'Page header', positions: ['before', 'after'] },
      { section: 'creators-grid', label: 'Creator card grid', positions: ['before', 'after'] },
    ],
  },
};

export function getPageSections(page: CtaPageKey): CtaPlacementSection[] {
  return CTA_PLACEMENT_REGISTRY[page]?.sections ?? [];
}

export function getSectionPositions(page: CtaPageKey, section: string): CtaPosition[] {
  return CTA_PLACEMENT_REGISTRY[page]?.sections.find((s) => s.section === section)?.positions ?? [];
}

export function isValidPlacement(page: CtaPageKey, section: string, position: CtaPosition): boolean {
  return getSectionPositions(page, section).includes(position);
}

export function sectionLabel(page: CtaPageKey, section: string): string {
  return CTA_PLACEMENT_REGISTRY[page]?.sections.find((s) => s.section === section)?.label ?? section;
}

/** The default (page, section, position) used for legacy items and new drafts. */
export function defaultPlacementFor(page: CtaPageKey): { section: string; position: CtaPosition } {
  const sections = getPageSections(page);
  const first = sections[0];
  return { section: first?.section ?? '', position: first?.positions[0] ?? 'after' };
}
