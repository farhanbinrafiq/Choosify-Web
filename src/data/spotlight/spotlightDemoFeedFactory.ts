/**
 * LE-006.3.1 — Spotlight Demo Feed Factory
 * Generates a balanced commerce discovery feed for UX validation (frontend only).
 */

import type { SpotlightContent } from '../../types/spotlight/experience/content';
import type { SpotlightContentType } from '../../types/spotlight/experience/contentTypes';
import type { SpotlightPublisher } from '../../types/spotlight/experience/publisher';
import type { UniversalMedia } from '../../components/media/types/mediaModel';
import { EMPTY_SPOTLIGHT_CONNECTIONS } from '../../types/spotlight/experience/connections';
import { EMPTY_SPOTLIGHT_GRAPH } from '../../types/spotlight/experience/contentGraph';
import { EMPTY_SPOTLIGHT_COMMERCE } from '../../types/spotlight/experience/commerceOverlay';
import { getSpotlightContentCtaLabel } from '../../types/spotlight/experience/cta';
import { spotlightContentHref } from '../../lib/spotlight/content';
import { enrichContentWithDiscoveryScore } from '../../utils/spotlightDiscoveryScore';
import {
  publisherFromBrand,
  publisherFromCreator,
  publisherFromEditorial,
} from '../../utils/spotlightPublisherResolver';

export interface DemoSpotlightFeedConfig {
  creatorReviews?: number;
  buyingGuides?: number;
  editorialArticles?: number;
  brandStories?: number;
  brandCampaigns?: number;
  productReviews?: number;
  productLaunches?: number;
  liveShopping?: number;
  sponsoredProducts?: number;
  sponsoredBrands?: number;
  offers?: number;
  reels?: number;
  landscapeVideos?: number;
  blogs?: number;
  collections?: number;
  services?: number;
  carousels?: number;
}

export const DEFAULT_DEMO_SPOTLIGHT_FEED_CONFIG: Required<DemoSpotlightFeedConfig> = {
  creatorReviews: 5,
  buyingGuides: 5,
  editorialArticles: 5,
  brandStories: 5,
  brandCampaigns: 6,
  productReviews: 5,
  productLaunches: 5,
  liveShopping: 4,
  sponsoredProducts: 6,
  sponsoredBrands: 4,
  offers: 6,
  reels: 12,
  landscapeVideos: 8,
  blogs: 6,
  collections: 4,
  services: 5,
  carousels: 4,
};

type MediaProfile = 'reel' | 'landscape' | 'square' | 'blog' | 'carousel' | 'live';

interface DemoBrand {
  id: string;
  name: string;
  logo: string;
  category: string;
}

interface DemoCreator {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

interface DemoService {
  id: string;
  name: string;
  logo: string;
  type: SpotlightPublisher['publisherType'];
}

const DEMO_BRANDS: DemoBrand[] = [
  { id: 'samsung', name: 'Samsung', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', category: 'Electronics' },
  { id: 'apple', name: 'Apple', logo: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', category: 'Electronics' },
  { id: 'xiaomi', name: 'Xiaomi', logo: 'https://images.unsplash.com/photo-1598327272324-554caa1e387e?w=400', category: 'Electronics' },
  { id: 'walton', name: 'Walton', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Electronics' },
  { id: 'pickaboo', name: 'Pickaboo', logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', category: 'Tech Retail' },
  { id: 'bata', name: 'Bata', logo: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', category: 'Footwear' },
  { id: 'aarong', name: 'Aarong', logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', category: 'Fashion' },
  { id: 'lereve', name: 'Le Reve', logo: 'https://images.unsplash.com/photo-1483985988355-763728e3685b?w=400', category: 'Fashion' },
  { id: 'dominos', name: "Domino's", logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', category: 'Food' },
  { id: 'kfc', name: 'KFC', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', category: 'Food' },
  { id: 'unilever', name: 'Unilever', logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', category: 'FMCG' },
  { id: 'pran', name: 'Pran', logo: 'https://images.unsplash.com/photo-1560493676-04071c5fef73?w=400', category: 'FMCG' },
];

const DEMO_CREATORS: DemoCreator[] = [
  { id: 'nafis', name: 'Nafis Anjum', avatar: 'https://i.pravatar.cc/150?u=nafis-spotlight', score: 92 },
  { id: 'tasnim', name: 'Tasnim Rahman', avatar: 'https://i.pravatar.cc/150?u=tasnim-spotlight', score: 88 },
  { id: 'farhan', name: 'Farhan Rafiq', avatar: 'https://i.pravatar.cc/150?u=farhan-spotlight', score: 90 },
  { id: 'sarah', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah-spotlight', score: 86 },
  { id: 'riaz', name: 'Riaz Hossain', avatar: 'https://i.pravatar.cc/150?u=riaz-spotlight', score: 84 },
];

const DEMO_SERVICES: DemoService[] = [
  { id: 'booking', name: 'Booking.com', logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', type: 'travel_agency' },
  { id: 'airbnb', name: 'Airbnb', logo: 'https://images.unsplash.com/photo-1522708323590-d24dbb93b7bf?w=400', type: 'travel_agency' },
  { id: 'radisson', name: 'Radisson', logo: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400', type: 'hotel' },
  { id: 'seapearl', name: 'Sea Pearl', logo: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', type: 'hotel' },
  { id: 'westin', name: 'The Westin', logo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', type: 'hotel' },
];

const MEDIA_IMAGES: Record<MediaProfile, string[]> = {
  reel: [
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7a2be?w=800',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  ],
  landscape: [
    'https://images.unsplash.com/photo-1611162617474-5b21e939e966?w=1200',
    'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=1200',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
  ],
  square: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa0?w=800',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
  ],
  blog: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
  ],
  carousel: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    'https://images.unsplash.com/photo-1483985988355-763728e3685b?w=800',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
  ],
  live: [
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7a2be?w=1200',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
  ],
};

const HEADLINES: Partial<Record<SpotlightContentType, string[]>> = {
  creator_review: [
    'Galaxy S24 Ultra — 30-Day Creator Verdict',
    'MacBook Air M3 — Student Creator Review',
    'Best Budget TWS Earbuds Under ৳3,000',
    'Walton Smart TV — Honest Living Room Test',
    'Aarong Festive Kurti Haul — Worth It?',
  ],
  buying_guide: [
    'Best Smartphones to Buy in 2026',
    'Back-to-School Laptop Guide — Bangladesh',
    'How to Choose Running Shoes That Last',
    'Smart TV Buying Checklist for Dhaka Homes',
    'Festive Fashion Edit — What to Shop First',
  ],
  editorial: [
    'Why Choosify Trust Scores Matter for Shoppers',
    'The Rise of Live Commerce in Bangladesh',
    '5 Retail Trends Shaping 2026',
    'How Brands Win on Discovery Platforms',
    'Inside Pickaboo\'s Same-Day Delivery Promise',
  ],
  brand_story: [
    'Aarong — Craft Heritage Meets Modern Retail',
    'Samsung Galaxy AI — Built for Bangladesh',
    'Bata Steps Forward — School Season Story',
    'Pran Farm to Shelf — Quality You Can Trace',
    'Le Reve — Festive Collection Behind the Scenes',
  ],
  campaign: [
    'Tech Week — Up to 35% Off Flagships',
    'Samsung Galaxy Launch Campaign',
    'Aarong Eid Collection Preview',
    'Pickaboo Flash Upgrade Weekend',
    'Walton Home Appliance Mega Sale',
  ],
  product_review: [
    'iPhone 16 Pro Max — Camera Deep Dive',
    'Redmi Note 13 Pro — Battery & Display Test',
    'Nike Air Zoom — Comfort Benchmark',
    'Sony WH-1000XM5 — Commute Review',
    'Galaxy Watch 7 — Fitness Accuracy Check',
  ],
  new_launch: [
    'Galaxy S25 Series — Official Launch Spotlight',
    'Apple Vision Pro SE — First Look',
    'Xiaomi 14 Ultra — Photography Launch',
    'Domino\'s Artisan Pizza Line — Now Live',
    'KFC Crunch Wrap — Limited Launch',
  ],
  live: [
    'Live: Samsung Flagship Unboxing & Deals',
    'Live: Aarong Festive Fashion Show',
    'Live: Pickaboo Tech Hour — Ask & Shop',
    'Live: Bata Back-to-School Shoe Drop',
  ],
  promotion: [
    'Flash Sale — 48 Hours Only',
    'Domino\'s Buy 1 Get 1 Tuesday',
    'KFC Family Bucket — 25% Off',
    'Booking.com Weekend Stay Deals',
    'Sea Pearl Resort — Early Bird Offer',
  ],
  recommendation: [
    'Festive Ethnic Edit — Curated Collection',
    'Smart Home Starter Kit — Shop the Look',
    'Campus Tech Essentials — 8 Picks',
    'Monsoon Footwear Capsule',
  ],
  whats_on: [
    'Radisson Rooftop Dining Experience',
    'Airbnb Experiences — Dhaka Food Walk',
    'The Westin Spa Weekend Package',
    'Booking.com Cox\'s Bazar Stays',
  ],
};

let demoRegistry = new Map<string, SpotlightContent>();

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function buildMedia(profile: MediaProfile, index: number, title: string): UniversalMedia {
  const images = MEDIA_IMAGES[profile];
  const thumb = pick(images, index);
  const carouselUrls =
    profile === 'carousel'
      ? [pick(images, index), pick(images, index + 1), pick(images, index + 2)]
      : [thumb];

  const base = {
    mediaId: `demo-media-${profile}-${index}`,
    thumbnail: thumb,
    posterImage: thumb,
    previewImage: thumb,
    imageUrls: carouselUrls,
    displayOrder: 0,
    altText: title,
  };

  if (profile === 'reel') {
    return {
      ...base,
      mediaType: 'vertical_video',
      orientation: 'portrait',
      aspectRatio: '9:16',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };
  }
  if (profile === 'landscape' || profile === 'live') {
    return {
      ...base,
      mediaType: profile === 'live' ? 'livestream' : 'landscape_video',
      orientation: 'landscape',
      aspectRatio: '16:9',
      videoUrl: profile === 'live' ? undefined : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };
  }
  if (profile === 'square') {
    return {
      ...base,
      mediaType: 'square_image',
      orientation: 'square',
      aspectRatio: '1:1',
    };
  }
  if (profile === 'carousel') {
    return {
      ...base,
      mediaType: 'carousel',
      orientation: 'square',
      aspectRatio: '1:1',
    };
  }
  return {
    ...base,
    mediaType: 'landscape_image',
    orientation: 'landscape',
    aspectRatio: '16:9',
  };
}

function servicePublisher(service: DemoService): SpotlightPublisher {
  return {
    publisherId: `service-${service.id}`,
    name: service.name,
    logoUrl: service.logo,
    publisherType: service.type,
    isVerified: true,
    badges: ['Verified Partner'],
    trustScore: 88,
    profileHref: `/search?q=${encodeURIComponent(service.name)}`,
  };
}

interface BuildItemOptions {
  index: number;
  contentType: SpotlightContentType;
  mediaProfile: MediaProfile;
  publisher: SpotlightPublisher;
  headline: string;
  description: string;
  badges: string[];
  isSponsored?: boolean;
  isLive?: boolean;
  productIds?: string[];
  brandIds?: string[];
  serviceIds?: string[];
  popularityScore?: number;
  slugPrefix: string;
}

function buildDemoItem(opts: BuildItemOptions): SpotlightContent {
  const slug = `${opts.slugPrefix}-${opts.index + 1}`;
  const productIds = opts.productIds ?? [String((opts.index % 8) + 1)];
  const brandIds = opts.brandIds ?? [];

  const item: SpotlightContent = {
    contentId: `demo-feed-${slug}`,
    slug,
    contentType: opts.contentType,
    sourceKind: 'synthetic',
    sourceId: slug,
    publisher: opts.publisher,
    headline: opts.headline,
    description: opts.description,
    media: buildMedia(opts.mediaProfile, opts.index, opts.headline),
    connections: {
      ...EMPTY_SPOTLIGHT_CONNECTIONS,
      productIds,
      brandIds,
      serviceIds: opts.serviceIds ?? [],
      creatorIds:
        opts.publisher.publisherType === 'creator' ? [opts.publisher.publisherId.replace('creator-', '')] : [],
    },
    graph: {
      ...EMPTY_SPOTLIGHT_GRAPH,
      relatedProductIds: productIds,
      relatedBrandIds: brandIds,
    },
    commerce: {
      ...EMPTY_SPOTLIGHT_COMMERCE,
      featuredProductIds: productIds,
      featuredServiceIds: opts.serviceIds ?? [],
      primaryCta: {
        label: getSpotlightContentCtaLabel(opts.contentType),
        href: spotlightContentHref(slug),
      },
    },
    live:
      opts.isLive || opts.mediaProfile === 'live'
        ? {
            status: opts.isLive ? 'live' : 'upcoming',
            platform: 'youtube',
            productIds,
            serviceIds: opts.serviceIds ?? [],
            pinnedProductIds: productIds.slice(0, 2),
            pinnedOfferIds: [],
            notifyMeEnabled: true,
            timelinePlaceholder: true,
          }
        : undefined,
    badges: opts.badges,
    isSponsored: opts.isSponsored ?? false,
    isLive: opts.isLive ?? opts.mediaProfile === 'live',
    isVerified: opts.publisher.isVerified,
    ctaLabel: getSpotlightContentCtaLabel(opts.contentType),
    href: spotlightContentHref(slug),
    publishedAt: new Date(Date.now() - opts.index * 86_400_000).toISOString(),
    popularityScore: opts.popularityScore ?? 1200 + opts.index * 137,
    extraProductCount: Math.max(0, productIds.length - 1),
  };

  return enrichContentWithDiscoveryScore(item);
}

function generateBatch(
  count: number,
  startIndex: number,
  buildOne: (i: number, globalIndex: number) => SpotlightContent,
): SpotlightContent[] {
  return Array.from({ length: count }, (_, i) => buildOne(i, startIndex + i));
}

/** Registry lookup for Universal Spotlight Details routing */
export function getDemoSpotlightContentBySlug(slug: string): SpotlightContent | undefined {
  return demoRegistry.get(slug);
}

/** Build a balanced demo commerce feed — proportions configurable */
export function buildDemoSpotlightFeed(
  config: DemoSpotlightFeedConfig = DEFAULT_DEMO_SPOTLIGHT_FEED_CONFIG,
): SpotlightContent[] {
  const cfg = { ...DEFAULT_DEMO_SPOTLIGHT_FEED_CONFIG, ...config };
  let idx = 0;
  const items: SpotlightContent[] = [];

  const push = (...batch: SpotlightContent[]) => {
    batch.forEach((item) => {
      items.push(item);
      demoRegistry.set(item.slug, item);
    });
  };

  push(
    ...generateBatch(cfg.reels, idx, (_i, g) => {
      const brand = pick(DEMO_BRANDS, g);
      const creator = pick(DEMO_CREATORS, g);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-reel',
        contentType: g % 3 === 0 ? 'creator_review' : 'recommendation',
        mediaProfile: 'reel',
        publisher: publisherFromCreator(creator.id, creator.name, creator.avatar, creator.score),
        headline: pick(HEADLINES.creator_review ?? [], g),
        description: `${creator.name} shops ${brand.name} picks in 60 seconds — swipe to compare prices.`,
        badges: ['Reel', brand.category],
        brandIds: [brand.id],
        productIds: [String((g % 6) + 1)],
        popularityScore: 2400 + g * 90,
      });
    }),
  );
  idx += cfg.reels;

  push(
    ...generateBatch(cfg.landscapeVideos, idx, (_i, g) => {
      const brand = pick(DEMO_BRANDS, g + 2);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-video',
        contentType: 'product_review',
        mediaProfile: 'landscape',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.product_review ?? [], g),
        description: `Long-form review with shoppable timestamps — ${brand.name} flagship breakdown.`,
        badges: ['Video', 'Review'],
        brandIds: [brand.id],
        popularityScore: 3100 + g * 70,
      });
    }),
  );
  idx += cfg.landscapeVideos;

  push(
    ...generateBatch(cfg.blogs, idx, (_i, g) =>
      buildDemoItem({
        index: g,
        slugPrefix: 'demo-blog',
        contentType: 'editorial',
        mediaProfile: 'blog',
        publisher: publisherFromEditorial('Choosify Editorial'),
        headline: pick(HEADLINES.editorial ?? [], g),
        description: 'Editorial commerce story with product callouts and verified retailer links.',
        badges: ['Blog', 'Editorial'],
        popularityScore: 980 + g * 40,
      }),
    ),
  );
  idx += cfg.blogs;

  push(
    ...generateBatch(cfg.buyingGuides, idx, (_i, g) => {
      const slug = g === 0 ? 'demo-guide' : `demo-guide-${g + 1}`;
      const item = buildDemoItem({
        index: g,
        slugPrefix: 'demo-guide',
        contentType: 'buying_guide',
        mediaProfile: 'blog',
        publisher: publisherFromCreator('farhan', 'Farhan Rafiq', DEMO_CREATORS[2].avatar, 90),
        headline: pick(HEADLINES.buying_guide ?? [], g),
        description: 'Step-by-step buying guide with top picks, pros/cons, and shop links.',
        badges: ['Guide', 'Top Picks'],
        productIds: ['1', '2', '3'],
        popularityScore: 4200 + g * 55,
      });
      return { ...item, slug, contentId: `demo-feed-${slug}`, href: spotlightContentHref(slug) };
    }),
  );
  idx += cfg.buyingGuides;

  push(
    ...generateBatch(cfg.creatorReviews, idx, (_i, g) => {
      const creator = pick(DEMO_CREATORS, g + 1);
      const brand = pick(DEMO_BRANDS, g + 4);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-creator-review',
        contentType: 'creator_review',
        mediaProfile: g % 2 === 0 ? 'reel' : 'landscape',
        publisher: publisherFromCreator(creator.id, creator.name, creator.avatar, creator.score),
        headline: pick(HEADLINES.creator_review ?? [], g + 2),
        description: `${creator.name} tests ${brand.name} products with real buyer context.`,
        badges: ['Creator Review', brand.name],
        brandIds: [brand.id],
        popularityScore: 2800 + g * 80,
      });
    }),
  );
  idx += cfg.creatorReviews;

  push(
    ...generateBatch(cfg.editorialArticles, idx, (_i, g) =>
      buildDemoItem({
        index: g,
        slugPrefix: 'demo-editorial',
        contentType: 'editorial',
        mediaProfile: 'blog',
        publisher: publisherFromEditorial(),
        headline: pick(HEADLINES.editorial ?? [], g + 1),
        description: 'Commerce journalism — trends, trust, and what to buy next.',
        badges: ['Article'],
        popularityScore: 1100 + g * 35,
      }),
    ),
  );
  idx += cfg.editorialArticles;

  push(
    ...generateBatch(cfg.brandStories, idx, (_i, g) => {
      const brand = pick(DEMO_BRANDS, g + 3);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-brand-story',
        contentType: 'brand_story',
        mediaProfile: g % 2 === 0 ? 'square' : 'landscape',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.brand_story ?? [], g),
        description: `${brand.name} story with collection highlights and shop-the-look products.`,
        badges: ['Brand Story'],
        brandIds: [brand.id],
        popularityScore: 1900 + g * 60,
      });
    }),
  );
  idx += cfg.brandStories;

  push(
    ...generateBatch(cfg.brandCampaigns, idx, (_i, g) => {
      const slug = g === 0 ? 'demo-campaign' : `demo-campaign-${g + 1}`;
      const brand = pick(DEMO_BRANDS, g);
      const item = buildDemoItem({
        index: g,
        slugPrefix: 'demo-campaign',
        contentType: 'campaign',
        mediaProfile: g % 3 === 0 ? 'carousel' : 'landscape',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.campaign ?? [], g),
        description: `Multi-product ${brand.name} campaign with bundles and limited-time perks.`,
        badges: ['Campaign'],
        brandIds: [brand.id],
        productIds: ['1', '2', '4'],
        popularityScore: 3500 + g * 65,
      });
      return { ...item, slug, contentId: `demo-feed-${slug}`, href: spotlightContentHref(slug) };
    }),
  );
  idx += cfg.brandCampaigns;

  push(
    ...generateBatch(cfg.productReviews, idx, (_i, g) => {
      const slug = g === 0 ? 'demo-review' : `demo-review-${g + 1}`;
      const brand = pick(DEMO_BRANDS, g + 1);
      const item = buildDemoItem({
        index: g,
        slugPrefix: 'demo-review',
        contentType: 'product_review',
        mediaProfile: 'landscape',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.product_review ?? [], g + 1),
        description: 'Hands-on product review with specs, verdict, and shop CTA.',
        badges: ['Review', 'Verified'],
        brandIds: [brand.id],
        popularityScore: 2600 + g * 75,
      });
      return { ...item, slug, contentId: `demo-feed-${slug}`, href: spotlightContentHref(slug) };
    }),
  );
  idx += cfg.productReviews;

  push(
    ...generateBatch(cfg.productLaunches, idx, (_i, g) => {
      const brand = pick(DEMO_BRANDS, g + 5);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-launch',
        contentType: 'new_launch',
        mediaProfile: g % 2 === 0 ? 'square' : 'landscape',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.new_launch ?? [], g),
        description: `New ${brand.name} launch with early access offers and pre-order links.`,
        badges: ['Launch', 'New'],
        brandIds: [brand.id],
        popularityScore: 4100 + g * 90,
      });
    }),
  );
  idx += cfg.productLaunches;

  push(
    ...generateBatch(cfg.liveShopping, idx, (_i, g) => {
      const slug = g === 0 ? 'demo-live' : `demo-live-${g + 1}`;
      const brand = pick(DEMO_BRANDS, g + 2);
      const item = buildDemoItem({
        index: g,
        slugPrefix: 'demo-live',
        contentType: 'live',
        mediaProfile: 'live',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.live ?? [], g),
        description: 'Shop live with pinned products, flash offers, and replay available.',
        badges: ['Live', 'Shop Now'],
        brandIds: [brand.id],
        isLive: g % 2 === 0,
        popularityScore: 5200 + g * 120,
      });
      return { ...item, slug, contentId: `demo-feed-${slug}`, href: spotlightContentHref(slug) };
    }),
  );
  idx += cfg.liveShopping;

  push(
    ...generateBatch(cfg.offers, idx, (_i, g) => {
      const slug = g === 0 ? 'demo-offer' : `demo-offer-${g + 1}`;
      const brand = pick(DEMO_BRANDS, g + 6);
      const item = buildDemoItem({
        index: g,
        slugPrefix: 'demo-offer',
        contentType: 'promotion',
        mediaProfile: 'square',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.promotion ?? [], g),
        description: 'Limited-time offer with countdown, coupon stack, and free delivery.',
        badges: ['Offer', 'Flash Sale'],
        brandIds: [brand.id],
        popularityScore: 3300 + g * 85,
      });
      return { ...item, slug, contentId: `demo-feed-${slug}`, href: spotlightContentHref(slug) };
    }),
  );
  idx += cfg.offers;

  push(
    ...generateBatch(cfg.collections, idx, (_i, g) => {
      const slug = g === 0 ? 'demo-collection' : `demo-collection-${g + 1}`;
      const brand = pick(DEMO_BRANDS, g + 7);
      const item = buildDemoItem({
        index: g,
        slugPrefix: 'demo-collection',
        contentType: 'recommendation',
        mediaProfile: 'carousel',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: pick(HEADLINES.recommendation ?? [], g),
        description: 'Curated collection with mix-and-match product bundles.',
        badges: ['Collection', 'Curated'],
        brandIds: [brand.id],
        productIds: ['2', '3', '5'],
        popularityScore: 2100 + g * 50,
      });
      return { ...item, slug, contentId: `demo-feed-${slug}`, href: spotlightContentHref(slug) };
    }),
  );
  idx += cfg.collections;

  push(
    ...generateBatch(cfg.carousels, idx, (_i, g) => {
      const brand = pick(DEMO_BRANDS, g + 8);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-carousel',
        contentType: 'campaign',
        mediaProfile: 'carousel',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: `${brand.name} — Swipe the Full Look`,
        description: 'Carousel post with multiple shoppable angles and outfit pairings.',
        badges: ['Carousel', 'Shop Look'],
        brandIds: [brand.id],
        popularityScore: 2400 + g * 45,
      });
    }),
  );
  idx += cfg.carousels;

  push(
    ...generateBatch(cfg.services, idx, (_i, g) => {
      const service = pick(DEMO_SERVICES, g);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-service',
        contentType: 'whats_on',
        mediaProfile: g % 2 === 0 ? 'landscape' : 'blog',
        publisher: servicePublisher(service),
        headline: pick(HEADLINES.whats_on ?? [], g),
        description: 'Bookable service promotion with transparent pricing and verified partner badge.',
        badges: ['Service', 'Book Now'],
        serviceIds: [service.id],
        popularityScore: 1600 + g * 40,
      });
    }),
  );
  idx += cfg.services;

  push(
    ...generateBatch(cfg.sponsoredProducts, idx, (_i, g) => {
      const brand = pick(DEMO_BRANDS, g);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-sponsored-product',
        contentType: 'campaign',
        mediaProfile: g % 2 === 0 ? 'square' : 'landscape',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: `${brand.name} — Sponsored Product Spotlight`,
        description: 'Sponsored product discovery with same card layout as organic picks.',
        badges: ['Sponsored', 'Product'],
        brandIds: [brand.id],
        isSponsored: true,
        popularityScore: 3800 + g * 70,
      });
    }),
  );

  push(
    ...generateBatch(cfg.sponsoredBrands, idx, (_i, g) => {
      const brand = pick(DEMO_BRANDS, g + 3);
      return buildDemoItem({
        index: g,
        slugPrefix: 'demo-sponsored-brand',
        contentType: 'brand_story',
        mediaProfile: 'blog',
        publisher: publisherFromBrand(brand.id, brand.name, brand.logo),
        headline: `Discover ${brand.name} — Sponsored Brand Story`,
        description: 'Sponsored brand placement — subtle badge only, identical card chrome.',
        badges: ['Sponsored', 'Brand'],
        brandIds: [brand.id],
        isSponsored: true,
        popularityScore: 2900 + g * 55,
      });
    }),
  );

  return items;
}

/** Reset registry (tests) */
export function resetDemoSpotlightRegistry(): void {
  demoRegistry = new Map();
}
