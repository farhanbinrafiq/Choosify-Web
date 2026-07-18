import type { EmiConfidenceLevel } from '../../types/emi';

export interface EmiConfidenceDefinition {
  level: EmiConfidenceLevel;
  label: string;
  minScore: number;
  color: string;
}

export const EMI_CONFIDENCE_REGISTRY: EmiConfidenceDefinition[] = [
  { level: 'high', label: 'High confidence', minScore: 80, color: '#059669' },
  { level: 'medium', label: 'Medium confidence', minScore: 55, color: '#d97706' },
  { level: 'low', label: 'Low confidence', minScore: 30, color: '#6b7280' },
  { level: 'placeholder', label: 'Preview', minScore: 0, color: '#9ca3af' },
];

export function confidenceFromScore(score: number): EmiConfidenceLevel {
  if (score >= 80) return 'high';
  if (score >= 55) return 'medium';
  if (score >= 30) return 'low';
  return 'placeholder';
}

export function confidenceLabel(level: EmiConfidenceLevel): string {
  return EMI_CONFIDENCE_REGISTRY.find((c) => c.level === level)?.label ?? level;
}
