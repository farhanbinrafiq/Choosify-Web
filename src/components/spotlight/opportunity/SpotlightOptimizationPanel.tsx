import React from 'react';
import type { SpotlightOpportunityInstance } from '../../../types/spotlight/opportunity';
import { SpotlightOpportunityCard } from './SpotlightOpportunityCard';

interface SpotlightOptimizationPanelProps {
  title: string;
  description?: string;
  opportunities: SpotlightOpportunityInstance[];
  onDismiss?: (id: string) => void;
  onResolve?: (id: string) => void;
  onPin?: (id: string) => void;
}

export function SpotlightOptimizationPanel({
  title,
  description,
  opportunities,
  onDismiss,
  onResolve,
  onPin,
}: SpotlightOptimizationPanelProps) {
  if (!opportunities.length) {
    return (
      <div className="bg-[#F8FBFD] border border-[#e8edf2] rounded-xl p-6 text-center">
        <p className="text-sm font-bold text-navy">{title}</p>
        <p className="text-xs text-emerald-600 mt-2">No open opportunities — great work!</p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-black text-navy uppercase">{title}</h2>
        {description && <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opportunities.map((o) => (
          <SpotlightOpportunityCard key={o.opportunityId} opportunity={o} onDismiss={onDismiss} onResolve={onResolve} onPin={onPin} />
        ))}
      </div>
    </section>
  );
}
