import type { PageHeroBannerKey } from '../components/PageHeroBanner';
import type { SiteConfig, SiteHeroTickerItem } from '../types/catalog';

const DEFAULT_TICKERS: Record<PageHeroBannerKey, SiteHeroTickerItem[]> = {
  home: [
    {
      id: 'home-1',
      pageKey: 'home',
      order: 1,
      isActive: true,
      segments: [
        { text: '100% ' },
        { text: 'Original Products', emphasis: true },
        { text: ' — verified shops across Bangladesh' },
      ],
    },
    {
      id: 'home-2',
      pageKey: 'home',
      order: 2,
      isActive: true,
      segments: [
        { text: 'Shop ' },
        { text: 'Authentic Outlets', emphasis: true },
        { text: ' — no more online scams' },
      ],
    },
  ],
  products: [
    {
      id: 'products-1',
      pageKey: 'products',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Browse ' },
        { text: 'Verified Products', emphasis: true },
        { text: ' from trusted Bangladeshi brands' },
      ],
    },
    {
      id: 'products-2',
      pageKey: 'products',
      order: 2,
      isActive: true,
      segments: [
        { text: 'Compare specs, prices & ' },
        { text: 'Real Reviews', emphasis: true },
      ],
    },
  ],
  categories: [
    {
      id: 'categories-1',
      pageKey: 'categories',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Explore ' },
        { text: 'Every Category', emphasis: true },
        { text: ' — fashion, tech, lifestyle & more' },
      ],
    },
  ],
  brands: [
    {
      id: 'brands-1',
      pageKey: 'brands',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Aarong' },
        { text: ' • ' },
        { text: 'Yellow' },
        { text: ' • ' },
        { text: 'Sailor', emphasis: true },
        { text: ' • Apex • Ecstasy • Richman' },
      ],
    },
  ],
  guides: [
    {
      id: 'guides-1',
      pageKey: 'guides',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Expert ' },
        { text: 'Buying Guides', emphasis: true },
        { text: ' — YouTube, reels & editorial reviews' },
      ],
    },
  ],
  deals: [
    {
      id: 'deals-1',
      pageKey: 'deals',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Flash ' },
        { text: 'Deals & Offers', emphasis: true },
        { text: ' — limited stock, verified sellers' },
      ],
    },
    {
      id: 'deals-2',
      pageKey: 'deals',
      order: 2,
      isActive: true,
      segments: [
        { text: 'Extra ' },
        { text: '15% Off', emphasis: true },
        { text: ' on select brands this week' },
      ],
    },
  ],
  'whats-on': [
    {
      id: 'whats-on-1',
      pageKey: 'whats-on',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Brand ' },
        { text: 'Events & Launches', emphasis: true },
        { text: ' happening across Bangladesh' },
      ],
    },
  ],
  search: [
    {
      id: 'search-1',
      pageKey: 'search',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Search ' },
        { text: 'Everything', emphasis: true },
        { text: ' — products, brands, guides & deals' },
      ],
    },
  ],
  creators: [
    {
      id: 'creators-1',
      pageKey: 'creators',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Follow ' },
        { text: 'Trusted Creators', emphasis: true },
        { text: ' who verify before you buy' },
      ],
    },
  ],
  'brand-deals': [
    {
      id: 'brand-deals-1',
      pageKey: 'brand-deals',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Partner ' },
        { text: 'Brand Deals', emphasis: true },
        { text: ' — exclusive offers from verified partners' },
      ],
    },
  ],
  compare: [
    {
      id: 'compare-1',
      pageKey: 'compare',
      order: 1,
      isActive: true,
      segments: [
        { text: 'Compare ' },
        { text: 'Before You Buy', emphasis: true },
        { text: ' — specs, prices & verified reviews' },
      ],
    },
  ],
};

export function getHeroTickerItems(
  pageKey: PageHeroBannerKey,
  siteConfig?: SiteConfig | null,
): SiteHeroTickerItem[] {
  const cmsItems = (siteConfig?.heroTickers ?? [])
    .filter((item) => item.isActive && item.pageKey === pageKey && item.segments.length > 0)
    .sort((a, b) => a.order - b.order);

  if (cmsItems.length > 0) return cmsItems;
  return DEFAULT_TICKERS[pageKey] ?? [];
}
