import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { SpotlightMiniChart } from './SpotlightMiniChart';
import { cn } from '../../../lib/utils';

interface SpotlightTrendCardProps {
  title: string;
  value: string;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
  sparkline: number[];
  href?: string;
  className?: string;
}

export function SpotlightTrendCard({
  title,
  value,
  changePercent,
  trend,
  sparkline,
  href,
  className,
}: SpotlightTrendCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-gray-400';

  const body = (
    <div className={cn('bg-white border border-[#e8edf2] rounded-xl p-4 hover:shadow-md transition-shadow', className)}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
      <div className="flex items-end justify-between gap-3 mt-1">
        <div>
          <p className="text-xl font-black text-navy">{value}</p>
          <p className={cn('text-xs font-bold inline-flex items-center gap-0.5 mt-1', trendColor)}>
            <TrendIcon size={12} />
            {changePercent > 0 ? '+' : ''}{changePercent}%
          </p>
        </div>
        <SpotlightMiniChart kind="line" data={sparkline} height={40} className="w-24" />
      </div>
    </div>
  );

  if (href) return <Link to={href}>{body}</Link>;
  return body;
}
