/**
 * Shared listing ranking for Products / Brands / Creators / Deals.
 *
 * Tradeoff: query-time (client render) scoring over cron/cache.
 * Catalog lists are already hydrated in GlobalState memory — scoring
 * thousands of items is cheap vs. adding a cache layer. Same pattern as
 * contentPriority.ts (Viral Today / Discover). When server pagination
 * arrives, move these pure scorers behind the API unchanged.
 */

export const LISTING_FRESH_MS = 24 * 60 * 60 * 1000;
export const LISTING_NEW_ENTITY_MS = 14 * 24 * 60 * 60 * 1000; // ~14 days onboard boost
export const LISTING_SPONSORED_RATIO = 5; // ~1 sponsored per 5 organic

export function parseTs(value?: string | number | null): number | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const ms = Date.parse(String(value));
  return Number.isFinite(ms) ? ms : null;
}

export function isWithinMs(
  timestampMs: number | null,
  nowMs: number,
  windowMs: number,
): boolean {
  if (timestampMs == null) return false;
  return timestampMs <= nowMs && nowMs - timestampMs <= windowMs;
}

/** Parse "450K", "1.2M", "120,000" follower/view strings → number */
export function parseCountLabel(raw?: string | number | null): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0;
  const cleaned = String(raw).replace(/,/g, '').trim().toUpperCase();
  const match = cleaned.match(/([\d.]+)\s*([KMB])?/);
  if (!match) return 0;
  const n = parseFloat(match[1]);
  if (!Number.isFinite(n)) return 0;
  const unit = match[2];
  if (unit === 'K') return Math.round(n * 1_000);
  if (unit === 'M') return Math.round(n * 1_000_000);
  if (unit === 'B') return Math.round(n * 1_000_000_000);
  return Math.round(n);
}

/**
 * Bayesian average — shrinks sparse ratings toward a prior.
 * items with few reviews cannot outrank well-reviewed ones on stars alone.
 */
export function bayesianRating(
  avg: number,
  count: number,
  priorMean = 4.0,
  priorWeight = 20,
): number {
  if (!Number.isFinite(avg) || avg <= 0) return priorMean * 0.5;
  const c = Math.max(0, count);
  return (priorWeight * priorMean + c * avg) / (priorWeight + c);
}

/**
 * Cap sponsored density: emit organic in ranked order, insert next sponsored
 * after every `ratio` organics (≈ 1 sponsored : 5 organic).
 */
export function interleaveSponsoredCap<T>(
  organic: T[],
  sponsored: T[],
  ratio: number = LISTING_SPONSORED_RATIO,
): T[] {
  if (!sponsored.length) return organic;
  if (!organic.length) return sponsored.slice(0, Math.max(1, Math.ceil(sponsored.length / ratio)));

  const result: T[] = [];
  let sIdx = 0;
  let organicsSinceSponsored = 0;

  for (const item of organic) {
    result.push(item);
    organicsSinceSponsored += 1;
    if (sIdx < sponsored.length && organicsSinceSponsored >= ratio) {
      result.push(sponsored[sIdx++]);
      organicsSinceSponsored = 0;
    }
  }
  return result;
}

function stableSort<T>(
  items: T[],
  score: (item: T, index: number) => number,
): T[] {
  return items
    .map((item, index) => ({ item, index, s: score(item, index) }))
    .sort((a, b) => (b.s !== a.s ? b.s - a.s : a.index - b.index))
    .map((r) => r.item);
}

// ─── Products ───────────────────────────────────────────────────────────────

export interface ProductRankingInput {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  stock?: number;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  featuredFlag?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isDeal?: boolean;
  dealValidUntil?: string;
  /** Optional — missing on CatalogProduct today */
  rating?: number;
  reviewCount?: number;
  views?: number;
  saves?: number;
  cartAdds?: number;
  /** Seller/brand follower count for new-product boost */
  brandFollowers?: number;
  sponsored?: boolean;
}

export function productDiscountPercent(p: ProductRankingInput): number {
  if (typeof p.discountPercent === 'number' && p.discountPercent > 0) return p.discountPercent;
  if (p.originalPrice && p.price && p.originalPrice > p.price) {
    return ((p.originalPrice - p.price) / p.originalPrice) * 100;
  }
  return 0;
}

export function scoreProduct(p: ProductRankingInput, nowMs: number = Date.now()): number {
  const created = parseTs(p.createdAt);
  const stock = p.stock ?? 0;
  const isSponsored = Boolean(p.sponsored || p.featuredFlag);
  const isNew = p.isNewArrival || isWithinMs(created, nowMs, LISTING_FRESH_MS);
  const discount = productDiscountPercent(p);
  const hasPriceDrop = discount >= 5 && isWithinMs(created, nowMs, LISTING_FRESH_MS * 3);
  const brandFollowers = p.brandFollowers ?? 0;

  // Proxy trending when views/saves/cartAdds absent
  const views = p.views ?? 0;
  const saves = p.saves ?? 0;
  const carts = p.cartAdds ?? 0;
  const trendingProxy =
    views + saves * 3 + carts * 5 > 0
      ? Math.log10(1 + views + saves * 3 + carts * 5) * 12
      : p.isBestseller
        ? 40
        : 0;

  const rating = p.rating ?? (p.isBestseller ? 4.6 : p.featuredFlag ? 4.4 : 0);
  const reviews = p.reviewCount ?? (p.isBestseller ? 40 : p.featuredFlag ? 15 : 0);
  const quality = bayesianRating(rating, reviews) * 8;

  let score = 0;
  if (isSponsored) score += 1000; // peeled off for capped interleave; still useful when mixed
  if (isNew) score += 220 + Math.min(80, Math.log10(1 + brandFollowers) * 20);
  if (hasPriceDrop) score += 160 + Math.min(40, discount);
  score += trendingProxy;
  score += quality;
  if (p.isDeal) score += 25;

  // Demote OOS / low stock — never hide
  if (stock <= 0) score -= 500;
  else if (stock < 5) score -= 80;

  // Slight recency tie-break from createdAt
  if (created) score += Math.min(30, (created / 1e12) * 0.01);

  return score;
}

export function rankProducts<T extends ProductRankingInput>(
  items: T[],
  options?: {
    nowMs?: number;
    brandFollowersById?: Record<string, number>;
    getBrandId?: (item: T) => string | undefined;
    /** Skip ranking when user picked an explicit sort (e.g. price) */
    skip?: boolean;
  },
): T[] {
  if (options?.skip || items.length <= 1) return items;
  const nowMs = options?.nowMs ?? Date.now();

  const enriched = items.map((item) => {
    const brandId = options?.getBrandId?.(item);
    const brandFollowers =
      item.brandFollowers ??
      (brandId && options?.brandFollowersById ? options.brandFollowersById[brandId] : undefined);
    return { ...item, brandFollowers } as T;
  });

  const sponsored = enriched.filter((p) => p.sponsored || p.featuredFlag);
  const organic = enriched.filter((p) => !(p.sponsored || p.featuredFlag));

  const rankedOrganic = stableSort(organic, (p) => scoreProduct(p, nowMs));
  const rankedSponsored = stableSort(sponsored, (p) => scoreProduct(p, nowMs));

  return interleaveSponsoredCap(rankedOrganic, rankedSponsored, LISTING_SPONSORED_RATIO);
}

// ─── Brands ─────────────────────────────────────────────────────────────────

export interface BrandRankingInput {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  followers?: number;
  ratings?: number;
  rating?: number;
  verifiedStatus?: boolean;
  featuredFlag?: boolean;
  sponsoredFlag?: boolean;
  isFeatured?: boolean;
  isHot?: boolean;
  /** Proxy for recent activity — e.g. newest product createdAt */
  lastActivityAt?: string;
}

export function scoreBrand(b: BrandRankingInput, nowMs: number = Date.now()): number {
  const created = parseTs(b.createdAt);
  const activity = parseTs(b.lastActivityAt) ?? parseTs(b.updatedAt);
  const followers = b.followers ?? 0;
  const rating = b.ratings ?? b.rating ?? 0;
  const isSponsored = Boolean(b.sponsoredFlag || b.isHot);
  const isFeatured = Boolean(b.featuredFlag || b.isFeatured);
  const isNew =
    isWithinMs(created, nowMs, LISTING_NEW_ENTITY_MS) ||
    (Boolean(b.verifiedStatus) && isWithinMs(created, nowMs, LISTING_NEW_ENTITY_MS));

  let score = 0;
  if (isSponsored || isFeatured) score += 900;
  if (isNew) score += 280; // first 7–14 days visibility boost
  score += Math.log10(1 + followers) * 45;
  // Follower growth velocity unavailable — boost recent activity as proxy
  if (isWithinMs(activity, nowMs, LISTING_FRESH_MS * 7)) score += 90;
  else if (isWithinMs(activity, nowMs, LISTING_NEW_ENTITY_MS)) score += 40;
  score += rating * 35;
  if (b.verifiedStatus) score += 25;

  return score;
}

export function rankBrands<T extends BrandRankingInput>(
  items: T[],
  nowMs: number = Date.now(),
): T[] {
  if (items.length <= 1) return items;
  const sponsored = items.filter((b) => b.sponsoredFlag || b.isHot || b.featuredFlag || b.isFeatured);
  const organic = items.filter((b) => !(b.sponsoredFlag || b.isHot || b.featuredFlag || b.isFeatured));
  return interleaveSponsoredCap(
    stableSort(organic, (b) => scoreBrand(b, nowMs)),
    stableSort(sponsored, (b) => scoreBrand(b, nowMs)),
    LISTING_SPONSORED_RATIO,
  );
}

// ─── Creators ───────────────────────────────────────────────────────────────

export interface CreatorRankingInput {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  score?: number;
  featuredFlag?: boolean;
  verifiedStatus?: boolean;
  isFeatured?: boolean;
  isHot?: boolean;
  followers?: Record<string, string> | number;
  videos?: Array<{ views?: string; date?: string }>;
  reels?: Array<{ views?: string; likes?: string; date?: string }>;
  blogs?: Array<{ date?: string }>;
}

export function totalCreatorFollowers(c: CreatorRankingInput): number {
  if (typeof c.followers === 'number') return c.followers;
  if (!c.followers || typeof c.followers !== 'object') return 0;
  return Object.values(c.followers).reduce((sum, v) => sum + parseCountLabel(v), 0);
}

export function creatorEngagementRate(c: CreatorRankingInput): number {
  const followers = Math.max(1, totalCreatorFollowers(c));
  const viewSum =
    (c.videos ?? []).reduce((s, v) => s + parseCountLabel(v.views), 0) +
    (c.reels ?? []).reduce((s, r) => s + parseCountLabel(r.views) + parseCountLabel(r.likes), 0);
  return viewSum / followers;
}

export function creatorLastPostAt(c: CreatorRankingInput): number | null {
  const dates = [
    ...(c.videos ?? []).map((v) => parseTs(v.date)),
    ...(c.reels ?? []).map((r) => parseTs(r.date)),
    ...(c.blogs ?? []).map((b) => parseTs(b.date)),
    parseTs(c.updatedAt),
  ].filter((d): d is number => d != null);
  if (!dates.length) return null;
  return Math.max(...dates);
}

export function scoreCreator(c: CreatorRankingInput, nowMs: number = Date.now()): number {
  const created = parseTs(c.createdAt);
  const lastPost = creatorLastPostAt(c);
  const followers = totalCreatorFollowers(c);
  const engagement = creatorEngagementRate(c);
  const isSponsored = Boolean(c.featuredFlag || c.isFeatured || c.isHot);
  const isNew = isWithinMs(created, nowMs, LISTING_NEW_ENTITY_MS);

  let score = 0;
  if (isSponsored) score += 900;
  if (isNew) score += 280;
  // Engagement rate weighted above raw followers
  score += Math.min(200, engagement * 80);
  score += Math.log10(1 + followers) * 28;
  if (isWithinMs(lastPost, nowMs, LISTING_FRESH_MS * 7)) score += 100;
  else if (isWithinMs(lastPost, nowMs, LISTING_NEW_ENTITY_MS)) score += 45;
  score += (c.score ?? 0) * 0.6;
  if (c.verifiedStatus) score += 20;

  return score;
}

export function rankCreators<T extends CreatorRankingInput>(
  items: T[],
  nowMs: number = Date.now(),
): T[] {
  if (items.length <= 1) return items;
  const sponsored = items.filter((c) => c.featuredFlag || c.isFeatured || c.isHot);
  const organic = items.filter((c) => !(c.featuredFlag || c.isFeatured || c.isHot));
  return interleaveSponsoredCap(
    stableSort(organic, (c) => scoreCreator(c, nowMs)),
    stableSort(sponsored, (c) => scoreCreator(c, nowMs)),
    LISTING_SPONSORED_RATIO,
  );
}

// ─── Deals ──────────────────────────────────────────────────────────────────

export interface DealRankingInput {
  id: string | number;
  createdAt?: string;
  stock?: number;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  discountValue?: number;
  discountType?: 'percentage' | 'flat';
  featuredFlag?: boolean;
  sponsored?: boolean;
  isDeal?: boolean;
  dealType?: string;
  dealValidUntil?: string;
  validUntil?: string;
  validFrom?: string;
}

export function dealDiscountPercent(d: DealRankingInput): number {
  if (typeof d.discountPercent === 'number' && d.discountPercent > 0) return d.discountPercent;
  if (d.discountType === 'percentage' && typeof d.discountValue === 'number') return d.discountValue;
  if (d.originalPrice && d.price && d.originalPrice > d.price) {
    return ((d.originalPrice - d.price) / d.originalPrice) * 100;
  }
  return 0;
}

export function scoreDeal(d: DealRankingInput, nowMs: number = Date.now()): number {
  const endsAt = parseTs(d.dealValidUntil) ?? parseTs(d.validUntil);
  const created = parseTs(d.createdAt) ?? parseTs(d.validFrom);
  const stock = d.stock ?? 99;
  const discount = dealDiscountPercent(d);
  const isSponsored = Boolean(d.sponsored || d.featuredFlag);
  const isFlash = d.dealType === 'flash';

  let score = 0;
  if (isSponsored) score += 900;

  // Time-remaining urgency — soonest-ending first (higher score when less time left)
  if (endsAt != null && endsAt > nowMs) {
    const hoursLeft = (endsAt - nowMs) / (60 * 60 * 1000);
    if (isFlash || hoursLeft < 48) {
      score += Math.max(0, 300 - hoursLeft * 4);
    } else {
      score += Math.max(0, 120 - hoursLeft * 0.5);
    }
  } else if (endsAt != null && endsAt <= nowMs) {
    score -= 200; // expired demotion
  }

  if (isWithinMs(created, nowMs, LISTING_FRESH_MS)) score += 180;
  if (stock > 0 && stock < 8) score += 140; // low-stock urgency
  else if (stock <= 0) score -= 400;

  score += Math.min(100, discount * 1.2);

  return score;
}

export function rankDeals<T extends DealRankingInput>(
  items: T[],
  nowMs: number = Date.now(),
): T[] {
  if (items.length <= 1) return items;
  const sponsored = items.filter((d) => d.sponsored || d.featuredFlag);
  const organic = items.filter((d) => !(d.sponsored || d.featuredFlag));
  return interleaveSponsoredCap(
    stableSort(organic, (d) => scoreDeal(d, nowMs)),
    stableSort(sponsored, (d) => scoreDeal(d, nowMs)),
    LISTING_SPONSORED_RATIO,
  );
}

// ─── Brand Details catalog (single-brand, not cross-seller) ─────────────────

/**
 * Within one brand: pinned/featured → bestseller → new → price-drop → rest.
 * Reuses product freshness / stock demotion signals from scoreProduct.
 * Does NOT use 1:5 sponsored interleave — pins always lead this catalog.
 */
export function rankBrandCatalogProducts<T extends ProductRankingInput>(
  items: T[],
  nowMs: number = Date.now(),
): T[] {
  if (items.length <= 1) return items;
  return stableSort(items, (p) => {
    // Strip list-page sponsored weight; re-apply as hard pin
    const base = scoreProduct({ ...p, sponsored: false, featuredFlag: false }, nowMs);
    let score = base;
    if (p.featuredFlag || p.sponsored) score += 8000;
    if (p.isBestseller) score += 400; // bestseller / most-ordered proxy
    return score;
  });
}

export interface BrandStoryRankingInput {
  id: string | number;
  status?: string;
  publishedAt?: string;
  startDate?: string;
  endDate?: string;
  sponsored?: boolean;
}

/** Brand stories: LIVE window first, then newest published. */
export function rankBrandStories<T extends BrandStoryRankingInput>(
  items: T[],
  nowMs: number = Date.now(),
): T[] {
  if (items.length <= 1) return items;
  return stableSort(items, (post) => {
    const start = parseTs(post.startDate) ?? parseTs(post.publishedAt);
    const end = parseTs(post.endDate);
    const isLiveNow =
      post.status === 'live' &&
      (start == null || start <= nowMs) &&
      (end == null || end >= nowMs);
    let score = 0;
    if (isLiveNow) score += 10_000;
    if (post.sponsored) score += 200;
    const published = parseTs(post.publishedAt) ?? start ?? 0;
    score += published / 1e11; // newest first among non-live
    return score;
  });
}

export interface CompetitorBrandInput {
  id: string | number;
  name: string;
  category?: string;
  ratings?: number;
  rating?: number;
  followers?: number;
  featuredFlag?: boolean;
  sponsoredFlag?: boolean;
}

/** Same-category competitors first, then by trust/followers. */
export function rankCompetitorBrands<T extends CompetitorBrandInput>(
  items: T[],
  primaryCategory?: string | null,
  nowMs: number = Date.now(),
): T[] {
  void nowMs;
  if (items.length <= 1) return items;
  const cat = (primaryCategory || '').toLowerCase().trim();
  return stableSort(items, (b) => {
    const bCat = (b.category || '').toLowerCase().trim();
    const sameCategory = cat && bCat && (bCat === cat || bCat.includes(cat) || cat.includes(bCat));
    let score = 0;
    if (sameCategory) score += 5000;
    score += (b.ratings ?? b.rating ?? 0) * 40;
    score += Math.log10(1 + (b.followers ?? 0)) * 20;
    if (b.featuredFlag || b.sponsoredFlag) score += 50;
    return score;
  });
}

// ─── Creator profile content tabs ───────────────────────────────────────────

export interface CreatorContentRankingInput {
  id: string | number;
  pinned?: boolean;
  isLive?: boolean;
  date?: string;
  publishedAt?: string;
  views?: string | number;
  likes?: string | number;
  title?: string;
}

/**
 * Profile tab order: LIVE → creator-pinned → newest with engagement resurfacing.
 */
export function rankCreatorContent<T extends CreatorContentRankingInput>(
  items: T[],
  nowMs: number = Date.now(),
): T[] {
  if (items.length <= 1) return items;
  return stableSort(items, (item) => {
    const published = parseTs(item.date) ?? parseTs(item.publishedAt);
    const views = parseCountLabel(item.views);
    const likes = parseCountLabel(item.likes);
    const engagement = views + likes * 4;

    let score = 0;
    if (item.isLive) score += 12_000;
    if (item.pinned) score += 9000;

    // Newest first
    if (published != null) {
      score += Math.min(2000, (published / 1e12) * 100);
      // Temporary popular boost for strong older pieces still within ~90 days
      if (isWithinMs(published, nowMs, LISTING_NEW_ENTITY_MS * 6) && engagement > 5000) {
        score += Math.min(600, Math.log10(1 + engagement) * 40);
      } else if (engagement > 50_000) {
        // Evergreen popular — lighter resurfacing
        score += Math.min(250, Math.log10(1 + engagement) * 20);
      }
    } else if (engagement > 0) {
      score += Math.min(300, Math.log10(1 + engagement) * 25);
    }

    return score;
  });
}
