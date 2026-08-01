export type CatalogPublishStatus = 'draft' | 'live' | 'archived';

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  parentId: string | null;
  enabled: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogSocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface CatalogBrandOverview {
  address?: string;
  email?: string;
  phone?: string;
  priceRange?: string;
  ageFocus?: string;
  audience?: string;
  services?: string[];
  tags?: string[];
}

export interface CatalogBrandFaq {
  q: string;
  a: string;
}

export interface CatalogBrandStores {
  authorized?: Array<{ name: string; sub?: string }>;
  distributors?: Array<{ name: string; sub?: string }>;
  serviceCenters?: Array<{ name: string; sub?: string; hours?: string }>;
}

export interface CatalogBrand {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  coverImage?: string;
  tagline?: string;
  website?: string;
  socialLinks?: CatalogSocialLinks;
  story?: string;
  credentials?: string;
  overview?: CatalogBrandOverview;
  faq?: CatalogBrandFaq[];
  stores?: CatalogBrandStores;
  verifiedStatus: boolean;
  claimStatus: 'community' | 'pending' | 'verified';
  followers: number;
  ratings: number;
  featuredFlag: boolean;
  sponsoredFlag: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  image: string;
  gallery: string[];
  modeType?: 'retail';
  productType?: 'physical' | 'service';
  serviceCategory?: string;
  relatedInfoType?: 'price_across_stores' | 'whats_nearby' | 'before_your_visit';
  /** Physical products: opt-in toggle for showing Price Across Stores. */
  priceAcrossStoresEnabled?: boolean;
  /** Seller opt-in toggle for accepting an advance/partial payment on this product. */
  partialPaymentEnabled?: boolean;
  /** Deposit percent required upfront when partialPaymentEnabled is true. */
  depositPercent?: number;
  /** Keys from SERVICE_BOOKING_FIELDS the seller requires from buyers. */
  requiredBookingFieldKeys?: string[];
  /** Service listings only. Whether a new booking request needs seller approval before pay. */
  requiresApproval?: boolean;
  price: number;
  originalPrice?: number;
  stock: number;
  status: CatalogPublishStatus;
  tags: string[];
  isDeal: boolean;
  dealType?: 'flash' | 'seasonal' | 'brand' | 'promo' | 'clearance';
  discountPercent?: number;
  promoCode?: string;
  dealValidUntil?: string;
  featuredFlag: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogDeal {
  id: string;
  slug: string;
  name: string;
  seller: string;
  category: string;
  status: 'live' | 'pending' | 'expiring' | 'expired' | 'rejected' | 'draft';
  type: 'retail';
  discountType: 'percentage' | 'flat';
  discountValue: number;
  promoCode?: string;
  productId?: string;
  brandId?: string;
  clicks: number;
  validFrom: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export type CatalogBrandPostKind = 'event' | 'announcement' | 'festival' | 'carnival' | 'launch' | 'campaign' | 'store_moment';
export type CatalogBrandPostStatus = 'scheduled' | 'live' | 'expired';

export interface CatalogBrandPost {
  id: string;
  slug: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  kind: CatalogBrandPostKind;
  title: string;
  excerpt: string;
  heroImage: string;
  bannerImages?: string[];
  body: string[];
  startDate?: string;
  endDate?: string;
  location?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  linkedProductIds?: string[];
  sponsored: boolean;
  status: CatalogBrandPostStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageHeroBanner {
  id: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage: string;
  /** Optional muted looping video for hybrid photo/video hero slides. */
  backgroundVideo?: string;
  isActive: boolean;
  order: number;
}

export type DealsBannerDestinationType = 'product' | 'brand' | 'custom-url';

export interface CatalogDealsBanner {
  id: string;
  image: string;
  destinationType: DealsBannerDestinationType;
  destinationRef: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageSectionConfig {
  id: string;
  label: string;
  isVisible: boolean;
  order: number;
  itemIds: string[];
}

export interface HomepageConfig {
  id: 'default';
  heroBanners: HomepageHeroBanner[];
  dealsBanners?: CatalogDealsBanner[];
  sections: HomepageSectionConfig[];
  featuredProductIds: string[];
  featuredBrandIds: string[];
  featuredDealIds: string[];
  featuredCreatorIds: string[];
  featuredGuideIds: string[];
  updatedAt: string;
}

export interface SiteNavItem {
  id: string;
  label: string;
  path: string;
  order: number;
}

export interface SiteFooterLink {
  label: string;
  url: string;
}

export interface SiteFooterColumn {
  id: string;
  title: string;
  links: SiteFooterLink[];
}

export interface SiteSocialLink {
  id: string;
  platform: string;
  url: string;
  isVisible: boolean;
  order: number;
}

export interface SitePopularSearch {
  id: string;
  term: string;
  order: number;
  isActive: boolean;
}

export interface SiteProductBadge {
  id: string;
  label: string;
  color: string;
  icon?: string;
  priority: number;
  isActive: boolean;
}

export type SiteHeroTickerPageKey =
  | 'home'
  | 'products'
  | 'categories'
  | 'brands'
  | 'guides'
  | 'deals'
  | 'whats-on'
  | 'search'
  | 'creators'
  | 'brand-deals'
  | 'compare';

export interface SiteHeroTickerSegment {
  text: string;
  emphasis?: boolean;
}

export interface SiteHeroTickerItem {
  id: string;
  pageKey: SiteHeroTickerPageKey;
  segments: SiteHeroTickerSegment[];
  order: number;
  isActive: boolean;
}

export interface SiteContentBadge {
  id: string;
  label: string;
  color: string;
  entityType: 'product' | 'event';
  mapsTo?: string;
  priority: number;
  isActive: boolean;
}

export interface SiteWebsiteAssets {
  navbarLogo: string;
  footerLogo: string;
  favicon: string;
  pwaIcon: string;
  defaultProductImage: string;
}

export interface SiteConfig {
  id: 'default';
  navigation: SiteNavItem[];
  footer: {
    description: string;
    copyrightText: string;
    columns: SiteFooterColumn[];
    newsletterEnabled: boolean;
  };
  socialLinks: SiteSocialLink[];
  popularSearches: SitePopularSearch[];
  seoEntries: SiteSeoEntry[];
  announcementBarText: string;
  announcementBarEnabled: boolean;
  productBadges?: SiteProductBadge[];
  contentBadges?: SiteContentBadge[];
  heroTickers?: SiteHeroTickerItem[];
  websiteAssets?: SiteWebsiteAssets;
  updatedAt: string;
}

export interface CatalogSnapshot {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  deals: CatalogDeal[];
  homepage: HomepageConfig;
  creators?: CatalogCreator[];
  guides?: CatalogGuide[];
  placements?: CatalogPlacement[];
  productDetails?: CatalogProductDetail[];
}

export interface CatalogMediaItem {
  id: string;
  title: string;
  thumbnail: string;
  views?: string;
  duration?: string;
  likes?: string;
  excerpt?: string;
  readTime?: string;
  date?: string;
  url: string;
  associatedGuideId?: string;
  /** Creator-pinned piece — surfaces first on profile tabs when set */
  pinned?: boolean;
  /** Active LIVE stream marker for profile ranking */
  isLive?: boolean;
}

export interface CatalogCreatorSocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface CatalogCreator {
  id: string;
  slug: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  role?: string;
  location?: string;
  score: number;
  bestFor: string;
  bestForTags: string[];
  platforms: string[];
  bio: string;
  followers: Record<string, string>;
  socialLinks?: CatalogCreatorSocialLinks;
  brandPartners?: { name: string; color?: string }[];
  collabTypes?: string[];
  responseTime?: string;
  preferredContact?: string;
  email?: string;
  phone?: string;
  category?: string;
  verifiedStatus: boolean;
  featuredFlag: boolean;
  videos: CatalogMediaItem[];
  reels: CatalogMediaItem[];
  blogs: CatalogMediaItem[];
  status: 'draft' | 'live' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CatalogGuide {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorAvatar?: string;
  category: string;
  excerpt?: string;
  image: string;
  videoUrl?: string;
  duration?: string;
  type: 'article' | 'reels' | 'video' | 'shorts';
  readTime: string;
  views: string;
  shares?: string;
  tags: string[];
  creatorId?: string;
  productIds: string[];
  verdict?: string;
  whatWeLike: string[];
  whatToConsider: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoOgImage?: string;
  seoCanonicalUrl?: string;
  status: 'draft' | 'live' | 'archived';
  publishedAt: string;
  updatedAt: string;
  /** Creator-pinned guide — surfaces first on profile Guides tab when set */
  pinned?: boolean;
  /**
   * Optional Content Detail sections (ordered toggles + data) from Guide Edit Studio.
   * Shape matches ContentDetailSectionConfig on SpotlightContent.
   */
  sections?: Array<{
    id: string;
    enabled: boolean;
    order: number;
    data?: Record<string, unknown>;
  }>;
  /**
   * Explicit editorial format chosen in Guide Edit Studio — drives SpotlightContentType
   * resolution (mapGuideTypeToContent) instead of inferring from category/tags text.
   */
  format?: CatalogGuideFormat;
  /** Admin-authored live session config — only meaningful when format === 'live'. */
  live?: CatalogGuideLiveConfig;
}

export type CatalogGuideFormat =
  | 'buying_guide'
  | 'product_review'
  | 'comparison'
  | 'live'
  | 'tutorial'
  | 'tips';

export interface CatalogGuideLiveConfig {
  status?: 'live' | 'upcoming' | 'replay' | 'ended';
  platform?: 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'vimeo' | 'native';
  embedUrl?: string;
  scheduledAt?: string;
}

export type CatalogPlacementSponsorType =
  | 'sponsored_product'
  | 'sponsored_brand'
  | 'spotlight_brand'
  | 'sponsored_deal'
  | 'sponsored_recommendation';

export interface CatalogPlacement {
  id: string;
  entityType: 'product' | 'brand' | 'deal' | 'guide' | 'creator';
  entityId: string;
  sponsorType: CatalogPlacementSponsorType;
  placement: string;
  title?: string;
  image?: string;
  startDate: string;
  endDate: string;
  hasCountdown: boolean;
  dealPrice?: number;
  originalPrice?: number;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogProductSizeGuideRow {
  size: string;
  [measurement: string]: string;
}

export interface CatalogProductSizeGuide {
  /** Set true in CMS to expose the size guide on the product detail page */
  enabled: boolean;
  type?: 'table' | 'image' | 'html';
  title?: string;
  description?: string;
  imageUrl?: string;
  htmlContent?: string;
  unitLabel?: string;
  columnHeaders?: string[];
  rows?: CatalogProductSizeGuideRow[];
}

export interface CatalogProductDetail {
  productId: string;
  productType?: 'physical' | 'service';
  serviceCategory?: string;
  about?: string;
  specs: { key: string; value: string }[];
  pros: string[];
  cons: string[];
  bestForTags: string[];
  storeComparisonList: Array<{
    id: string;
    storeName: string;
    price: number;
    availability: string;
    storeRating?: number;
    storeUrl?: string;
    storeLocation?: string;
    isFeatured?: boolean;
  }>;
  /** Seller toggle — Price Across Stores sidebar (physical products only). */
  priceAcrossStoresEnabled?: boolean;
  /** Service sidebar — five fixed nearby buckets keyed by NearbyCategoryKey. */
  whatsNearby?: import('./listingRelatedInfo').WhatsNearbyData;
  /** Service sidebar — before-visit text fields keyed by BeforeVisitFieldKey. */
  beforeYourVisit?: import('./listingRelatedInfo').BeforeYourVisitData;
  physicalStores: Array<{
    id: string;
    storeName: string;
    address: string;
    badgeLabel?: string;
    contactNumber?: string;
    city?: string;
  }>;
  overviewBlocks: Array<{
    id: string;
    title: string;
    content: string;
    bullets: string[];
    enabled: boolean;
    sortOrder: number;
  }>;
  optionGroups: Array<{ id: string; name: string; displayType: string; values: string[] }>;
  productVariants: Array<{
    id: string;
    sku: string;
    price?: number;
    stock?: number;
    options: Record<string, string>;
    images?: string[];
    enabled?: boolean;
  }>;
  creatorContent: Array<{
    id: string;
    platform: string;
    videoUrl: string;
    thumbnail: string;
    title: string;
    creatorHandle?: string;
    views?: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  sizeGuide?: CatalogProductSizeGuide;
  updatedAt: string;

  // Studio section on/off toggles — each gates the corresponding storefront section.
  enableSpecs?: boolean;
  enableStoreComparison?: boolean;
  enableInfluencerReviews?: boolean;
  enableOverviewSection?: boolean;
  enableBestForTags?: boolean;
  enablePhysicalStores?: boolean;
  enableBoxContents?: boolean;
  enableOptions?: boolean;
  enableActiveVariantSpecs?: boolean;
  enableAdditionalSpecs?: boolean;
  enablePublicReviews?: boolean;
  enableAddonItems?: boolean;

  boxContents?: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: string;
    image?: string;
    badge?: string;
    price?: number;
    isFree: boolean;
    enabled: boolean;
    sortOrder: number;
  }>;
  additionalSpecs?: { key: string; value: string }[];
  publicReviews?: Array<{ id: string; reviewerName: string; rating: number; comment: string }>;
  addonItems?: Array<{ id: string; title: string; description?: string; price: number }>;
}

export interface SiteSeoEntry {
  pageId: string;
  pageLabel: string;
  title: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}
