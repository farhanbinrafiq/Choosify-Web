import React from 'react';
import { Link } from 'react-router-dom';
import type { SpotlightOpportunityInstance } from '../../../types/spotlight/opportunity';
import { SpotlightPriorityBadge } from './SpotlightPriorityBadge';
import { EmiOpportunityInsight } from '../../emi/EmiOpportunityInsight';
import { cn } from '../../../lib/utils';

interface SpotlightOpportunityCardProps {
  opportunity: SpotlightOpportunityInstance;
  onDismiss?: (id: string) => void;
  onResolve?: (id: string) => void;
  onPin?: (id: string) => void;
  showCoach?: boolean;
}

export function SpotlightOpportunityCard({
  opportunity,
  onDismiss,
  onResolve,
  onPin,
  showCoach = true,
}: SpotlightOpportunityCardProps) {
  const inner = (
    <div className={cn(
      'bg-white rounded-xl p-4 space-y-3 transition-shadow hover:shadow-md border border-[#E8EDF2]',
      opportunity.status === 'pinned' ? 'border-[#EB4501] ring-1 ring-[#EB4501]/20' : 'border-[#e8edf2]',
      opportunity.status === 'dismissed' && 'opacity-50',
    )}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SpotlightPriorityBadge priority={opportunity.priority} />
            <span className="text-[9px] font-bold uppercase text-gray-400">{opportunity.category.replace(/_/g, ' ')}</span>
          </div>
          <h3 className="text-sm font-black text-navy mt-1">{opportunity.title}</h3>
          <p className="text-[10px] text-gray-400">{opportunity.entityLabel}</p>
        </div>
        {opportunity.estimatedImpactPercent > 0 && (
          <span className="text-xs font-black text-emerald-600 shrink-0">+{opportunity.estimatedImpactPercent}%</span>
        )}
      </div>

      {showCoach && (
        <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-[#EB4501]/40 pl-3">
          {opportunity.coachingMessage}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[10px] font-bold text-[#EB4501] uppercase">{opportunity.suggestedAction}</span>
        {opportunity.futureAiCapability && (
          <EmiOpportunityInsight opportunity={opportunity} />
        )}
      </div>

      {opportunity.status === 'open' && (onDismiss || onResolve || onPin) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e8edf2]">
          {onResolve && (
            <button type="button" onClick={(e) => { e.preventDefault(); onResolve(opportunity.opportunityId); }} className="text-[9px] font-bold uppercase px-2 py-1 bg-[#EB4501] text-white rounded">
              Resolve
            </button>
          )}
          {onPin && (
            <button type="button" onClick={(e) => { e.preventDefault(); onPin(opportunity.opportunityId); }} className="text-[9px] font-bold uppercase px-2 py-1 border border-[#e8edf2] rounded text-gray-500 hover:text-navy">
              Pin
            </button>
          )}
          {onDismiss && (
            <button type="button" onClick={(e) => { e.preventDefault(); onDismiss(opportunity.opportunityId); }} className="text-[9px] font-bold uppercase px-2 py-1 text-gray-400 hover:text-rose-500">
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (opportunity.href && opportunity.status === 'open') {
    return <Link to={opportunity.href} className="block">{inner}</Link>;
  }
  return inner;
}
