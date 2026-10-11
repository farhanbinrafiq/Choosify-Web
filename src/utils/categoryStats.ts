import type { CatalogProduct } from '../types/catalog';
import { productsInMainCategory, type CategoryDisplayItem } from './categoryDisplay';

export type CategoryStatBlock = {
  products: number;
  brands: number;
  deals: number;
};

export type CategoriesPageStats = {
  products: number;
  brands: number;
  deals: number;
  guides: number;
  creators: number;
};

const SUBCATEGORY_EMOJI: Record<string, string> = {
  smartphones: '📱',
  phones: '📱',
  watches: '⌚',
  laptops: '💻',
  audio: '🎧',
  cameras: '📷',
  footwear: '👟',
  wear: '👔',
  gaming: '🎮',
  furniture: '🛋️',
  kitchen: '🍳',
  fitness: '🏋️',
  travel: '✈️',
  beauty: '💄',
  jewelry: '💎',
  toys: '🧸',
  grocery: '🛒',
  organic: '🥗',
};

export function getSubcategoryEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(SUBCATEGORY_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return '✦';
}

/** Real per-category figures only — 0 when there is nothing yet. */
export function getCategoryStatBlock(
  category: CategoryDisplayItem,
  products: CatalogProduct[] = [],
): CategoryStatBlock {
  const slice = productsInMainCategory(products, category);
  return {
    products: slice.length,
    brands: new Set(slice.map((p) => String(p.brandName ?? '').trim().toLowerCase()).filter(Boolean)).size,
    deals: slice.filter((p) => p.isDeal || (p.originalPrice && p.originalPrice > p.price)).length,
  };
}

/** Real platform totals only — never padded with placeholder numbers. */
export function buildCategoriesPageStats(options: {
  products: CatalogProduct[];
  brands: unknown[];
  deals: unknown[];
  guides: unknown[];
  creators: unknown[];
}): CategoriesPageStats {
  return {
    products: options.products.length,
    brands: options.brands.length,
    deals: options.deals.length,
    guides: options.guides.length,
    creators: options.creators.length,
  };
}

export function getCategoryBrandNames(category: CategoryDisplayItem, products: CatalogProduct[]): string[] {
  const names = new Set<string>();
  productsInMainCategory(products, category).forEach((p) => {
    const brand = String(p.brandName ?? '').trim();
    if (brand) names.add(brand);
  });
  return [...names].slice(0, 8);
}

export function getCategoryProducts(category: CategoryDisplayItem, products: CatalogProduct[], limit = 6): CatalogProduct[] {
  return productsInMainCategory(products, category).slice(0, limit);
}
