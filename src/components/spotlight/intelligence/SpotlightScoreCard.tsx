import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { ScoreKind } from '../../../types/spotlight/intelligence';
import { getScoreDefinition } from '../../../lib/spotlight/intelligence/scoreRegistry';
import { cn } from '../../../lib/utils';

interface SpotlightScoreCardProps {
  kind: ScoreKind;
  value: number;
  href?: string;
  onDrillDown?: () => void;
  className?: string;
}

export function SpotlightScoreCard({ kind, value, href, onDrillDown, className }: SpotlightScoreCardProps) {
  const def = getScoreDefinition(kind);
  const pct = Math.min(100, Math.max(0, (value / def.maxValue) * 100));

  const body = (
    <div
      className={cn(
        'bg-white border border-[#e8edf2] rounded-xl p-4 group hover:shadow-md transition-shadow',
        (href || onDrillDown) && 'cursor-pointer',
        className,
      )}
      onClick={onDrillDown}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{def.title}</p>
          <p className="text-xl font-black text-navy">{Math.round(value)}</p>
        </div>
        {(href || onDrillDown) && <ChevronRight size={16} className="text-gray-300 group-hover:text-[#E8500A]" />}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={def.maxValue}>
        <div className="h-full bg-[#E8500A] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-2 line-clamp-2">{def.description}</p>
    </div>
  );

  if (href) return <Link to={href}>{body}</Link>;
  return body;
}
