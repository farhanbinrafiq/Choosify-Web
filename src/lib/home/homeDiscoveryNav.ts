import type { SectionNavItem } from '../../hooks/useSectionScrollSpy';

/** Sticky discovery ribbon — ES-002 canonical eight items */
export function buildHomeStickyDiscoveryNav(options: {
  sectionVisible: (id: string) => boolean;
  hasSpotlight: boolean;
}): SectionNavItem[] {
  const { sectionVisible, hasSpotlight } = options;

  return [
    { id: 'section-whats-happening', label: 'Trending', hidden: !sectionVisible('whats-happening') },
    { id: 'section-todays-deals', label: 'Deals', hidden: !sectionVisible('deals') },
    { id: 'section-featured-brands', label: 'Brands', hidden: !sectionVisible('featured-brands') },
    { id: 'section-featured-products', label: 'Products', hidden: !sectionVisible('trending') },
    { id: 'section-compare', label: 'Compare', hidden: !sectionVisible('compare') },
    { id: 'section-buying-guides', label: 'Guides', hidden: !sectionVisible('recommended') },
    { id: 'section-services', label: 'Services', hidden: !sectionVisible('services') },
    { id: 'section-spotlight-preview', label: 'Discover', hidden: !hasSpotlight || !sectionVisible('spotlight') },
  ];
}

/** Scroll spy covers every rendered homepage section */
export function buildHomeScrollSpySections(options: {
  sectionVisible: (id: string) => boolean;
  hasSpotlight: boolean;
  hasRecentlyViewed: boolean;
}): SectionNavItem[] {
  const { sectionVisible, hasSpotlight, hasRecentlyViewed } = options;

  return [
    ...buildHomeStickyDiscoveryNav({ sectionVisible, hasSpotlight }),
    { id: 'section-categories', label: 'Categories', hidden: !sectionVisible('categories') },
    { id: 'section-recently-viewed', label: 'Recent', hidden: !hasRecentlyViewed || !sectionVisible('recently-viewed') },
    { id: 'section-trust', label: 'Trust', hidden: !sectionVisible('trust') },
  ];
}
