import type { CatalogCategory, CatalogProduct } from '../types/catalog';
import { CATEGORIES } from '../data/categories';
import { getCategoryImage } from '../lib/categoryImages';

export type CategorySubcategory = {
  /** Catalog id of the branch category (empty for the dev-only static fallback). */
  id: string;
  name: string;
  count: number;
  brands: number;
  icon: string;
};

export type CategoryDisplayItem = {
  id: string;
  /** Canonical URL slug — catalog `CatalogCategory.slug`, or the static seed id
   *  (already slug-shaped, e.g. `fashion-lifestyle`) for the dev fallback. */
  slug: string;
  name: string;
  icon: string;
  count: number;
  image?: string;
  subcategories: CategorySubcategory[];
};

/** Products filed under a main category — by catalog id, else by exact name. */
export function productsInMainCategory(
  products: CatalogProduct[],
  category: { id: string; name: string },
): CatalogProduct[] {
  const name = category.name.toLowerCase();
  return products.filter(
    (p) => p.categoryId === category.id || String(p.categoryName ?? '').toLowerCase() === name,
  );
}

/** Products filed under a subcategory — by catalog id, else by exact name within the parent. */
export function productsInSubcategory(
  products: CatalogProduct[],
  sub: { id: string; name: string },
): CatalogProduct[] {
  const name = sub.name.toLowerCase();
  return products.filter(
    (p) =>
      (sub.id && p.subcategoryId === sub.id) ||
      (!!p.subcategoryName && p.subcategoryName.toLowerCase() === name),
  );
}

function countBrands(products: CatalogProduct[]): number {
  return new Set(products.map((p) => String(p.brandName ?? '').trim().toLowerCase()).filter(Boolean)).size;
}

/**
 * Category list for the storefront, built from the live catalog taxonomy (the
 * 26 main categories and their subcategories, including seller-added ones).
 * Counts are real — a category with no products shows 0. The bundled static
 * taxonomy is used only in development when the catalog has no categories.
 */
export function buildCategoryDisplayList(
  allCategories: CatalogCategory[],
  allProducts: CatalogProduct[] = [],
): CategoryDisplayItem[] {
  const live = allCategories.filter((cat) => cat.enabled !== false);
  if (live.length > 0) {
    return live
      .filter((cat) => !cat.parentId)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.name.localeCompare(b.name))
      .map((cat) => {
        const inCategory = productsInMainCategory(allProducts, cat);
        const subcategories = live
          .filter((child) => child.parentId === cat.id)
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.name.localeCompare(b.name))
          .map((child) => {
            const inSub = productsInSubcategory(inCategory, child);
            return {
              id: child.id,
              name: child.name,
              count: inSub.length,
              brands: countBrands(inSub),
              icon: child.icon || cat.icon || 'Package',
            };
          });
        return {
          id: cat.id,
          slug: cat.slug || cat.id,
          name: cat.name,
          icon: cat.icon || 'Package',
          count: inCategory.length,
          image: getCategoryImage(cat.name),
          subcategories,
        };
      });
  }

  if (!import.meta.env.DEV) return [];

  return CATEGORIES.map((cat) => ({
    id: cat.id,
    slug: cat.id,
    name: cat.name,
    icon: cat.icon,
    count: 0,
    image: getCategoryImage(cat.name),
    subcategories: cat.subcategories.map((name) => ({ id: '', name, count: 0, brands: 0, icon: cat.icon })),
  }));
}
