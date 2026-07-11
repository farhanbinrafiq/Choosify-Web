import React from 'react';
import type { EmiCoachOption } from '../../types/emi';
import { EmiConfidenceBadge } from './EmiConfidenceBadge';
import { cn } from '../../lib/utils';

interface EmiShoppingCoachProps {
  options: EmiCoachOption[];
  className?: string;
}

export function EmiShoppingCoach({ options, className }: EmiShoppingCoachProps) {
  if (!options.length) return null;

  return (
    <div className={cn('bg-[#fafbfc] border border-[#e8edf2] rounded-[5px] p-4 space-y-3', className)}>
      <p className="text-[10px] font-black uppercase tracking-widest text-[#E8500A]">Emi Shopping Coach</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <div key={opt.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-navy">{opt.label}</span>
              <EmiConfidenceBadge level={opt.confidence} />
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed">{opt.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
