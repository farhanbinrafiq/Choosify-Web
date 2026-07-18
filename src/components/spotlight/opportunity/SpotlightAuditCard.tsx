import React from 'react';
import type { SpotlightOpportunityInstance } from '../../../types/spotlight/opportunity';

interface SpotlightAuditCardProps {
  title: string;
  description: string;
  opportunities: SpotlightOpportunityInstance[];
  icon?: string;
}

export function SpotlightAuditCard({ title, description, opportunities, icon = '📋' }: SpotlightAuditCardProps) {
  const open = opportunities.filter((o) => o.status === 'open');
  return (
    <div className="bg-white border border-[#e8edf2] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden>{icon}</span>
        <h3 className="text-sm font-black text-navy uppercase">{title}</h3>
        <span className="ml-auto text-xs font-bold text-[#E8500A]">{open.length} gaps</span>
      </div>
      <p className="text-[10px] text-gray-400 mb-3">{description}</p>
      <ul className="space-y-1.5">
        {open.slice(0, 6).map((o) => (
          <li key={o.opportunityId} className="text-xs text-gray-600 flex justify-between gap-2">
            <span className="line-clamp-1">{o.title}</span>
            {o.estimatedImpactPercent > 0 && <span className="text-emerald-600 font-bold shrink-0">+{o.estimatedImpactPercent}%</span>}
          </li>
        ))}
        {open.length === 0 && <li className="text-xs text-emerald-600 font-bold">All checks passed</li>}
        {open.length > 6 && <li className="text-[10px] text-gray-400">+{open.length - 6} more</li>}
      </ul>
    </div>
  );
}
