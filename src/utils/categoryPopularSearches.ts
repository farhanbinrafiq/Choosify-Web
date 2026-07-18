import type { CatalogProduct, SitePopularSearch } from '../types/catalog';

function normalizeTerm(term: string): string {
  return term.trim().replace(/\s+/g, ' ');
}

function categoryKeywords(categoryName: string): string[] {
  return categoryName
    .toLowerCase()
    .split(/[\s&,/]+/)
    .filter((part) => part.length > 2);
}

function termMatchesCategory(term: string, categoryName: string): boolean {
  const lower = term.toLowerCase();
  const keywords = categoryKeywords(categoryName);
  return keywords.some((keyword) => lower.includes(keyword));
}

function productMatchesCategory(product: CatalogProduct, categoryName: string): boolean {
  const name = categoryName.toLowerCase();
  const productCategory = (product.categoryName || '').toLowerCase();
  if (!productCategory) return false;
  return productCategory.includes(name) || name.split(/[\s&]+/).some((part) => part.length > 3 && productCategory.includes(part));
}

export function buildCategoryPopularSearchTerms(options: {
  categoryName?: string | null;
  subcategoryNames?: string[];
  cmsTerms?: SitePopularSearch[];
  products?: CatalogProduct[];
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

  const cmsActive = (options.cmsTerms ?? [])
    .filter((item) => item.isActive && item.term.trim())
    .sort((a, b) => a.order - b.order);

  const categoryName = options.categoryName?.trim();

  if (categoryName) {
    options.subcategoryNames?.forEach((name) => push(name));

    (options.products ?? [])
      .filter((product) => productMatchesCategory(product, categoryName))
      .slice(0, 8)
      .forEach((product) => push(product.title));

    cmsActive
      .filter((item) => termMatchesCategory(item.term, categoryName))
      .forEach((item) => push(item.term));
  }

  cmsActive.forEach((item) => push(item.term));

  if (results.length === 0) {
    [
      'Samsung Galaxy',
      'Aarong Fashion',
      'iPhone 15',
      'Walton Fridge',
      'Apex Shoes',
      'Best Deals',
    ].forEach(push);
  }

  return results.slice(0, limit);
}

export function getCategoryPopularSearchHeading(categoryName?: string | null): string {
  if (categoryName?.trim()) {
    return `Popular searches in ${categoryName.trim()}`;
  }
  return 'Popular searches on Choosify';
}
