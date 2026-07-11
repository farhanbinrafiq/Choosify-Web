import type { SpotlightExploreSection } from '../types/spotlight/discovery/explore';
import type { SpotlightContent } from '../types/spotlight/experience/content';

export function buildExploreSections(allContent: SpotlightContent[]): SpotlightExploreSection[] {
  const brands = new Map<string, number>();
  const creators = new Map<string, number>();
  const categories = new Map<string, number>();

  for (const c of allContent) {
    c.connections.brandIds.forEach((id) => brands.set(id, (brands.get(id) ?? 0) + 1));
    c.connections.creatorIds.forEach((id) => creators.set(id, (creators.get(id) ?? 0) + 1));
    c.connections.categoryIds.forEach((id) => categories.set(id, (categories.get(id) ?? 0) + 1));
  }

  return [
    {
      id: 'browse-type',
      title: 'Browse by Type',
      tiles: [
        { dimension: 'campaign', label: 'Campaigns', href: '/spotlight?type=campaign', count: allContent.filter((c) => c.contentType === 'campaign').length },
        { dimension: 'live', label: 'Live', href: '/spotlight/live', count: allContent.filter((c) => c.isLive).length },
        { dimension: 'guide', label: 'Guides', href: '/guides', count: allContent.filter((c) => ['buying_guide', 'tutorial'].includes(c.contentType)).length },
        { dimension: 'recommendation', label: 'Recommendations', href: '/recommendations', count: allContent.filter((c) => c.contentType === 'recommendation').length },
        { dimension: 'collection', label: 'Collections', href: '/spotlight/explore?tab=collections' },
        { dimension: 'series', label: 'Series', href: '/spotlight/explore?tab=series' },
        { dimension: 'trending', label: 'Trending', href: '/spotlight' },
      ],
    },
    {
      id: 'browse-entity',
      title: 'Browse by Entity',
      tiles: [
        { dimension: 'brand', label: 'Brands', href: '/brands', count: brands.size },
        { dimension: 'creator', label: 'Creators', href: '/creators', count: creators.size },
        { dimension: 'publisher', label: 'Publishers', href: '/spotlight/explore?tab=publishers' },
        { dimension: 'product', label: 'Products', href: '/products' },
        { dimension: 'service', label: 'Services', href: '/products?type=service' },
        { dimension: 'category', label: 'Categories', href: '/categories', count: categories.size },
      ],
    },
  ];
}
