/**
 * LE-006.3 — Mock sponsored placements (no backend)
 */

import type { SponsoredPlacementItem, SponsoredPlacementSurface, SponsoredPlacementKind } from '../../types/commerce/sponsoredPlacement';

const DEMO_BRANDS: SponsoredPlacementItem[] = [
  {
    id: 'demo-samsung-product',
    kind: 'product',
    sponsorName: 'Samsung',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200',
    isVerified: true,
    sponsoredLabel: 'Sponsored by Samsung',
    href: '/products/1',
    ctaLabel: 'Shop Now',
    title: 'Galaxy S24 Ultra',
    subtitle: 'Flagship AI smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    productId: '1',
    brandId: 'samsung',
  },
  {
    id: 'demo-apple-launch',
    kind: 'launch',
    sponsorName: 'Apple',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200',
    isVerified: true,
    sponsoredLabel: 'Sponsored by Apple',
    href: '/spotlight/demo-campaign',
    ctaLabel: 'View Details',
    title: 'iPhone Launch Spotlight',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
    spotlightSlug: 'demo-campaign',
  },
  {
    id: 'demo-pickaboo-deal',
    kind: 'deal',
    sponsorName: 'Pickaboo',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200',
    isVerified: true,
    sponsoredLabel: 'Sponsored',
    href: '/deals',
    ctaLabel: 'View Deals',
    title: 'Tech Week Deals',
    subtitle: 'Free delivery on orders ৳5,000+',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
  },
  {
    id: 'demo-bata-brand',
    kind: 'brand',
    sponsorName: 'Bata',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200',
    isVerified: true,
    sponsoredLabel: 'Sponsored by Bata',
    href: '/brands/4',
    ctaLabel: 'Explore Collection',
    title: 'Bata Footwear',
    subtitle: 'Back-to-school collection',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
    brandId: '4',
  },
  {
    id: 'demo-booking-service',
    kind: 'service',
    sponsorName: 'Booking.com',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
    isVerified: true,
    sponsoredLabel: 'Sponsored',
    href: '/search?q=hotels',
    ctaLabel: 'Book Now',
    title: 'Weekend Hotel Stays',
    subtitle: 'Dhaka & Cox\'s Bazar',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
  },
  {
    id: 'demo-lereve-collection',
    kind: 'collection',
    sponsorName: 'Le Reve',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200',
    isVerified: true,
    sponsoredLabel: 'Sponsored by Le Reve',
    href: '/spotlight/demo-collection',
    ctaLabel: 'Shop Collection',
    title: 'Festive Ethnic Edit',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600',
    spotlightSlug: 'demo-collection',
  },
  {
    id: 'demo-dominos-event',
    kind: 'event',
    sponsorName: "Domino's",
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
    isVerified: false,
    sponsoredLabel: 'Sponsored',
    href: '/deals',
    ctaLabel: 'Order Now',
    title: 'Pizza Night Offer',
    subtitle: 'Buy 1 Get 1 on Tuesdays',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
  },
  {
    id: 'demo-spotlight-guide',
    kind: 'guide',
    sponsorName: 'Choosify Editorial',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e939e966?w=200',
    isVerified: true,
    sponsoredLabel: 'Sponsored Guide',
    href: '/spotlight/demo-guide',
    ctaLabel: 'Read Guide',
    title: 'Best Phones 2026',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7a2be?w=600',
    spotlightSlug: 'demo-guide',
  },
];

/** Demo pool per surface — rotates without consecutive duplicates */
export function getDemoSponsoredPlacements(
  surface: SponsoredPlacementSurface,
  limit = 2,
): SponsoredPlacementItem[] {
  const poolBySurface: Partial<Record<SponsoredPlacementSurface, SponsoredPlacementKind[]>> = {
    home: ['product', 'brand', 'deal', 'collection'],
    products: ['product', 'deal', 'launch'],
    categories: ['brand', 'product'],
    brands: ['brand', 'collection', 'event'],
    deals: ['deal', 'product', 'event'],
    search: ['product', 'brand', 'service'],
    spotlight: ['spotlight', 'guide', 'creator_review', 'collection'],
    compare: ['product', 'deal'],
  };

  const kinds = poolBySurface[surface] ?? ['product', 'brand'];
  const matched = DEMO_BRANDS.filter((d) => kinds.includes(d.kind));
  return matched.slice(0, limit);
}

export { DEMO_BRANDS as SPONSORED_DEMO_CATALOG };
