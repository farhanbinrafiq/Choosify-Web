/**
 * Reusable merchandising rule objects — LE-005.4
 * Smart collections and conditional merchandising use the same rule model.
 */

export type SpotlightMerchandisingRuleField =
  | 'brand'
  | 'category'
  | 'seller'
  | 'price_range'
  | 'discount'
  | 'rating'
  | 'review_count'
  | 'availability'
  | 'stock'
  | 'verified_seller'
  | 'campaign_tags'
  | 'created_date'
  | 'updated_date'
  | 'ai_score'
  | 'trust_score'
  | 'popularity_score';

export type SpotlightMerchandisingRuleOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'in'
  | 'not_in';

export interface SpotlightMerchandisingRule {
  ruleId: string;
  field: SpotlightMerchandisingRuleField;
  operator: SpotlightMerchandisingRuleOperator;
  value: string | number | boolean | string[] | { min?: number; max?: number };
}

export interface SpotlightMerchandisingRuleGroup {
  match: 'all' | 'any';
  rules: SpotlightMerchandisingRule[];
}
