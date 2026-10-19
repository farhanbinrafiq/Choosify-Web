/**
 * Compare engine — canonical, pure model.
 *
 * The user's selection is the ONLY source of comparison subjects. Everything the
 * Compare page shows (cards, decision matrix, score overview, summary, Choosify
 * Verdict, Emi facts, decision-profile picks) is derived here from those selected
 * real catalog records. Nothing in this module invents an entity, a review, a
 * price, a score or a spec value: a field the record does not carry is
 * `undefined` and renders as "—".
 *
 * Modes:
 *   product / ai  → PRODUCT subjects (AI Smart Mode is decision help over the
 *                   same product selection, never a separate data set)
 *   brand         → BRAND subjects
 *   creator       → CREATOR subjects
 *   guide         → BUYING GUIDE subjects
 * Each entity type keeps its own selection; switching mode never converts one
 * type into another.
 */
import { parseCountLabel } from '../../utils/listingRanking';

export type CompareMode = 'product' | 'brand' | 'creator' | 'guide' | 'ai';
export type CompareEntityType = 'product' | 'brand' | 'creator' | 'guide';

export const MAX_COMPARE_ITEMS = 4;

export const entityTypeForMode = (mode: CompareMode): CompareEntityType => (mode === 'ai' ? 'product' : mode);

export const ENTITY_NOUN: Record<CompareEntityType, { one: string; many: string; title: string }> = {
  product: { one: 'Product', many: 'products', title: 'Compare Products' },
  brand: { one: 'Brand', many: 'brands', title: 'Compare Brands' },
  creator: { one: 'Creator', many: 'creators', title: 'Compare Creators' },
  guide: { one: 'Guide', many: 'buying guides', title: 'Compare Buying Guides' },
};

export const isCompareMode = (v: unknown): v is CompareMode =>
  v === 'product' || v === 'brand' || v === 'creator' || v === 'guide' || v === 'ai';

// ── Column (one comparison subject) ────────────────────────────────────────

export interface CompareColumn {
  id: string;
  type: CompareEntityType;
  name: string;
  /** Brand name / category / niche / author — a real field only, else ''. */
  subtitle: string;
  image: string;
  href: string;
  price: number | null;
  /** Average star rating (0–5) from a real source, else null. */
  rating: number | null;
  reviewCount: number;
  /** 0–10 comparison score from the existing Compare rule, null when there is no basis. */
  score: number | null;
  /** Human explanation of what `score` is based on. */
  scoreBasis: string;
  values: Record<string, string | undefined>;
  flags: { deal?: boolean; inStock?: boolean; verified?: boolean };
  raw: unknown;
}

export interface CompareMetric {
  key: string;
  label: string;
  subLabel?: string;
}
export interface CompareSectionDef {
  id: string;
  title: string;
  metrics: CompareMetric[];
}

const num = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v.replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }
  return null;
};
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const taka = (n: number) => `৳${Math.round(n).toLocaleString('en-US')}`;
const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const clamp10 = (n: number) => Math.max(0, Math.min(10, Math.round(n * 10) / 10));

/** Review stats computed from real public reviews (undefined while they load). */
export interface ReviewStats {
  average: number | null;
  count: number;
}
export function reviewStats(reviews: Array<{ rating?: number }> | undefined): ReviewStats | undefined {
  if (!reviews) return undefined;
  const ratings = reviews.map((r) => Number(r.rating)).filter((n) => Number.isFinite(n) && n > 0);
  if (!ratings.length) return { average: null, count: 0 };
  return { average: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10, count: ratings.length };
}

// ── Products ───────────────────────────────────────────────────────────────

export interface ProductColumnContext {
  stats?: ReviewStats;
  /** Live creator guides that feature this product. */
  creatorGuideCount: number;
  href: string;
}

/**
 * Existing Compare scoring rule, kept as-is: a product's own `score` when the
 * catalog carries one, otherwise its average rating on a 10-point scale. The
 * rating comes from real public reviews only; no reviews → no score.
 */
export function productColumn(p: Record<string, any>, ctx: ProductColumnContext): CompareColumn {
  const price = num(p.price);
  const original = num(p.originalPrice);
  const stats = ctx.stats;
  const rating = stats?.average ?? (num(p.rating) && num(p.rating)! > 0 ? num(p.rating) : null);
  const reviewCount = stats?.count ?? (num(p.reviewCount) ?? 0);
  const ownScore = num(p.score);
  const score = ownScore !== null ? clamp10(ownScore) : rating !== null ? clamp10(rating * 2) : null;
  const isService = p.productType === 'service';
  const stock = num(p.stock);
  const warrantyMonths = num(p.warrantyMonths);
  const discount =
    num(p.discountPercent) ?? (price && original && original > price ? Math.round(((original - price) / original) * 100) : null);
  return {
    // Catalog id (prod-…) — the key reviews, guides, comparison endpoints and share links use.
    id: String(p.catalogId ?? p.id),
    type: 'product',
    name: str(p.title) || str(p.name) || 'Untitled product',
    subtitle: str(p.brandName) || str(p.brand),
    image: (Array.isArray(p.images) && p.images[0]) || str(p.image),
    href: ctx.href,
    price: price && price > 0 ? price : null,
    rating,
    reviewCount,
    score,
    scoreBasis: ownScore !== null ? 'Choosify product score' : rating !== null ? `Average of ${reviewCount} customer review${reviewCount === 1 ? '' : 's'}` : 'No reviews yet',
    values: {
      price: price && price > 0 ? taka(price) : undefined,
      originalPrice: original && price && original > price ? `${taka(original)}${discount ? ` (−${discount}%)` : ''}` : undefined,
      deal: p.isDeal
        ? str(p.dealType)
          ? `${str(p.dealType).replace(/[_-]+/g, ' ').replace(/^\w/, (m) => m.toUpperCase())} deal`
          : 'Active deal'
        : 'No active deal',
      rating: rating !== null ? `${rating.toFixed(1)} / 5` : stats ? 'No reviews yet' : undefined,
      reviews: stats ? String(reviewCount) : undefined,
      creatorGuides: String(ctx.creatorGuideCount),
      availability: isService ? 'Service' : stock === null ? undefined : stock > 0 ? 'In stock' : 'Out of stock',
      warranty: warrantyMonths && warrantyMonths > 0
        ? `${warrantyMonths} month${warrantyMonths === 1 ? '' : 's'}${str(p.warrantyType) ? ` · ${str(p.warrantyType)}` : ''}`
        : str(p.warrantyType) || undefined,
      brand: str(p.brandName) || str(p.brand) || undefined,
      category: str(p.category) || str(p.categoryName) || undefined,
    },
    flags: { deal: Boolean(p.isDeal), inStock: isService ? true : stock !== null ? stock > 0 : undefined },
    raw: p,
  };
}

export const PRODUCT_SECTIONS: CompareSectionDef[] = [
  {
    id: 'pricing',
    title: 'Pricing & Deals',
    metrics: [
      { key: 'price', label: 'Price' },
      { key: 'originalPrice', label: 'Regular price', subLabel: 'Before discount' },
      { key: 'deal', label: 'Deal' },
    ],
  },
  {
    id: 'reviews',
    title: 'Ratings & Reviews',
    metrics: [
      { key: 'rating', label: 'Customer rating', subLabel: 'From verified public reviews' },
      { key: 'reviews', label: 'Customer reviews' },
      { key: 'creatorGuides', label: 'Creator guides', subLabel: 'Live guides featuring it' },
    ],
  },
  {
    id: 'availability',
    title: 'Availability & After-sales',
    metrics: [
      { key: 'availability', label: 'Availability' },
      { key: 'warranty', label: 'Warranty' },
      { key: 'brand', label: 'Brand' },
      { key: 'category', label: 'Category' },
    ],
  },
];

// ── Brands ─────────────────────────────────────────────────────────────────

export interface BrandColumnContext {
  productCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  publicStats?: ReviewStats;
  creatorGuideCount: number;
  href: string;
}

/** Brand score = the brand's stored Choosify rating on a 10-point scale (no rating → no score). */
export function brandColumn(b: Record<string, any>, ctx: BrandColumnContext): CompareColumn {
  const rating = num(b.ratings) ?? num(b.rating);
  const hasRating = rating !== null && rating > 0;
  const followers = num(b.followers) ?? 0;
  const stores = (b.stores && typeof b.stores === 'object' ? b.stores : {}) as Record<string, unknown[]>;
  const authorized = Array.isArray(stores.authorized) ? stores.authorized.length : 0;
  const service = Array.isArray(stores.serviceCenters) ? stores.serviceCenters.length : 0;
  const logo = str(b.logo);
  return {
    id: String(b.catalogId ?? b.id),
    type: 'brand',
    name: str(b.name) || 'Untitled brand',
    subtitle: str(b.category),
    image: /^(https?:)?\/\//.test(logo) || logo.startsWith('/') ? logo : '',
    href: ctx.href,
    price: null,
    rating: hasRating ? rating : null,
    reviewCount: ctx.publicStats?.count ?? 0,
    score: hasRating ? clamp10(rating! * 2) : null,
    scoreBasis: hasRating ? 'Choosify brand rating' : 'No brand rating yet',
    values: {
      rating: hasRating ? `${rating!.toFixed(1)} / 5` : 'Not rated yet',
      publicReviews: ctx.publicStats
        ? ctx.publicStats.count > 0
          ? `${ctx.publicStats.average?.toFixed(1)} / 5 · ${ctx.publicStats.count} review${ctx.publicStats.count === 1 ? '' : 's'}`
          : 'No reviews yet'
        : undefined,
      verified: b.verifiedStatus ? 'Verified brand' : 'Not verified',
      followers: String(followers),
      products: String(ctx.productCount),
      priceRange:
        ctx.minPrice !== null && ctx.maxPrice !== null
          ? ctx.minPrice === ctx.maxPrice
            ? taka(ctx.minPrice)
            : `${taka(ctx.minPrice)} – ${taka(ctx.maxPrice)}`
          : str(b.overview?.priceRange) || undefined,
      category: str(b.category) || undefined,
      authorizedStores: authorized ? String(authorized) : undefined,
      serviceCenters: service ? String(service) : undefined,
      creatorGuides: String(ctx.creatorGuideCount),
    },
    flags: { verified: Boolean(b.verifiedStatus) },
    raw: b,
  };
}

export const BRAND_SECTIONS: CompareSectionDef[] = [
  {
    id: 'trust',
    title: 'Rating & Trust',
    metrics: [
      { key: 'rating', label: 'Choosify rating' },
      { key: 'publicReviews', label: 'Customer reviews', subLabel: 'Across the brand’s products' },
      { key: 'verified', label: 'Verification' },
      { key: 'followers', label: 'Followers' },
    ],
  },
  {
    id: 'catalog',
    title: 'Catalog & Pricing',
    metrics: [
      { key: 'products', label: 'Products listed' },
      { key: 'priceRange', label: 'Price range' },
      { key: 'category', label: 'Category' },
    ],
  },
  {
    id: 'reach',
    title: 'Stores & Coverage',
    metrics: [
      { key: 'authorizedStores', label: 'Authorized stores' },
      { key: 'serviceCenters', label: 'Service centers' },
      { key: 'creatorGuides', label: 'Creator guides', subLabel: 'Live guides mentioning it' },
    ],
  },
];

// ── Creators ───────────────────────────────────────────────────────────────

/** Creator trust score (stored 0–5 or 0–100) → 0–10, null when not scored. */
export function creatorScore10(score: unknown): number | null {
  const s = num(score);
  if (s === null || s <= 0) return null;
  return clamp10(s <= 5 ? s * 2 : s / 10);
}

export function creatorColumn(c: Record<string, any>, ctx: { liveGuideCount: number; href: string }): CompareColumn {
  const followers =
    typeof c.followers === 'number'
      ? c.followers
      : c.followers && typeof c.followers === 'object'
        ? Object.values(c.followers as Record<string, unknown>).reduce<number>((sum, v) => sum + parseCountLabel(v as string), 0)
        : 0;
  const score = creatorScore10(c.score);
  const platforms = Array.isArray(c.platforms) ? c.platforms.filter(Boolean).join(', ') : '';
  const videos = Array.isArray(c.videos) ? c.videos.length : 0;
  const reels = Array.isArray(c.reels) ? c.reels.length : 0;
  return {
    id: String(c.id),
    type: 'creator',
    name: str(c.name) || 'Untitled creator',
    subtitle: str(c.bestFor) || str(c.title),
    image: str(c.avatar),
    href: ctx.href,
    price: null,
    rating: null,
    reviewCount: 0,
    score,
    scoreBasis: score !== null ? 'Choosify creator trust score' : 'No trust score yet',
    values: {
      trust: score !== null ? `${score} / 10` : 'Not scored yet',
      verified: c.verifiedStatus ? 'Verified creator' : 'Not verified',
      followers: followers > 0 ? compact(followers) : 'Not recorded',
      niche: str(c.bestFor) || undefined,
      platforms: platforms || undefined,
      guides: String(ctx.liveGuideCount),
      videos: String(videos + reels),
    },
    flags: { verified: Boolean(c.verifiedStatus) },
    raw: c,
  };
}

export const CREATOR_SECTIONS: CompareSectionDef[] = [
  {
    id: 'trust',
    title: 'Trust & Reach',
    metrics: [
      { key: 'trust', label: 'Trust score' },
      { key: 'verified', label: 'Verification' },
      { key: 'followers', label: 'Followers', subLabel: 'Across recorded platforms' },
    ],
  },
  {
    id: 'content',
    title: 'Content',
    metrics: [
      { key: 'niche', label: 'Best for' },
      { key: 'platforms', label: 'Platforms' },
      { key: 'guides', label: 'Live guides' },
      { key: 'videos', label: 'Videos & reels' },
    ],
  },
];

// ── Buying guides ──────────────────────────────────────────────────────────

const GUIDE_FORMAT_LABEL: Record<string, string> = {
  buying_guide: 'Buying guide',
  product_review: 'Product review',
  comparison: 'Comparison',
  live: 'Live',
  tutorial: 'Tutorial',
  tips: 'Tips',
};

/** Guides are compared on coverage only — there is no guide scoring model, so no score / winner. */
export function guideColumn(g: Record<string, any>, ctx: { authorName: string; href: string }): CompareColumn {
  const products = Array.isArray(g.productIds) ? g.productIds.length : 0;
  const brands = Array.isArray(g.brandIds) ? g.brandIds.length : 0;
  const published = str(g.publishedAt);
  const date = published && !Number.isNaN(Date.parse(published)) ? new Date(published).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined;
  return {
    id: String(g.id),
    type: 'guide',
    name: str(g.title) || 'Untitled guide',
    subtitle: ctx.authorName,
    image: str(g.image),
    href: ctx.href,
    price: null,
    rating: null,
    reviewCount: 0,
    score: null,
    scoreBasis: 'Guides are not scored',
    values: {
      author: ctx.authorName || undefined,
      format: GUIDE_FORMAT_LABEL[str(g.format)] || undefined,
      media: str(g.type) ? str(g.type).replace(/^\w/, (m) => m.toUpperCase()) : undefined,
      products: String(products),
      brands: String(brands),
      published: date,
    },
    flags: {},
    raw: g,
  };
}

export const GUIDE_SECTIONS: CompareSectionDef[] = [
  {
    id: 'coverage',
    title: 'Coverage',
    metrics: [
      { key: 'products', label: 'Products covered' },
      { key: 'brands', label: 'Brands mentioned' },
    ],
  },
  {
    id: 'about',
    title: 'About the guide',
    metrics: [
      { key: 'author', label: 'Author' },
      { key: 'format', label: 'Format' },
      { key: 'media', label: 'Media' },
      { key: 'published', label: 'Published' },
    ],
  },
];

export const SECTIONS_FOR: Record<CompareEntityType, CompareSectionDef[]> = {
  product: PRODUCT_SECTIONS,
  brand: BRAND_SECTIONS,
  creator: CREATOR_SECTIONS,
  guide: GUIDE_SECTIONS,
};

// ── Winner / verdict ───────────────────────────────────────────────────────

export type WinnerResult =
  | { kind: 'winner'; column: CompareColumn; runnerUp: CompareColumn | null }
  | { kind: 'tie'; columns: CompareColumn[] }
  | { kind: 'insufficient'; reason: string }
  | { kind: 'unscored'; reason: string };

/**
 * Overall winner = the highest valid comparison score among the selected
 * subjects. Needs at least two subjects with a score; equal top scores are a
 * tie (reported honestly, never broken arbitrarily).
 */
export function decideWinner(columns: CompareColumn[], type: CompareEntityType): WinnerResult {
  if (type === 'guide') return { kind: 'unscored', reason: 'Buying guides aren’t scored — compare their coverage instead.' };
  if (columns.length < 2) {
    return { kind: 'insufficient', reason: `Add at least two ${ENTITY_NOUN[type].many} to see a winner.` };
  }
  const scored = columns.filter((c) => c.score !== null);
  if (scored.length < 2) {
    return {
      kind: 'insufficient',
      reason:
        type === 'product'
          ? 'Not enough data to determine a winner — fewer than two of these products have customer reviews yet.'
          : type === 'brand'
            ? 'Not enough data to determine a winner — fewer than two of these brands have a Choosify rating yet.'
            : 'Not enough data to determine a winner — fewer than two of these creators have a trust score yet.',
    };
  }
  const sorted = [...scored].sort((a, b) => (b.score as number) - (a.score as number));
  const top = sorted[0].score as number;
  const tied = sorted.filter((c) => c.score === top);
  if (tied.length > 1) return { kind: 'tie', columns: tied };
  return { kind: 'winner', column: sorted[0], runnerUp: sorted[1] ?? null };
}

/** Plain-language verdict built only from the winner's real values. */
export function verdictText(result: WinnerResult): string {
  if (result.kind === 'insufficient' || result.kind === 'unscored') return result.reason;
  if (result.kind === 'tie') {
    return `${result.columns.map((c) => c.name).join(' and ')} are tied at ${result.columns[0].score}/10 — compare the details below to decide.`;
  }
  const w = result.column;
  const parts = [`${w.name} leads with ${w.score}/10 (${w.scoreBasis.toLowerCase()})`];
  if (result.runnerUp && result.runnerUp.score !== null) {
    parts.push(`ahead of ${result.runnerUp.name} at ${result.runnerUp.score}/10`);
  }
  let text = `${parts.join(', ')}.`;
  if (w.type === 'product' && w.price !== null) text += ` Listed at ${taka(w.price)}.`;
  return text;
}

// ── Decision profiles (rank the CURRENT selection — never add subjects) ────

export type DecisionProfileId =
  | 'best-value'
  | 'best-budget'
  | 'best-premium'
  | 'most-reviewed'
  | 'deals'
  | 'top-rated'
  | 'most-products'
  | 'verified-only'
  | 'highest-trust'
  | 'most-followers'
  | 'most-coverage'
  | 'newest';

export interface DecisionProfile {
  id: DecisionProfileId;
  label: string;
  /** Explains how the pick is made. */
  rule: string;
  /** Dims subjects that do not meet a condition (filter-style profiles). */
  filter?: (c: CompareColumn) => boolean;
  /** Picks one subject among the selection (ranking-style profiles). */
  pick?: (cols: CompareColumn[]) => CompareColumn | null;
}

const maxBy = (cols: CompareColumn[], f: (c: CompareColumn) => number | null) => {
  let best: CompareColumn | null = null;
  let bestV = -Infinity;
  let tie = false;
  for (const c of cols) {
    const v = f(c);
    if (v === null || !Number.isFinite(v)) continue;
    if (v > bestV) {
      best = c;
      bestV = v;
      tie = false;
    } else if (v === bestV) tie = true;
  }
  return tie ? null : best;
};

export const DECISION_PROFILES: Record<CompareEntityType, DecisionProfile[]> = {
  product: [
    {
      id: 'best-value',
      label: 'Best Value',
      rule: 'Highest score per taka among the selected products that have both a price and a score.',
      pick: (cols) => maxBy(cols, (c) => (c.score !== null && c.price ? c.score / c.price : null)),
    },
    {
      id: 'best-budget',
      label: 'Best Budget',
      rule: 'Lowest listed price among the selected products.',
      pick: (cols) => maxBy(cols, (c) => (c.price ? -c.price : null)),
    },
    {
      id: 'best-premium',
      label: 'Best Premium',
      rule: 'Highest-priced selected product whose score is at least the group average.',
      pick: (cols) => {
        const scored = cols.filter((c) => c.score !== null && c.price);
        if (!scored.length) return null;
        const avg = scored.reduce((s, c) => s + (c.score as number), 0) / scored.length;
        return maxBy(scored.filter((c) => (c.score as number) >= avg), (c) => c.price);
      },
    },
    {
      id: 'most-reviewed',
      label: 'Most Reviewed',
      rule: 'Most customer reviews among the selected products.',
      pick: (cols) => maxBy(cols, (c) => (c.reviewCount > 0 ? c.reviewCount : null)),
    },
    { id: 'deals', label: 'Deals Available', rule: 'Highlights selected products with an active deal.', filter: (c) => Boolean(c.flags.deal) },
  ],
  brand: [
    { id: 'top-rated', label: 'Top Rated', rule: 'Highest Choosify rating among the selected brands.', pick: (cols) => maxBy(cols, (c) => c.score) },
    {
      id: 'most-products',
      label: 'Most Products',
      rule: 'Most products listed on Choosify.',
      pick: (cols) => maxBy(cols, (c) => num(c.values.products)),
    },
    { id: 'verified-only', label: 'Verified Only', rule: 'Highlights verified brands.', filter: (c) => Boolean(c.flags.verified) },
  ],
  creator: [
    { id: 'highest-trust', label: 'Highest Trust', rule: 'Highest trust score among the selected creators.', pick: (cols) => maxBy(cols, (c) => c.score) },
    {
      id: 'most-followers',
      label: 'Most Followers',
      rule: 'Most recorded followers.',
      pick: (cols) => maxBy(cols, (c) => {
        const raw = c.raw as Record<string, unknown>;
        const f = raw?.followers;
        const total = typeof f === 'number' ? f : f && typeof f === 'object' ? Object.values(f as Record<string, unknown>).reduce<number>((s, v) => s + parseCountLabel(v as string), 0) : 0;
        return total > 0 ? total : null;
      }),
    },
    { id: 'verified-only', label: 'Verified Only', rule: 'Highlights verified creators.', filter: (c) => Boolean(c.flags.verified) },
  ],
  guide: [
    {
      id: 'most-coverage',
      label: 'Most Coverage',
      rule: 'Covers the most products.',
      pick: (cols) => maxBy(cols, (c) => num(c.values.products)),
    },
    {
      id: 'newest',
      label: 'Newest',
      rule: 'Most recently published.',
      pick: (cols) => maxBy(cols, (c) => {
        const t = Date.parse(str((c.raw as Record<string, unknown>)?.publishedAt));
        return Number.isFinite(t) ? t : null;
      }),
    },
  ],
};

export function profileFor(type: CompareEntityType, id: DecisionProfileId | null): DecisionProfile | null {
  if (!id) return null;
  return DECISION_PROFILES[type].find((p) => p.id === id) ?? null;
}

// ── Emi (runs only on request, on the selected subjects) ───────────────────

/** Factual comparison points derived from the selected subjects' real values. */
export function emiFacts(columns: CompareColumn[], type: CompareEntityType): string[] {
  if (columns.length < 2) return [];
  const facts: string[] = [];
  const priced = columns.filter((c) => c.price !== null);
  if (priced.length >= 2) {
    const sorted = [...priced].sort((a, b) => (a.price as number) - (b.price as number));
    const lo = sorted[0];
    const hi = sorted[sorted.length - 1];
    if (lo.price !== hi.price) {
      facts.push(`${lo.name} is the lowest-priced at ${taka(lo.price as number)}; ${hi.name} is the highest at ${taka(hi.price as number)} (a ${taka((hi.price as number) - (lo.price as number))} difference).`);
    }
  }
  const scored = columns.filter((c) => c.score !== null);
  if (scored.length >= 1) {
    const best = maxBy(scored, (c) => c.score);
    if (best) facts.push(`${best.name} has the highest score here: ${best.score}/10 (${best.scoreBasis.toLowerCase()}).`);
  }
  const unscored = columns.filter((c) => c.score === null);
  if (unscored.length && type !== 'guide') {
    facts.push(`${unscored.map((c) => c.name).join(', ')} ${unscored.length === 1 ? 'has' : 'have'} no ${type === 'product' ? 'customer reviews' : type === 'brand' ? 'rating' : 'trust score'} yet, so ${unscored.length === 1 ? 'it isn’t' : 'they aren’t'} scored.`);
  }
  if (type === 'product') {
    const reviewed = maxBy(columns, (c) => (c.reviewCount > 0 ? c.reviewCount : null));
    if (reviewed) facts.push(`${reviewed.name} has the most customer reviews (${reviewed.reviewCount}).`);
    const out = columns.filter((c) => c.flags.inStock === false);
    if (out.length) facts.push(`Out of stock right now: ${out.map((c) => c.name).join(', ')}.`);
    const deals = columns.filter((c) => c.flags.deal);
    if (deals.length) facts.push(`Active deal on: ${deals.map((c) => c.name).join(', ')}.`);
    const warranty = columns.filter((c) => c.values.warranty);
    if (warranty.length && warranty.length < columns.length) {
      facts.push(`Only ${warranty.map((c) => `${c.name} (${c.values.warranty})`).join(', ')} list${warranty.length === 1 ? 's' : ''} a warranty.`);
    }
  }
  if (type === 'brand' || type === 'creator') {
    const verified = columns.filter((c) => c.flags.verified);
    if (verified.length && verified.length < columns.length) {
      facts.push(`Verified by Choosify: ${verified.map((c) => c.name).join(', ')}.`);
    }
  }
  if (type === 'brand') {
    const most = maxBy(columns, (c) => num(c.values.products));
    if (most && num(most.values.products)) facts.push(`${most.name} lists the most products on Choosify (${most.values.products}).`);
  }
  if (type === 'guide') {
    const most = maxBy(columns, (c) => num(c.values.products));
    if (most && num(most.values.products)) facts.push(`${most.name} covers the most products (${most.values.products}).`);
  }
  return facts;
}

// ── Share links ────────────────────────────────────────────────────────────

/** `/compare?mode=brand&ids=a,b` — only the active mode and its actual selection. */
export function compareShareUrl(origin: string, mode: CompareMode, ids: string[]): string {
  const q = new URLSearchParams();
  q.set('mode', mode);
  if (ids.length) q.set('ids', ids.slice(0, MAX_COMPARE_ITEMS).join(','));
  return `${origin}/compare?${q.toString()}`;
}

export function parseCompareQuery(search: string): { mode: CompareMode | null; ids: string[] } {
  const q = new URLSearchParams(search);
  const mode = q.get('mode');
  const ids = (q.get('ids') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { mode: isCompareMode(mode) ? mode : null, ids: Array.from(new Set(ids)).slice(0, MAX_COMPARE_ITEMS) };
}

/** Does any metric differ across the selected subjects? (for "Differences only") */
export function metricDiffers(columns: CompareColumn[], key: string): boolean {
  return new Set(columns.map((c) => c.values[key] ?? '')).size > 1;
}
