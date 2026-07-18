import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Minus, ChevronRight } from 'lucide-react';
import type { IntelligenceBenchmark } from '../../../types/spotlight/intelligence';
import { cn } from '../../../lib/utils';

interface SpotlightMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  benchmark?: IntelligenceBenchmark;
  trendData?: number[];
  href?: string;
  onDrillDown?: () => void;
  className?: string;
}

export function SpotlightMetricCard({
  title,
  value,
  subtitle,
  benchmark,
  trendData,
  href,
  onDrillDown,
  className,
}: SpotlightMetricCardProps) {
  const TrendIcon = benchmark?.trend === 'up' ? ArrowUpRight : benchmark?.trend === 'down' ? ArrowDownRight : Minus;
  const trendColor =
    benchmark?.trend === 'up' ? 'text-emerald-600' : benchmark?.trend === 'down' ? 'text-rose-600' : 'text-gray-400';

  const body = (
    <div
      className={cn(
        'bg-white border border-[#e8edf2] rounded-xl p-4 flex flex-col gap-3 h-full transition-shadow hover:shadow-md',
        (href || onDrillDown) && 'cursor-pointer group',
        className,
      )}
      onClick={onDrillDown}
      role={href || onDrillDown ? 'button' : undefined}
      tabIndex={href || onDrillDown ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onDrillDown) {
          e.preventDefault();
          onDrillDown();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="text-2xl font-black text-navy tabular-nums">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {(href || onDrillDown) && (
          <ChevronRight size={16} className="text-gray-300 group-hover:text-[#E8500A] shrink-0 mt-1" />
        )}
      </div>

      {benchmark && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-gray-500 border-t border-[#e8edf2] pt-3">
          <span>Last period: <strong className="text-gray-700">{benchmark.previousPeriod.toLocaleString()}</strong></span>
          <span>Platform avg: <strong className="text-gray-700">{benchmark.platformAverage.toLocaleString()}</strong></span>
          <span>Top performer: <strong className="text-gray-700">{benchmark.topPerformer.toLocaleString()}</strong></span>
          <span className={cn('inline-flex items-center gap-0.5 font-bold', trendColor)}>
            <TrendIcon size={12} />
            {benchmark.changePercent > 0 ? '+' : ''}{benchmark.changePercent}%
          </span>
        </div>
      )}

      {trendData && trendData.length > 0 && (
        <div className="h-8 opacity-60" aria-hidden>
          <svg viewBox="0 0 120 32" className="w-full h-full">
            <polyline
              fill="none"
              stroke="#E8500A"
              strokeWidth="1.5"
              points={trendData
                .map((v, i) => {
                  const max = Math.max(...trendData, 1);
                  const x = (i / Math.max(trendData.length - 1, 1)) * 118 + 1;
                  const y = 30 - (v / max) * 26;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          </svg>
        </div>
      )}

      {(href || onDrillDown) && (
        <span className="text-[10px] font-bold uppercase text-[#E8500A] opacity-0 group-hover:opacity-100 transition-opacity">
          View Details
        </span>
      )}
    </div>
  );

  if (href) return <Link to={href} className="block h-full">{body}</Link>;
  return body;
}
