import React from 'react';
import type { PublishingReadiness } from '../../../types/spotlight/opportunity';
import { Check, X } from 'lucide-react';

interface SpotlightReadinessCardProps {
  title?: string;
  gates: PublishingReadiness[];
}

export function SpotlightReadinessCard({ title = 'Publishing Readiness', gates }: SpotlightReadinessCardProps) {
  return (
    <div className="bg-white border border-[#e8edf2] rounded-xl p-4">
      <h3 className="text-sm font-black text-navy uppercase mb-4">{title}</h3>
      <ul className="space-y-2">
        {gates.map((g) => (
          <li key={g.gate} className="flex items-start gap-2">
            {g.met ? (
              <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" aria-label="Met" />
            ) : (
              <X size={14} className="text-rose-400 shrink-0 mt-0.5" aria-label="Not met" />
            )}
            <div>
              <span className={`text-xs font-bold ${g.met ? 'text-gray-500' : 'text-navy'}`}>{g.label}</span>
              {!g.met && g.blockers.length > 0 && (
                <p className="text-[10px] text-gray-400">{g.blockers.join(', ')}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
