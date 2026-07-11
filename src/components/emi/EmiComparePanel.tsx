import React from 'react';
import { Sparkles } from 'lucide-react';
import { useEmiAssistant } from '../../hooks/useEmiAssistant';
import { EmiContextPanel } from './EmiContextPanel';
import { EmiShoppingCoach } from './EmiShoppingCoach';
import { openEmiPanel } from '../../lib/emi';
import { cn } from '../../lib/utils';

interface EmiComparePanelProps {
  compareLabels?: string[];
  compareMode?: string;
  className?: string;
}

export function EmiComparePanel({ compareLabels, compareMode, className }: EmiComparePanelProps) {
  const { recommendations, coachOptions } = useEmiAssistant({
    pageId: 'compare',
    metadata: { mode: compareMode, compareLabels: compareLabels?.join(', ') },
  });

  return (
    <div className={cn('space-y-4', className)}>
      <EmiContextPanel
        title="Emi Compare"
        subtitle="Differences, fit, and value for money"
        recommendations={recommendations}
        defaultExpanded
      />
      {coachOptions.length > 0 && <EmiShoppingCoach options={coachOptions} />}
      <button
        type="button"
        onClick={() => openEmiPanel('Help me decide between these compared items')}
        className="w-full text-[10px] font-bold uppercase tracking-wider text-[#E8500A] hover:underline flex items-center justify-center gap-1 py-2"
      >
        <Sparkles size={12} aria-hidden /> Ask Emi to compare
      </button>
    </div>
  );
}
