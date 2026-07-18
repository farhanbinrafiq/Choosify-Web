import type { EmiPanelKind } from '../../types/emi';

export interface EmiRecommendationPanelDefinition {
  kind: EmiPanelKind;
  label: string;
  icon: string;
  priority: number;
}

export const EMI_RECOMMENDATION_REGISTRY: EmiRecommendationPanelDefinition[] = [
  { kind: 'summary', label: 'Summary', icon: '📝', priority: 1 },
  { kind: 'recommendation', label: 'Recommendation', icon: '✨', priority: 2 },
  { kind: 'buying_tip', label: 'Buying Tip', icon: '💡', priority: 3 },
  { kind: 'did_you_know', label: 'Did You Know', icon: 'ℹ️', priority: 4 },
  { kind: 'alternative', label: 'Alternative', icon: '↔️', priority: 5 },
  { kind: 'money_saving', label: 'Money Saving', icon: '💰', priority: 6 },
  { kind: 'expert_advice', label: 'Expert Advice', icon: '🎯', priority: 7 },
  { kind: 'warning', label: 'Warning', icon: '⚠️', priority: 8 },
  { kind: 'coach', label: 'Shopping Coach', icon: '🛒', priority: 9 },
];
