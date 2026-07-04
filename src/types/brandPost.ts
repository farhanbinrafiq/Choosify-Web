export type BrandPostKind = 'event' | 'launch' | 'festival' | 'campaign' | 'store_moment';

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
  heroImage: string;
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
  launch: 'Product Launch',
  festival: 'Festival',
  campaign: 'Campaign',
  store_moment: 'Store Moment',
};
