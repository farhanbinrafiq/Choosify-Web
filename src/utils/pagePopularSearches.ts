import type { CatalogProduct, SitePopularSearch } from '../types/catalog';
import { buildCategoryPopularSearchTerms } from './categoryPopularSearches';

function normalizeTerm(term: string): string {
  return term.trim().replace(/\s+/g, ' ');
}

/** Build a large keyword cloud (20–30+) for listing pages from CMS + catalog data. */
export function buildPagePopularSearchTerms(options: {
  cmsTerms?: SitePopularSearch[];
  products?: CatalogProduct[];
  categoryNames?: string[];
  brandNames?: string[];
  limit?: number;
}): string[] {
  const limit = options.limit ?? 30;
  const seen = new Set<string>();
  const results: string[] = [];

  const push = (term: string) => {
    const normalized = normalizeTerm(term);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    results.push(normalized);
  };

  const cmsActive = (options.cmsTerms ?? [])
    .filter((item) => item.isActive && item.term.trim())
    .sort((a, b) => a.order - b.order);

  cmsActive.forEach((item) => push(item.term));
  options.categoryNames?.forEach((name) => push(name));
  options.brandNames?.forEach((name) => push(name));

  (options.products ?? []).slice(0, 20).forEach((product) => {
    push(product.title);
    if (product.brandName) push(product.brandName);
    if (product.categoryName) push(product.categoryName);
  });

  if (results.length < limit) {
    [
      'Samsung Galaxy',
      'Aarong Fashion',
      'iPhone 15',
      'Walton Fridge',
      'Apex Shoes',
      'Best Deals',
      'Electronics',
      'Fashion & Lifestyle',
      'Home Appliances',
      'Verified Brands',
    ].forEach(push);
  }

  return results.slice(0, limit);
}

/** Keywords for a chunk of category cards (Categories page interstitial rows). */
export function buildCategoryChunkPopularSearchTerms(options: {
  categoryNames: string[];
  cmsTerms?: SitePopularSearch[];
  products?: CatalogProduct[];
  limit?: number;
}): string[] {
  const names = options.categoryNames.filter(Boolean);
  if (!names.length) {
    return buildPagePopularSearchTerms({
      cmsTerms: options.cmsTerms,
      products: options.products,
      limit: options.limit ?? 12,
    });
  }

  const merged: string[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    for (const term of buildCategoryPopularSearchTerms({
      categoryName: name,
      cmsTerms: options.cmsTerms,
      products: options.products,
      limit: 8,
    })) {
      const key = term.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(term);
    }
  }

  return merged.slice(0, options.limit ?? 12);
}

export function getCategoryChunkPopularSearchHeading(categoryNames: string[]): string {
  const names = categoryNames.filter(Boolean);
  if (names.length === 1) return `Popular searches in ${names[0]}`;
  if (names.length > 1) return `Popular searches: ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''}`;
  return 'Popular searches on Choosify';
}

export function buildDealsPopularSearchTerms(options: {
  cmsTerms?: SitePopularSearch[];
  products?: CatalogProduct[];
  limit?: number;
}): string[] {
  const dealProducts = (options.products ?? []).filter(
    (p) => Boolean((p as { dealValidUntil?: string }).dealValidUntil) || (p as { discount?: number }).discount,
  );
  return buildPagePopularSearchTerms({
    cmsTerms: options.cmsTerms,
    products: dealProducts.length ? dealProducts : options.products,
    limit: options.limit ?? 12,
  });
}

export function buildBrandsPopularSearchTerms(options: {
  cmsTerms?: SitePopularSearch[];
  brandNames?: string[];
  limit?: number;
}): string[] {
  return buildPagePopularSearchTerms({
    cmsTerms: options.cmsTerms,
    brandNames: options.brandNames,
    limit: options.limit ?? 12,
  });
}

export function buildCreatorsPopularSearchTerms(options: {
  cmsTerms?: SitePopularSearch[];
  creatorNames?: string[];
  limit?: number;
}): string[] {
  const limit = options.limit ?? 12;
  const seen = new Set<string>();
  const results: string[] = [];
  const push = (term: string) => {
    const normalized = normalizeTerm(term);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    results.push(normalized);
  };

  (options.cmsTerms ?? [])
    .filter((item) => item.isActive && item.term.trim())
    .sort((a, b) => a.order - b.order)
    .forEach((item) => push(item.term));

  options.creatorNames?.forEach((name) => push(name));

  ['Tech Reviewers', 'Fashion Creators', 'Gadget Unboxing', 'Budget Finds', 'Verified Creators'].forEach(push);

  return results.slice(0, limit);
}

export function buildGuidePopularSearchTerms(options: {
  cmsTerms?: SitePopularSearch[];
  guideTitle?: string;
  guideCategory?: string;
  guideTags?: string[];
  relatedGuideTitles?: string[];
  limit?: number;
}): string[] {
  const limit = options.limit ?? 12;
  const seen = new Set<string>();
  const results: string[] = [];
  const push = (term: string) => {
    const normalized = normalizeTerm(term);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    results.push(normalized);
  };

  (options.cmsTerms ?? [])
    .filter((item) => item.isActive && item.term.trim())
    .sort((a, b) => a.order - b.order)
    .forEach((item) => push(item.term));

  if (options.guideTitle) push(options.guideTitle);
  if (options.guideCategory) push(options.guideCategory);
  options.guideTags?.forEach((tag) => push(String(tag)));
  options.relatedGuideTitles?.forEach((title) => push(title));

  ['Buying Guides', 'Product Reviews', 'Best Picks 2026', 'Compare Before Buy', 'Expert Tips'].forEach(push);

  return results.slice(0, limit);
}

export function buildGuidesPopularSearchTerms(options: {
  cmsTerms?: SitePopularSearch[];
  guideTitles?: string[];
  limit?: number;
}): string[] {
  const limit = options.limit ?? 12;
  const seen = new Set<string>();
  const results: string[] = [];
  const push = (term: string) => {
    const normalized = normalizeTerm(term);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    results.push(normalized);
  };

  (options.cmsTerms ?? [])
    .filter((item) => item.isActive && item.term.trim())
    .sort((a, b) => a.order - b.order)
    .forEach((item) => push(item.term));

  options.guideTitles?.forEach((title) => push(title));

  ['Buying Guides', 'Product Reviews', 'Best Picks 2026', 'Compare Before Buy', 'Expert Tips'].forEach(push);

  return results.slice(0, limit);
}
