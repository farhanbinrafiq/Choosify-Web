import React from 'react';
import { useEmiAssistant } from '../../hooks/useEmiAssistant';
import { EmiContextPanel } from './EmiContextPanel';
import { EmiShoppingCoach } from './EmiShoppingCoach';
import { openEmiPanel } from '../../lib/emi';
import { EmiAiLogo } from '../EmiAiLogo';
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
        className="w-full text-[10px] font-bold uppercase tracking-wider choosify-emi-gradient-text hover:brightness-110 flex items-center justify-center gap-1.5 py-2"
      >
        <span className="w-4 h-4 rounded-full choosify-emi-gradient flex items-center justify-center shrink-0 p-px">
          <span className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <EmiAiLogo size={14} />
          </span>
        </span>
        Ask Emi to compare
      </button>
    </div>
  );
}
