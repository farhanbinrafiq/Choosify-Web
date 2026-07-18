/**
 * Commerce CTA Registry — shopping actions before content actions
 */

import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import type { SpotlightCommerceOverlay } from '../../../types/spotlight/experience/commerceOverlay';

export type CommerceActionId =
  | 'shop_now'
  | 'product_details'
  | 'compare'
  | 'wishlist'
  | 'save'
  | 'share'
  | 'watch'
  | 'read'
  | 'view_offer';

export interface CommerceActionDefinition {
  id: CommerceActionId;
  label: string;
  priority: number;
  variant: 'primary' | 'secondary' | 'ghost';
}

export const COMMERCE_ACTION_REGISTRY: CommerceActionDefinition[] = [
  { id: 'shop_now', label: 'Shop Now', priority: 1, variant: 'primary' },
  { id: 'product_details', label: 'Product Details', priority: 2, variant: 'secondary' },
  { id: 'compare', label: 'Compare', priority: 3, variant: 'ghost' },
  { id: 'wishlist', label: 'Wishlist', priority: 4, variant: 'ghost' },
  { id: 'save', label: 'Save', priority: 5, variant: 'ghost' },
  { id: 'share', label: 'Share', priority: 6, variant: 'ghost' },
  { id: 'watch', label: 'Watch', priority: 7, variant: 'secondary' },
  { id: 'read', label: 'Read', priority: 7, variant: 'secondary' },
  { id: 'view_offer', label: 'View Offer', priority: 2, variant: 'secondary' },
];

const CONTENT_CONTENT_ACTION: Partial<Record<SpotlightContentType, CommerceActionId>> = {
  buying_guide: 'read',
  tutorial: 'read',
  tips: 'read',
  editorial: 'read',
  creator_review: 'watch',
  product_review: 'watch',
  live: 'watch',
  livestream_replay: 'watch',
  promotion: 'view_offer',
};

export function resolveCommerceActions(input: {
  contentType: SpotlightContentType;
  hasProduct: boolean;
  commerce?: SpotlightCommerceOverlay;
  densityCompact?: boolean;
}): CommerceActionDefinition[] {
  const primaryLabel = input.commerce?.primaryCta?.label ?? 'Shop Now';
  const actions: CommerceActionDefinition[] = [];

  if (input.hasProduct) {
    actions.push({ ...COMMERCE_ACTION_REGISTRY.find((a) => a.id === 'shop_now')!, label: primaryLabel });
    actions.push({ ...COMMERCE_ACTION_REGISTRY.find((a) => a.id === 'product_details')! });
    if (!input.densityCompact) {
      actions.push(COMMERCE_ACTION_REGISTRY.find((a) => a.id === 'compare')!);
      actions.push(COMMERCE_ACTION_REGISTRY.find((a) => a.id === 'wishlist')!);
    }
  } else {
    const contentAction = CONTENT_CONTENT_ACTION[input.contentType] ?? 'read';
    actions.push(COMMERCE_ACTION_REGISTRY.find((a) => a.id === contentAction)!);
  }

  if (!input.densityCompact) {
    actions.push(COMMERCE_ACTION_REGISTRY.find((a) => a.id === 'share')!);
  }

  return actions.sort((a, b) => a.priority - b.priority);
}
