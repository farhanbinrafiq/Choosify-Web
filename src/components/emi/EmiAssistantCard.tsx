import React from 'react';
import type { EmiRecommendation } from '../../types/emi';
import { EmiInsightCard } from './EmiContextPanel';
import { EmiAiLogo } from '../EmiAiLogo';
import { cn } from '../../lib/utils';

interface EmiAssistantCardProps {
  title: string;
  description?: string;
  recommendations: EmiRecommendation[];
  className?: string;
}

export function EmiAssistantCard({ title, description, recommendations, className }: EmiAssistantCardProps) {
  if (!recommendations.length) return null;
  return (
    <div className={cn('bg-white border border-[#e8edf2] rounded-[10px] p-4 space-y-3', className)}>
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-[#F4F7F9] border border-[#E8EDF2] flex items-center justify-center overflow-hidden p-0.5 shrink-0">
          <EmiAiLogo size={22} className="w-[22px] h-[22px]" />
        </span>
        <h3 className="text-xs font-black uppercase tracking-widest text-navy">{title}</h3>
      </div>
      {description && <p className="text-[11px] text-gray-500">{description}</p>}
      {recommendations.slice(0, 2).map((r) => (
        <EmiInsightCard key={r.id} recommendation={r} compact />
      ))}
    </div>
  );
}

interface EmiSummaryCardProps {
  headline: string;
  summary: string;
  className?: string;
}

export function EmiSummaryCard({ headline, summary, className }: EmiSummaryCardProps) {
  return (
    <div className={cn('border-l-2 border-[#EB4501] pl-3 space-y-1', className)}>
      <p className="text-[10px] font-black uppercase text-[#EB4501] flex items-center gap-1.5">
        <EmiAiLogo size={14} className="w-3.5 h-3.5" /> Emi Summary
      </p>
      <h4 className="text-sm font-bold text-navy">{headline}</h4>
      <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
    </div>
  );
}

interface EmiRecommendationPanelProps {
  title: string;
  recommendations: EmiRecommendation[];
  className?: string;
}

export function EmiRecommendationPanel({ title, recommendations, className }: EmiRecommendationPanelProps) {
  return (
    <section className={cn('space-y-3', className)} aria-label={title}>
      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</h3>
      {recommendations.map((r) => (
        <EmiInsightCard key={r.id} recommendation={r} />
      ))}
    </section>
  );
}
