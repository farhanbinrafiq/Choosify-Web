/**
 * The data a storefront brand card (BrandCardDesign) shows, built from a catalog
 * brand. Shared by the Brands page and search results so a brand looks the same
 * everywhere: logo, cover, Best For tags, price range, claim/verified state.
 * Real figures only — no placeholder price range or score.
 */
type CatalogBrandLike = {
  id: string | number;
  catalogId?: string;
  slug?: string;
  publicHandle?: string | null;
  name: string;
  logo?: unknown;
  ratings?: number;
  followers?: number;
  category?: string;
  overview?: { tags?: string[]; priceRange?: string } | null;
  sponsoredFlag?: boolean;
  featuredFlag?: boolean;
  verifiedStatus?: boolean;
  ownership?: { state?: string; claimable?: boolean } | null;
  createdAt?: string;
  updatedAt?: string;
  coverImage?: string;
};

export function toBrandCardData(brand: CatalogBrandLike) {
  return {
    id: String(brand.catalogId || brand.slug || brand.id),
    catalogId: brand.catalogId,
    slug: brand.slug,
    publicHandle: brand.publicHandle,
    name: brand.name,
    description: `${brand.name} official listing on Choosify`,
    logo: typeof brand.logo === 'string' ? brand.logo : brand.name.slice(0, 2).toUpperCase(),
    rating: brand.ratings || 0,
    reviews: brand.followers || 0,
    followers: brand.followers || 0,
    // Best For = the brand's own Best-for tags (never its category).
    bestFor: (brand.overview?.tags || []).join(' · '),
    bestForTags: brand.overview?.tags || [],
    priceRange: brand.overview?.priceRange?.trim() || null,
    category: brand.category || 'General',
    isHot: brand.sponsoredFlag,
    isFeatured: brand.featuredFlag,
    sponsoredFlag: brand.sponsoredFlag,
    featuredFlag: brand.featuredFlag,
    verifiedStatus: brand.verifiedStatus,
    ownership: brand.ownership,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
    coverImage: brand.coverImage,
  };
}
