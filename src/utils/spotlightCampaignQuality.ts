import type { SpotlightCampaignWizardDraft } from '../types/spotlight/cms';
import type {
  SpotlightCampaignQualityScore,
  SpotlightMerchantGuidance,
} from '../types/spotlight/merchandising/quality';
import { getHeroProductId } from './spotlightMerchandisingOrdering';
import { assessCampaignProductsHealth } from './spotlightProductHealth';

export function calculateCampaignQualityScore(
  draft: SpotlightCampaignWizardDraft,
  catalogProductIds: string[],
  catalog: { id: string; status: string; stock: number }[],
): SpotlightCampaignQualityScore {
  const links = draft.merchandising?.productLinks ?? [];
  const heroId = getHeroProductId(links) ?? draft.primaryProductId;
  const factors = {
    heroMediaPresent: draft.mediaIds.length > 0,
    heroProductAssigned: Boolean(heroId),
    seoCompleted: Boolean(draft.merchandising?.qualityScore?.factors?.seoCompleted),
    localizationAvailable: false,
    ctaConfigured: Boolean(draft.cta?.label && draft.cta?.url),
    scheduleConfigured: Boolean(draft.schedule?.startAt && draft.schedule?.endAt),
    validPlacements: draft.placementSurfaces.length > 0,
    brandLinked: Boolean(draft.brandId || draft.brandName || draft.linkedBrandIds?.length),
    productsVerified: catalogProductIds.every((id) => {
      const p = catalog.find((c) => c.id === id);
      return p && p.status === 'live' && p.stock > 0;
    }),
    accessoriesPresent: links.some((l) => l.role === 'accessory'),
    bundleConfigured: (draft.merchandising?.bundles?.length ?? 0) > 0,
  };

  const weights: (keyof typeof factors)[] = [
    'heroMediaPresent',
    'heroProductAssigned',
    'ctaConfigured',
    'scheduleConfigured',
    'validPlacements',
    'brandLinked',
    'productsVerified',
  ];
  const bonus: (keyof typeof factors)[] = ['accessoriesPresent', 'bundleConfigured'];

  let score = 0;
  const perMain = 100 / weights.length;
  for (const k of weights) {
    if (factors[k]) score += perMain;
  }
  for (const k of bonus) {
    if (factors[k]) score += 5;
  }

  return {
    score: Math.min(100, Math.round(score)),
    factors,
    calculatedAt: new Date().toISOString(),
  };
}

export function generateMerchantGuidance(
  draft: SpotlightCampaignWizardDraft,
  catalog: { id: string; title?: string; status: string; stock: number }[],
): SpotlightMerchantGuidance[] {
  const tips: SpotlightMerchantGuidance[] = [];
  const links = draft.merchandising?.productLinks ?? [];
  const heroId = getHeroProductId(links) ?? draft.primaryProductId;

  if (!heroId) {
    tips.push({
      id: 'missing-hero',
      message: 'Your campaign is missing a Hero Product.',
      severity: 'warning',
      field: 'hero',
    });
  }
  if (!draft.mediaIds.length) {
    tips.push({
      id: 'missing-media',
      message: 'Add hero media to improve campaign visibility.',
      severity: 'warning',
      field: 'media',
    });
  }
  if (!links.some((l) => l.role === 'accessory') && links.length > 1) {
    tips.push({
      id: 'add-accessories',
      message: 'Adding accessories typically improves conversion.',
      severity: 'suggestion',
      field: 'accessories',
    });
  } else if (links.length <= 1) {
    tips.push({
      id: 'add-accessories-empty',
      message: 'Adding accessories typically improves conversion.',
      severity: 'suggestion',
      field: 'accessories',
    });
  }
  if (!draft.placementSurfaces.includes('homepage')) {
    tips.push({
      id: 'homepage-image',
      message: 'Consider adding a landscape image for homepage placement.',
      severity: 'suggestion',
      field: 'media',
    });
  }
  if (!draft.linkedBrandIds?.length && !draft.brandName) {
    tips.push({
      id: 'link-brand',
      message: 'Link a brand to strengthen campaign context.',
      severity: 'info',
      field: 'brand',
    });
  }

  const productIds = links.length ? links.map((l) => l.productId) : draft.linkedProductIds;
  const health = assessCampaignProductsHealth(
    productIds,
    catalog as Parameters<typeof assessCampaignProductsHealth>[1],
  );
  for (const w of health.filter((h) => h.severity !== 'info').slice(0, 3)) {
    tips.push({
      id: `health-${w.productId}-${w.type}`,
      message: w.message,
      severity: w.severity === 'error' ? 'warning' : 'suggestion',
      field: `product.${w.productId}`,
    });
  }

  return tips;
}
