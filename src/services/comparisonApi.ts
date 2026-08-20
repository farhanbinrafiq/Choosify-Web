const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

export interface ProductComparisonCard {
  id: string;
  slug: string;
  title: string;
  brandId: string;
  brandName: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isCurrent: boolean;
}

export interface ProductComparisonResult {
  current: ProductComparisonCard;
  candidates: ProductComparisonCard[];
  filter: {
    categoryName: string;
    minPrice: number;
    maxPrice: number;
    priceTolerancePercent: number;
    fallbackTier: 'primary' | 'category-25' | 'parent-20' | 'closest-price' | 'none';
  };
}

export interface BrandComparisonCard {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage?: string;
  verifiedStatus: boolean;
  category: string;
  overallRating: number;
  qualityScore: number;
  valueScore: number;
  supportScore: number;
  productCount: number;
  minPrice?: number;
  maxPrice?: number;
  isCurrent: boolean;
}

export interface BrandComparisonResult {
  current: BrandComparisonCard;
  candidates: BrandComparisonCard[];
  filter: {
    category: string;
    ratingTolerance: number;
    fallbackTier: 'primary' | 'tier-0.5' | 'parent-category' | 'none';
  };
}

export const comparisonApi = {
  getProductComparison: async (productId: string): Promise<ProductComparisonResult | null> => {
    const res = await fetch(`${API_BASE}/catalog/products/${encodeURIComponent(productId)}/comparison`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as ProductComparisonResult;
  },
  getBrandComparison: async (brandId: string): Promise<BrandComparisonResult | null> => {
    const res = await fetch(`${API_BASE}/catalog/brands/${encodeURIComponent(brandId)}/comparison`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as BrandComparisonResult;
  },
};
