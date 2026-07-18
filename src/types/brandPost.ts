export type BrandPostKind = 'event' | 'announcement' | 'festival' | 'carnival' | 'launch' | 'campaign' | 'store_moment';

export type BrandPostStatus = 'scheduled' | 'live' | 'expired';

export interface BrandPost {
  id: string;
  slug: string;
  brandId: number;
  brandName: string;
  brandLogo?: string;
  kind: BrandPostKind;
  title: string;
  excerpt: string;
  /** Primary thumbnail for cards and listings */
  heroImage: string;
  /** Optional full-width edge-to-edge banners on the detail page (falls back to heroImage) */
  bannerImages?: string[];
  body: string[];
  startDate?: string;
  endDate?: string;
  location?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  linkedProductIds?: number[];
  sponsored: boolean;
  status: BrandPostStatus;
  publishedAt: string;
}

export const BRAND_POST_KIND_LABELS: Record<BrandPostKind, string> = {
  event: 'Event',
  announcement: 'Announcement',
  festival: 'Festival',
  carnival: 'Carnival',
  launch: 'Product Launch',
  campaign: 'Brand Promotion',
  store_moment: 'Store Moment',
};
