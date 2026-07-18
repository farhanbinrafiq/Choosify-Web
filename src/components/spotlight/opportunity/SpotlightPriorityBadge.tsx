import type { OpportunityPriority } from '../../../types/spotlight/opportunity';
import { getPriorityDefinition } from '../../../lib/spotlight/opportunity/priorityRegistry';

interface SpotlightPriorityBadgeProps {
  priority: OpportunityPriority;
}

export function SpotlightPriorityBadge({ priority }: SpotlightPriorityBadgeProps) {
  const def = getPriorityDefinition(priority);
  return (
    <span
      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
      style={{ backgroundColor: def.color }}
    >
      {def.label}
    </span>
  );
}
