import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SpotlightMiniChart, type MiniChartKind } from './SpotlightMiniChart';
import type { IntelligenceTimeSeriesPoint } from '../../../types/spotlight/intelligence';
import { cn } from '../../../lib/utils';

interface SpotlightChartCardProps {
  title: string;
  description?: string;
  data: IntelligenceTimeSeriesPoint[] | number[];
  chartKind?: MiniChartKind;
  href?: string;
  onDrillDown?: () => void;
  className?: string;
}

export function SpotlightChartCard({
  title,
  description,
  data,
  chartKind = 'area',
  href,
  onDrillDown,
  className,
}: SpotlightChartCardProps) {
  const values = Array.isArray(data) && typeof data[0] === 'number'
    ? (data as number[])
    : (data as IntelligenceTimeSeriesPoint[]).map((d) => d.value);

  const body = (
    <div
      className={cn(
        'bg-white border border-[#e8edf2] rounded-xl p-4 group hover:shadow-md transition-shadow',
        (href || onDrillDown) && 'cursor-pointer',
        className,
      )}
      onClick={onDrillDown}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-black text-navy uppercase">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        {(href || onDrillDown) && <ChevronRight size={16} className="text-gray-300 group-hover:text-[#E8500A]" />}
      </div>
      <SpotlightMiniChart kind={chartKind} data={values} height={80} className="w-full" />
    </div>
  );

  if (href) return <Link to={href}>{body}</Link>;
  return body;
}
