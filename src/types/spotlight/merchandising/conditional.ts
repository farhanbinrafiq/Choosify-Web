/**
 * Conditional merchandising rules — CTO addition, LE-005.4
 * Architecture only — no automation implementation.
 */

import type { SpotlightMerchandisingRuleGroup } from './rules';

export type SpotlightConditionalTrigger =
  | 'product_out_of_stock'
  | 'product_low_stock'
  | 'product_hidden'
  | 'product_deleted'
  | 'campaign_ended'
  | 'campaign_expired'
  | 'hero_unavailable';

export type SpotlightConditionalAction =
  | 'replace_with_alternative'
  | 'hide_product'
  | 'remove_homepage_placement'
  | 'archive_campaign'
  | 'notify_seller'
  | 'swap_hero';

export interface SpotlightConditionalMerchandisingRule {
  ruleId: string;
  trigger: SpotlightConditionalTrigger;
  condition?: SpotlightMerchandisingRuleGroup;
  action: SpotlightConditionalAction;
  /** e.g. alternative product ID for replace_with_alternative */
  actionParams?: Record<string, unknown>;
  enabled: boolean;
  priority: number;
}
