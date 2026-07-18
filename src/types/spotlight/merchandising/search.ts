import type { CatalogPublishStatus } from '../../catalog';

export type SpotlightProductSearchSortKey =
  | 'newest'
  | 'oldest'
  | 'popularity'
  | 'alphabetical'
  | 'price_asc'
  | 'price_desc'
  | 'rating';

export interface SpotlightProductSearchFilters {
  query?: string;
  sku?: string;
  brandId?: string;
  brandName?: string;
  categoryId?: string;
  categoryName?: string;
  sellerId?: string;
  tag?: string;
  campaignId?: string;
  priceMin?: number;
  priceMax?: number;
  status?: CatalogPublishStatus;
  minRating?: number;
  inStockOnly?: boolean;
  verifiedSellerOnly?: boolean;
  recentlyUpdatedDays?: number;
}

export interface SpotlightProductSearchRequest {
  filters: SpotlightProductSearchFilters;
  sortBy: SpotlightProductSearchSortKey;
  page?: number;
  pageSize?: number;
}
