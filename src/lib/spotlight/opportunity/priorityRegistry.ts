import type { OpportunityPriority } from '../../../types/spotlight/opportunity';

export interface PriorityDefinition {
  id: OpportunityPriority;
  label: string;
  color: string;
  sortOrder: number;
}

export const PRIORITY_REGISTRY: PriorityDefinition[] = [
  { id: 'critical', label: 'Critical', color: '#dc2626', sortOrder: 0 },
  { id: 'high', label: 'High', color: '#EB4501', sortOrder: 1 },
  { id: 'medium', label: 'Medium', color: '#f59e0b', sortOrder: 2 },
  { id: 'low', label: 'Low', color: '#94a3b8', sortOrder: 3 },
];

export function getPriorityDefinition(id: OpportunityPriority): PriorityDefinition {
  return PRIORITY_REGISTRY.find((p) => p.id === id)!;
}
