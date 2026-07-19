import React from 'react';
import type { EmiConfidenceLevel } from '../../types/emi';
import { confidenceLabel } from '../../lib/emi/confidenceRegistry';
import { cn } from '../../lib/utils';

const COLORS: Record<EmiConfidenceLevel, string> = {
  high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'choosify-emi-gradient text-white border-transparent',
  low: 'choosify-emi-gradient text-white border-transparent',
  placeholder: 'bg-[#FFF0E8] text-[#E8500A]/80 border-[#E8500A]/20',
};

interface EmiConfidenceBadgeProps {
  level: EmiConfidenceLevel;
  score?: number;
  className?: string;
}

export function EmiConfidenceBadge({ level, score, className }: EmiConfidenceBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border', COLORS[level], className)}>
      {confidenceLabel(level)}
      {score != null && <span className="opacity-70">· {Math.round(score)}%</span>}
    </span>
  );
}
