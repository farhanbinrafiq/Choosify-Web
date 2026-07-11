import type { CatalogProduct } from '../types/catalog';
import type {
  SpotlightProductSearchFilters,
  SpotlightProductSearchSortKey,
} from '../types/spotlight/merchandising/search';

export function searchCatalogProducts(
  products: CatalogProduct[],
  filters: SpotlightProductSearchFilters,
  sortBy: SpotlightProductSearchSortKey = 'newest',
): CatalogProduct[] {
  let items = [...products];
  const q = filters.query?.trim().toLowerCase();

  if (q) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters.sku) {
    const sku = filters.sku.toLowerCase();
    items = items.filter((p) => p.slug.toLowerCase().includes(sku) || p.id.toLowerCase().includes(sku));
  }
  if (filters.brandId) items = items.filter((p) => p.brandId === filters.brandId);
  if (filters.brandName) {
    const bn = filters.brandName.toLowerCase();
    items = items.filter((p) => p.brandName.toLowerCase().includes(bn));
  }
  if (filters.categoryId) items = items.filter((p) => p.categoryId === filters.categoryId);
  if (filters.categoryName) {
    const cn = filters.categoryName.toLowerCase();
    items = items.filter((p) => p.categoryName.toLowerCase().includes(cn));
  }
  if (filters.tag) {
    const t = filters.tag.toLowerCase();
    items = items.filter((p) => p.tags.some((tag) => tag.toLowerCase().includes(t)));
  }
  if (filters.priceMin != null) items = items.filter((p) => p.price >= filters.priceMin!);
  if (filters.priceMax != null) items = items.filter((p) => p.price <= filters.priceMax!);
  if (filters.status) items = items.filter((p) => p.status === filters.status);
  if (filters.inStockOnly) items = items.filter((p) => p.stock > 0);
  if (filters.recentlyUpdatedDays) {
    const cutoff = Date.now() - filters.recentlyUpdatedDays * 86400000;
    items = items.filter((p) => new Date(p.updatedAt).getTime() >= cutoff);
  }

  items.sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'popularity':
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || (b.featuredFlag ? 1 : 0) - (a.featuredFlag ? 1 : 0);
      case 'rating':
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      case 'newest':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return items;
}

export function attachBrandProducts(products: CatalogProduct[], brandId: string): string[] {
  return products.filter((p) => p.brandId === brandId).map((p) => p.id);
}

export function attachCategoryProducts(products: CatalogProduct[], categoryId: string): string[] {
  return products.filter((p) => p.categoryId === categoryId).map((p) => p.id);
}
