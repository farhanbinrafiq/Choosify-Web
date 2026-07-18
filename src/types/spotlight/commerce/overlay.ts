/**
 * Extended commerce overlay — Phase 2 collaborative commerce
 */

import type { SpotlightCommerceOverlay as BaseOverlay } from '../experience/commerceOverlay';

export interface SpotlightCommerceActions {
  compare: boolean;
  wishlist: boolean;
  buy: boolean;
  share: boolean;
  contact: boolean;
}

export interface SpotlightCommerceOverlayV2 extends BaseOverlay {
  actions: SpotlightCommerceActions;
  /** Pinned during live sessions */
  pinnedServiceIds?: string[];
  pinnedCouponIds?: string[];
  compareProductIds?: string[];
  contactHref?: string;
}

export const DEFAULT_COMMERCE_ACTIONS: SpotlightCommerceActions = {
  compare: true,
  wishlist: true,
  buy: true,
  share: true,
  contact: false,
};

export function enrichCommerceOverlay(base: BaseOverlay): SpotlightCommerceOverlayV2 {
  return {
    ...base,
    actions: DEFAULT_COMMERCE_ACTIONS,
    pinnedServiceIds: base.featuredServiceIds.slice(0, 3),
    pinnedCouponIds: base.couponIds.slice(0, 2),
    compareProductIds: base.featuredProductIds.slice(0, 4),
  };
}
