import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { EmiRecommendation } from '../../types/emi';
import { EmiConfidenceBadge } from './EmiConfidenceBadge';
import { cn } from '../../lib/utils';

interface EmiContextPanelProps {
  title?: string;
  subtitle?: string;
  recommendations: EmiRecommendation[];
  className?: string;
  defaultExpanded?: boolean;
  compact?: boolean;
}

export function EmiContextPanel({
  title = 'Emi',
  subtitle = 'Contextual shopping intelligence',
  recommendations,
  className,
  defaultExpanded = true,
  compact,
}: EmiContextPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  if (!recommendations.length) return null;

  const primary = recommendations[0];

  return (
    <aside
      className={cn(
        'bg-white border border-[#e8edf2] rounded-[5px] overflow-hidden text-left',
        className,
      )}
      aria-label="Emi contextual assistant"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 border-b border-[#e8edf2] bg-[#fafbfc] hover:bg-[#FFF0E8]/30 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles size={16} className="text-[#E8500A] shrink-0" aria-hidden />
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#E8500A]">{title}</p>
            {!compact && <p className="text-[10px] text-gray-400 truncate">{subtitle}</p>}
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
      </button>

      {expanded && (
        <div className={cn('space-y-3', compact ? 'p-3' : 'p-4')}>
          <EmiInsightCard recommendation={primary} />
          {recommendations.slice(1, compact ? 2 : 4).map((rec) => (
            <EmiInsightCard key={rec.id} recommendation={rec} compact />
          ))}
        </div>
      )}
    </aside>
  );
}

interface EmiInsightCardProps {
  recommendation: EmiRecommendation;
  compact?: boolean;
}

export function EmiInsightCard({ recommendation, compact }: EmiInsightCardProps) {
  return (
    <div className={cn('space-y-1.5', compact && 'opacity-90')}>
      <div className="flex flex-wrap items-center gap-2">
        <h4 className={cn('font-bold text-[#1a1a2e]', compact ? 'text-[11px]' : 'text-xs')}>{recommendation.title}</h4>
        <EmiConfidenceBadge level={recommendation.confidence} score={recommendation.confidenceScore} />
      </div>
      <p className={cn('text-gray-600 leading-relaxed', compact ? 'text-[10px]' : 'text-xs')}>{recommendation.body}</p>
      {recommendation.why && !compact && (
        <p className="text-[10px] text-gray-400">
          <span className="font-semibold text-gray-500">Why: </span>
          {recommendation.why}
        </p>
      )}
      {recommendation.estimatedImpact && (
        <p className="text-[10px] font-bold text-emerald-600">{recommendation.estimatedImpact}</p>
      )}
    </div>
  );
}
