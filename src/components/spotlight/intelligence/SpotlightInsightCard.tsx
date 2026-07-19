import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, AlertTriangle } from 'lucide-react';
import type { IntelligenceInsightDefinition } from '../../../types/spotlight/intelligence';
import { cn } from '../../../lib/utils';

interface SpotlightInsightCardProps extends IntelligenceInsightDefinition {
  value: string;
  metricHint?: number;
  href?: string;
  variant?: 'default' | 'alert' | 'ai';
}

export function SpotlightInsightCard({
  title,
  description,
  value,
  metricHint,
  href,
  variant = 'default',
  drillDownSection,
}: SpotlightInsightCardProps) {
  const Icon = variant === 'alert' ? AlertTriangle : variant === 'ai' ? Sparkles : ChevronRight;
  const to = href ?? `/marketing/intelligence/${drillDownSection}`;

  return (
    <Link
      to={to}
      className={cn(
        'block bg-white border border-[#e8edf2] rounded-xl p-4 hover:shadow-md transition-shadow group',
        variant === 'alert' && 'border-amber-200 bg-amber-50/30',
        variant === 'ai' && 'border-dashed border-gray-300',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="text-sm font-black text-navy mt-1">{value}</p>
          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{description}</p>
        </div>
        <Icon size={16} className={cn('shrink-0 mt-1', variant === 'alert' ? 'text-amber-500' : 'text-gray-300 group-hover:text-[#CF4400]')} />
      </div>
      {metricHint !== undefined && (
        <p className="text-[10px] text-gray-400 mt-2">Score hint: {metricHint}</p>
      )}
    </Link>
  );
}
