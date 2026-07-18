import type { CatalogProduct } from '../types/catalog';
import type { CategoryDisplayItem } from './categoryDisplay';

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

function productsInCategory(products: CatalogProduct[], categoryName: string): CatalogProduct[] {
  const needle = categoryName.toLowerCase();
  return products.filter((product) => {
    const category = String(product.categoryName ?? '').toLowerCase();
    return category === needle || category.includes(needle) || needle.includes(category);
  });
}

export function getCategoryStatBlock(
  category: CategoryDisplayItem,
  products: CatalogProduct[] = [],
): CategoryStatBlock {
  const slice = productsInCategory(products, category.name);
  const brandsFromProducts = new Set(
    slice.map((p) => String(p.brandName ?? '').trim().toLowerCase()).filter(Boolean),
  ).size;
  const brandsFromSubs = category.subcategories.reduce((sum, sub) => sum + sub.brands, 0);
  const dealsFromProducts = slice.filter((p) => p.isDeal || (p.originalPrice && p.originalPrice > p.price)).length;

  return {
    products: category.count,
    brands: Math.max(brandsFromProducts, brandsFromSubs, 1),
    deals: dealsFromProducts || Math.max(1, Math.floor(category.count * 0.12)),
  };
}

export function buildCategoriesPageStats(options: {
  products: CatalogProduct[];
  brands: unknown[];
  deals: unknown[];
  guides: unknown[];
  creators: unknown[];
}): CategoriesPageStats {
  const productCount = options.products.length || 2500;
  return {
    products: productCount >= 1000 ? Math.floor(productCount / 100) * 100 : productCount,
    brands: options.brands.length || 500,
    deals: options.deals.length || Math.max(120, Math.floor(productCount * 0.05)),
    guides: options.guides.length || 300,
    creators: options.creators.length || 200,
  };
}

export function getCategoryBrandNames(category: CategoryDisplayItem, products: CatalogProduct[]): string[] {
  const slice = productsInCategory(products, category.name);
  const names = new Set<string>();
  slice.forEach((p) => {
    const brand = String(p.brandName ?? '').trim();
    if (brand) names.add(brand);
  });
  if (names.size >= 4) return [...names].slice(0, 8);
  return ['Samsung', 'Apple', 'Sony', 'Walton', 'Xiaomi', 'Aarong', 'Bata', 'Pickaboo'].slice(0, 6);
}

export function getCategoryProducts(category: CategoryDisplayItem, products: CatalogProduct[], limit = 6): CatalogProduct[] {
  return productsInCategory(products, category.name).slice(0, limit);
}
