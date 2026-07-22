import type { CatalogProduct } from '../types/catalog';
import type { CommerceProduct } from '../types/schemas';

/** Map commerce/cart product rows to canonical catalog products for display APIs. */
export function commerceProductToCatalog(product: CommerceProduct, index = 0): CatalogProduct {
  const catalogId = product.catalogId || String(product.id);
  const categoryName = product.category || 'General';
  return {
    id: catalogId,
    slug: product.slug || catalogId,
    title: product.title,
    description: product.description || '',
    brandId: String(product.brandId),
    brandName: product.brand || 'Unknown',
    categoryId: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    categoryName,
    image: product.image || '',
    gallery: product.image ? [product.image] : [],
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock,
    status: 'live',
    tags: product.tags || [],
    isDeal: Boolean(product.isDeal),
    dealType: product.dealType,
    discountPercent: product.discountPercent,
    promoCode: product.promoCode,
    dealValidUntil: product.dealValidUntil,
    featuredFlag: Boolean(product.featuredFlag),
    isNewArrival: Boolean(product.isNewArrival),
    isBestseller: Boolean(product.isBestseller),
    createdAt: product.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productType: product.productType,
    serviceCategory: product.serviceCategory,
  };
}

/** Normalize legacy mock constant rows (string prices, numeric ids) to catalog products. */
export function legacyMockProductToCatalog(
  product: {
    id: number;
    title: string;
    brand: string;
    price: string;
    originalPrice?: string;
    image: string;
    category: string;
    tag?: string;
    rating?: number;
    reviews?: number;
    description?: string;
    isDeal?: boolean;
  },
  index = 0,
): CatalogProduct {
  const cleanPrice = parseFloat(String(product.price).replace(/,/g, '')) || 0;
  const cleanOriginal = product.originalPrice
    ? parseFloat(String(product.originalPrice).replace(/,/g, ''))
    : undefined;
  const catalogId = String(product.id);
  const categoryName = product.category || 'General';
  return {
    id: catalogId,
    slug: catalogId,
    title: product.title,
    description: product.description || '',
  brandId: String(product.brand || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-'),
  brandName: product.brand || 'Unknown',
    categoryId: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    categoryName,
    image: product.image,
    gallery: [product.image],
    price: cleanPrice,
    originalPrice: cleanOriginal,
    stock: 0,
    status: 'live',
    tags: product.tag ? [product.tag] : [],
    isDeal: Boolean(product.isDeal) || product.tag === 'SALE' || product.tag === 'HOT',
    featuredFlag: product.tag === 'NEW' || product.tag === 'HOT',
    isNewArrival: product.tag === 'NEW',
    isBestseller: product.tag === 'HOT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function resolveCatalogProducts(
  apiProducts: CatalogProduct[] | null | undefined,
  commerceProducts: CommerceProduct[],
): CatalogProduct[] {
  const fromCommerce = commerceProducts.map(commerceProductToCatalog);
  if (!apiProducts?.length) return fromCommerce;

  // Keep API catalog as primary, but prepend any commerce-only rows (e.g. local service seeds)
  const apiIds = new Set(apiProducts.map((p) => String(p.id)));
  const extras = fromCommerce.filter((p) => !apiIds.has(String(p.id)));
  return extras.length ? [...extras, ...apiProducts] : apiProducts;
}
