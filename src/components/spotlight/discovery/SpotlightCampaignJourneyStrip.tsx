import React from 'react';
import type { SpotlightCampaignJourneyStep } from '../../../types/spotlight/discovery/journey';
import { cn } from '../../../lib/utils';

interface SpotlightCampaignJourneyStripProps {
  steps: SpotlightCampaignJourneyStep[];
}

export function SpotlightCampaignJourneyStrip({ steps }: SpotlightCampaignJourneyStripProps) {
  return (
    <div className="overflow-x-auto pb-2" aria-label="Campaign journey">
      <ol className="flex items-center gap-1 min-w-max">
        {steps.map((step, i) => (
          <li key={step.stage} className="flex items-center">
            {i > 0 && <span className="w-4 h-px bg-gray-200 mx-1" aria-hidden />}
            <span
              className={cn(
                'px-2 py-1 text-[9px] font-bold uppercase rounded whitespace-nowrap',
                step.isActive && 'bg-[#E8500A] text-white',
                step.isComplete && !step.isActive && 'bg-emerald-50 text-emerald-700',
                !step.isActive && !step.isComplete && 'bg-gray-50 text-gray-400',
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
