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
  /** Seller-added links beyond the presets (Discord, Threads, a blog, …). */
  custom?: Array<{ label: string; url: string }>;
}

export interface CatalogBrandOverview {
  address?: string;
  /** Google Maps (or any map) URL for the shop address — "Open on Maps" link. */
  mapLink?: string;
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
  /** Multi-entry hybrid Brand Story sections — `text` / `link` / `content`. Falls back to `story` when empty. */
  storyBlocks?: Array<{
    id: string;
    heading: string;
    body: string;
    kind?: 'text' | 'link' | 'content';
    url?: string;
    thumbnail?: string;
    contentId?: string;
    mediaKind?:
      | 'youtube'
      | 'youtube_shorts'
      | 'instagram_reel'
      | 'instagram_post'
      | 'tiktok'
      | 'facebook'
      | 'other';
  }>;
  /** Derived mirror — the `contentId`s of the `content` story sections, in order. */
  pinnedStoryContentIds?: string[];
  credentials?: string;
  overview?: CatalogBrandOverview;
  faq?: CatalogBrandFaq[];
  stores?: CatalogBrandStores;
  /** Seller-curated product ids spotlighted at the top of the brand "Top Deals & Coupons" section, in order. */
  pinnedProductIds?: string[];
  /** Seller-curated product ids pinned to the front of the brand Products grid, in order. */
  pinnedShowcaseProductIds?: string[];
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
  /** Optional single canonical storefront product video: a YouTube URL, a direct
   *  HTTPS video file URL (.mp4/.webm/.mov), or a `/media/products/*.mp4` served
   *  by the platform. Empty / absent = no product video. Feeds the Product Detail
   *  media gallery alongside `image` + `gallery`. */
  videoUrl?: string;
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
  /** Average customer star rating when known (0–5). */
  rating?: number;
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
  mediaType?: 'photo' | 'video';
  mediaUrl?: string;
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
  /** Optional sponsor mark for carousel logo pagination / PROMOTED chrome */
  brandName?: string;
  brandLogoUrl?: string;
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
  topCategories?: Array<{ id: string; label: string; image: string; link?: string; order: number }>;
  viralTodayItems?: Array<{
    id: string;
    title: string;
    mediaType: 'photo' | 'video';
    mediaUrl: string;
    thumbnailUrl?: string;
    badge?: string;
    order: number;
  }>;
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
    tagline?: string;
    contactEmail?: string;
    contactPhone?: string;
    usaOffice?: { title: string; lines?: string[]; address?: string };
    bangladeshOffice?: { title: string; lines?: string[]; address?: string };
    paymentsAccepted?: Array<{
      id: string;
      label: string;
      image: string;
      enabled?: boolean;
      order?: number;
      url?: string;
    }>;
    deliveryPartners?: Array<{
      id: string;
      label: string;
      image: string;
      enabled?: boolean;
      order?: number;
      url?: string;
    }>;
    platforms?: Array<{
      id: string;
      platform: string;
      store: string;
      href: string;
      qrImage?: string;
      enabled?: boolean;
    }>;
    dbid?: string;
    tradeLicense?: string;
    showPaymentIcons?: boolean;
    showDeliveryPartners?: boolean;
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
  /** Informational / legal / business page bodies from Website Manager → Pages */
  sitePages?: import('../lib/cmsSitePages').SitePagesConfig;
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
  /** Creator-defined extra links (Twitch, Threads, personal site, …). `label` is
   *  the display name; `url` must be http(s). Max 8. */
  custom?: Array<{ label: string; url: string }>;
}

/** One curated "Featured Content" card on a Creator profile. */
export interface CatalogCreatorFeaturedItem {
  id: string;
  /** 'platform' → a Choosify Guide the creator published; 'external' → an
   *  off-platform link with a creator-supplied thumbnail. */
  source: 'platform' | 'external';
  kind: 'guide' | 'video' | 'reel' | 'blog' | 'link';
  /** Canonical Guide/content id when source === 'platform'. */
  contentId?: string;
  title: string;
  thumbnail: string;
  /** Storefront href (platform) or external URL. */
  url: string;
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
  brandPartners?: { name: string; color?: string; brandId?: string; logo?: string }[];
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
  /** Creator-curated Featured Content — a mix of their own Choosify Guides and
   *  external links (with a custom thumbnail). Empty ⇒ the profile falls back to
   *  the newest videos/reels/blogs. */
  featuredContent?: CatalogCreatorFeaturedItem[];
  status: 'draft' | 'live' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type GuideEntityRef = {
  entityType: 'product' | 'brand' | 'external_product' | 'external_brand';
  entityId: string;
};
export interface GuideSocialLink {
  id: string;
  platform: 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'twitch' | 'vimeo' | 'other';
  url: string;
  label?: string;
  enabled?: boolean;
  sortOrder?: number;
}
export interface GuideExternalRef {
  id: string;
  kind: 'product' | 'brand';
  title: string;
  imageUrl?: string;
  externalUrl: string;
  subtitle?: string;
  brandName?: string;
  commentary?: string;
  sortOrder?: number;
  /** Up to 4 short "why it's good for…" keyword chips shown on the card. */
  highlightTags?: string[];
}
export interface GuideLiveOffer {
  id: string;
  productId: string;
  promoPrice?: number;
  discountType?: 'percent' | 'amount';
  discountValue?: number;
  startsAt: string;
  endsAt: string;
  enabled?: boolean;
}

export interface CatalogGuide {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorAvatar?: string;
  category: string;
  excerpt?: string;
  /** Primary cover photo (= gallery[0]). May be empty for a video-only guide. */
  image: string;
  /** Ordered hero photo list (primary + extras). Independent of `videoUrl`. */
  gallery?: string[];
  videoUrl?: string;
  duration?: string;
  type: 'article' | 'reels' | 'video' | 'shorts';
  readTime: string;
  views: string;
  shares?: string;
  tags: string[];
  creatorId?: string;
  /** Public publisher identity: 'creator' (default, uses creatorId) or 'brand' (uses publisherBrandId). */
  publisherType?: 'creator' | 'brand';
  /** Canonical CatalogBrand id when publisherType === 'brand' — the AUTHOR, distinct from brandIds (mentions). */
  publisherBrandId?: string;
  /** Read-only enrichment on GET responses — resolved publisher brand identity. Never persisted. */
  publisherBrand?: { id: string; name: string; logo?: string; slug?: string };
  productIds: string[];
  /** Brands the guide MENTIONS / discusses ("Brand Mentioned"). Not authorship. Real CatalogBrand ids. */
  brandIds?: string[];
  /** Canonical main editorial/article body (plain text). Separate from Key Takeaways. */
  body?: string;
  socialLinks?: GuideSocialLink[];
  externalRefs?: GuideExternalRef[];
  liveOffers?: GuideLiveOffer[];
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

export type CatalogProductGuideType =
  | 'size'
  | 'measurement'
  | 'compatibility'
  | 'fitment'
  | 'feature'
  | 'custom';

export interface CatalogProductSizeGuide {
  /** Set true in Studio to expose the guide on the product detail page */
  enabled: boolean;
  /** Storefront CTA context ("View Size Guide", "View Compatibility Guide", …).
   *  Absent ⇒ 'size' (back-compat). */
  guideType?: CatalogProductGuideType;
  /** Custom CTA label, used when `guideType === 'custom'`. */
  label?: string;
  type?: 'table' | 'image' | 'html';
  title?: string;
  description?: string;
  imageUrl?: string;
  htmlContent?: string;
  unitLabel?: string;
  columnHeaders?: string[];
  rows?: CatalogProductSizeGuideRow[];
}

/** Storefront CTA label for a product guide, from its type / custom label. */
export function productGuideCtaLabel(g?: Partial<CatalogProductSizeGuide> | null): string {
  const t = g?.guideType || 'size';
  if (t === 'custom') return (g?.label || '').trim() || 'View Guide';
  const map: Record<Exclude<CatalogProductGuideType, 'custom'>, string> = {
    size: 'View Size Guide',
    measurement: 'View Measurement Guide',
    compatibility: 'View Compatibility Guide',
    fitment: 'View Fitment Guide',
    feature: 'View Feature Guide',
  };
  return map[t as Exclude<CatalogProductGuideType, 'custom'>] || 'View Guide';
}

/** One "Where to Buy / Price Across Stores" row. `source` marks ownership. */
export interface RelatedStoreEntry {
  id: string;
  storeName: string;
  price: number;
  availability: string;
  storeRating?: number;
  storeUrl?: string;
  storeLocation?: string;
  isFeatured?: boolean;
  logoUrl?: string;
  source?: 'seller' | 'admin';
  promoLabel?: string;
  priority?: number;
  adRef?: string;
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
  /** Seller-owned "Where to Buy / Price Across Stores" rows. */
  storeComparisonList: RelatedStoreEntry[];
  /** Explicit Related Information variant chosen in Product Studio. */
  relatedInfoType?: 'price_across_stores' | 'whats_nearby' | 'before_your_visit' | 'custom';
  /** Seller-defined Related Information section (titled heading + bullet blocks). */
  customRelatedInfo?: {
    title?: string;
    blocks?: Array<{ id: string; heading: string; items: string[] }>;
  };
  /** Admin-only section lock — seller sees Related Information read-only. */
  relatedInfoLockedByAdmin?: boolean;
  /** Choosify/admin-owned promoted "Where to Buy" entries (independent list). */
  adminPromotedStores?: RelatedStoreEntry[];
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
  optionGroups: Array<{
    id: string;
    name: string;
    displayType: string;
    values: string[];
    /** Additive (hybrid variants): seller-added product-only dimension (not a
     *  category schema facet). Absent ⇒ category-schema dimension. */
    custom?: boolean;
    /** Additive (hybrid variants): values the seller appended to a category
     *  `select` dimension beyond its schema option list. Not search facets. */
    customValues?: string[];
  }>;
  productVariants: Array<{
    id: string;
    sku: string;
    price?: number;
    /** Additive (variants sprint): per-variant MRP / strike price. */
    originalPrice?: number;
    stock?: number;
    options: Record<string, string>;
    images?: string[];
    /** Legacy on/off flag — still honored. `status` wins when both are present. */
    enabled?: boolean;
    /**
     * Additive (variants sprint): explicit lifecycle. Backward compatible —
     * absent ⇒ derive from `enabled` (enabled !== false ⇒ 'active').
     */
    status?: 'active' | 'inactive';
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
  enableDeliveryInfo?: boolean;
  enableWarrantyInfo?: boolean;

  /** Seller-authored "Delivery Information" block (region + quick-service delivery
   *  facts). Absent ⇒ platform default. */
  deliveryInfo?: {
    region?: string;
    bullets?: string[];
  };
  /** "Warranty & After-Sales Services" — after-sales bullet list. */
  afterSalesInfo?: {
    bullets?: string[];
  };

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
  publicReviews?: Array<{
    id: string;
    reviewerName: string;
    rating: number;
    comment: string;
    reviewerAvatar?: string;
  }>;
  /**
   * Optional paid extras bought alongside the main item (distinct from variants).
   * `enabled`/`sortOrder`/`badge`/`maxQuantity` are additive (add-ons sprint) —
   * backward compatible: absent `enabled` ⇒ true.
   */
  addonItems?: Array<{
    id: string;
    title: string;
    description?: string;
    price: number;
    enabled?: boolean;
    sortOrder?: number;
    badge?: string;
    /** When set (≥1), the buyer may pick a quantity of this add-on up to this cap. */
    maxQuantity?: number;
  }>;
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
