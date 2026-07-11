import type { CatalogProduct } from '../types/catalog';
import type { SpotlightProductHealthWarning } from '../types/spotlight/merchandising/health';

const LOW_STOCK_THRESHOLD = 5;

export function assessProductHealth(product: CatalogProduct | undefined): SpotlightProductHealthWarning[] {
  if (!product) {
    return [{
      productId: 'unknown',
      type: 'deleted',
      severity: 'error',
      message: 'Product no longer exists in catalog.',
    }];
  }

  const warnings: SpotlightProductHealthWarning[] = [];

  if (product.stock <= 0) {
    warnings.push({
      productId: product.id,
      type: 'out_of_stock',
      severity: 'error',
      message: 'Product is out of stock.',
    });
  } else if (product.stock <= LOW_STOCK_THRESHOLD) {
    warnings.push({
      productId: product.id,
      type: 'low_inventory',
      severity: 'warning',
      message: `Low inventory: only ${product.stock} units left.`,
    });
  }

  if (product.status === 'draft') {
    warnings.push({
      productId: product.id,
      type: 'draft',
      severity: 'warning',
      message: 'Product is still in draft status.',
    });
  }
  if (product.status === 'archived') {
    warnings.push({
      productId: product.id,
      type: 'archived',
      severity: 'error',
      message: 'Product is archived.',
    });
  }
  if (!product.featuredFlag && product.status !== 'live') {
    warnings.push({
      productId: product.id,
      type: 'hidden',
      severity: 'warning',
      message: 'Product may not be visible to shoppers.',
    });
  }

  return warnings;
}

export function assessCampaignProductsHealth(
  productIds: string[],
  catalog: CatalogProduct[],
): SpotlightProductHealthWarning[] {
  return productIds.flatMap((id) => assessProductHealth(catalog.find((p) => p.id === id)));
}
