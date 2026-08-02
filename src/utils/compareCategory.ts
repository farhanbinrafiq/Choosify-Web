/** Shared category lock helpers for the Compare engine / cart. */

export type CompareLockedCategory = {
  key: string;
  label: string;
};

export function getProductCategoryLabel(product: any): string {
  const raw = String(
    product?.categoryName || product?.category || product?.serviceCategory || 'General',
  ).trim();
  return raw || 'General';
}

export function getProductCategoryKey(product: any): string {
  const id = product?.categoryId;
  if (id != null && String(id).trim()) {
    return String(id).trim().toLowerCase();
  }
  return (
    getProductCategoryLabel(product)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'general'
  );
}

/** Locked category is always taken from the first item in the compare list. */
export function getCompareLockedCategory(
  comparedProducts: any[] | null | undefined,
): CompareLockedCategory | null {
  if (!comparedProducts?.length) return null;
  const first = comparedProducts[0];
  return {
    key: getProductCategoryKey(first),
    label: getProductCategoryLabel(first),
  };
}

export function isSameCompareCategory(
  product: any,
  locked: CompareLockedCategory | null | undefined,
): boolean {
  if (!locked) return true;
  return getProductCategoryKey(product) === locked.key;
}

export function filterProductsToCompareCategory<T>(
  products: T[],
  locked: CompareLockedCategory | null | undefined,
): T[] {
  if (!locked) return products;
  return products.filter((product) => isSameCompareCategory(product, locked));
}

/** Drop cross-category leftovers from legacy localStorage / seeds (keep first item's category). */
export function pruneComparedToFirstCategory(products: any[]): any[] {
  if (!Array.isArray(products) || products.length === 0) return [];
  const locked = getCompareLockedCategory(products);
  if (!locked) return [];
  return products.filter((product) => isSameCompareCategory(product, locked)).slice(0, 4);
}

export function compareCategoryBrowseHref(label: string): string {
  return `/products?category=${encodeURIComponent(label)}`;
}

export function compareCategoryMismatchMessage(locked: CompareLockedCategory): string {
  return `Only “${locked.label}” items can be added to this comparison. Clear compare or browse matching products.`;
}
