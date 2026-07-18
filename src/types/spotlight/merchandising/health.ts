/**
 * Per-product health warnings for seller guidance — LE-005.4
 */

export type SpotlightProductHealthWarningType =
  | 'out_of_stock'
  | 'low_inventory'
  | 'low_rating'
  | 'hidden'
  | 'draft'
  | 'archived'
  | 'deleted'
  | 'pending_review'
  | 'trust_warning'
  | 'performance_warning';

export interface SpotlightProductHealthWarning {
  productId: string;
  type: SpotlightProductHealthWarningType;
  severity: 'info' | 'warning' | 'error';
  message: string;
}
