import type { CatalogProduct } from '../types/catalog';
import type { SpotlightCampaignWizardDraft } from '../types/spotlight/cms';
import type { SpotlightCampaignMerchandising } from '../types/spotlight/merchandising/model';
import type { SpotlightCampaignProductLink } from '../types/spotlight/merchandising/productLink';
import { getMediaById } from '../services/spotlightCampaignStorage';
import { assessProductHealth } from './spotlightProductHealth';
import { findDuplicateProductIds, getHeroProductId, hasDuplicateHero } from './spotlightMerchandisingOrdering';

export interface MerchandisingValidationIssue {
  field: string;
  message: string;
}

export interface MerchandisingValidationResult {
  valid: boolean;
  issues: MerchandisingValidationIssue[];
}

function push(issues: MerchandisingValidationIssue[], field: string, message: string) {
  issues.push({ field, message });
}

export function validateMerchandisingForPublish(
  merchandising: SpotlightCampaignMerchandising,
  catalog: CatalogProduct[],
  mediaIds: string[],
): MerchandisingValidationResult {
  const issues: MerchandisingValidationIssue[] = [];
  const { productLinks } = merchandising;

  if (!productLinks.length) {
    push(issues, 'productLinks', 'At least one product must be attached.');
    return { valid: false, issues };
  }

  if (hasDuplicateHero(productLinks)) {
    push(issues, 'hero', 'Only one Hero Product is allowed.');
  }

  const dupes = findDuplicateProductIds(productLinks);
  if (dupes.length) {
    push(issues, 'productLinks', `Duplicate products: ${dupes.join(', ')}`);
  }

  const heroId = getHeroProductId(productLinks);
  if (!heroId) {
    push(issues, 'hero', 'A Hero Product must be assigned.');
  }

  for (const link of productLinks) {
    const product = catalog.find((p) => p.id === link.productId);
    if (!product) {
      push(issues, `product.${link.productId}`, 'Product does not exist in catalog.');
      continue;
    }
    if (product.status !== 'live') {
      push(issues, `product.${link.productId}`, `Product "${product.title}" is not active (status: ${product.status}).`);
    }
    if (product.stock <= 0 && link.role === 'hero') {
      push(issues, `product.${link.productId}`, `Hero product "${product.title}" is out of stock.`);
    }
    const health = assessProductHealth(product);
    const errors = health.filter((h) => h.severity === 'error');
    for (const e of errors) {
      push(issues, `product.${link.productId}`, e.message);
    }
  }

  if (!mediaIds.length || !mediaIds.some((id) => getMediaById(id))) {
    push(issues, 'media', 'Campaign media is required for publishing.');
  }

  return { valid: issues.length === 0, issues };
}

export function validateWizardMerchandisingStep(
  links: SpotlightCampaignProductLink[],
): MerchandisingValidationResult {
  const issues: MerchandisingValidationIssue[] = [];
  if (!links.length) push(issues, 'productLinks', 'Attach at least one product.');
  if (!getHeroProductId(links)) push(issues, 'hero', 'Assign a Hero Product.');
  if (hasDuplicateHero(links)) push(issues, 'hero', 'Only one Hero Product allowed.');
  return { valid: issues.length === 0, issues };
}

export function validateMerchandisingFromDraft(
  draft: SpotlightCampaignWizardDraft,
  catalog: CatalogProduct[],
): MerchandisingValidationResult {
  if (draft.merchandising?.productLinks.length) {
    return validateMerchandisingForPublish(draft.merchandising, catalog, draft.mediaIds);
  }
  const links: SpotlightCampaignProductLink[] = draft.linkedProductIds.map((id, i) => ({
    productId: id,
    role: id === draft.primaryProductId ? 'hero' : 'featured',
    displayOrder: i,
  }));
  return validateMerchandisingForPublish(
    { productLinks: links, slots: [], collections: [], bundles: [] },
    catalog,
    draft.mediaIds,
  );
}
