import React from 'react';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import type { SpotlightMerchantGuidance } from '../../../types/spotlight/merchandising/quality';
import { cn } from '../../../lib/utils';

interface MerchantGuidancePanelProps {
  guidance: SpotlightMerchantGuidance[];
  qualityScore?: number;
}

export function MerchantGuidancePanel({ guidance, qualityScore }: MerchantGuidancePanelProps) {
  if (!guidance.length && qualityScore == null) return null;

  return (
    <div className="border border-[#e8edf2] rounded-lg p-4 bg-amber-50/30 space-y-3">
      {qualityScore != null && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Campaign Quality</p>
          <span className={cn(
            'text-lg font-black',
            qualityScore >= 80 ? 'text-green-600' : qualityScore >= 50 ? 'text-amber-600' : 'text-red-600',
          )}>
            {qualityScore}%
          </span>
        </div>
      )}
      <ul className="space-y-2">
        {guidance.map((g) => (
          <li key={g.id} className="flex items-start gap-2 text-sm">
            {g.severity === 'warning' ? (
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            ) : g.severity === 'suggestion' ? (
              <Lightbulb size={14} className="text-[#E8500A] mt-0.5 shrink-0" />
            ) : (
              <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
            )}
            <span className="text-gray-700">{g.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
