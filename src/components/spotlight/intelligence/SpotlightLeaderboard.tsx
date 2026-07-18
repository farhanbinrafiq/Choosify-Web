import React from 'react';
import { Link } from 'react-router-dom';
import type { IntelligenceLeaderboardRow } from '../../../types/spotlight/intelligence';
import { cn } from '../../../lib/utils';

interface SpotlightLeaderboardProps {
  title: string;
  rows: IntelligenceLeaderboardRow[];
  onRowClick?: (row: IntelligenceLeaderboardRow) => void;
  className?: string;
}

export function SpotlightLeaderboard({ title, rows, onRowClick, className }: SpotlightLeaderboardProps) {
  return (
    <div className={cn('bg-white border border-[#e8edf2] rounded-xl overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-[#e8edf2]">
        <h3 className="text-sm font-black text-navy uppercase">{title}</h3>
      </div>
      <div className="divide-y divide-[#e8edf2]">
        {rows.map((row) => {
          const content = (
            <>
              <span className="w-6 text-xs font-black text-gray-300 tabular-nums">{row.rank}</span>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{row.label}</p>
                {row.subtitle && <p className="text-[10px] text-gray-400 truncate">{row.subtitle}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-navy tabular-nums">{row.valueLabel}</p>
                {row.changePercent !== undefined && (
                  <p className={cn('text-[10px] font-bold', row.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                    {row.changePercent >= 0 ? '+' : ''}{row.changePercent}%
                  </p>
                )}
              </div>
            </>
          );

          const rowClass = 'flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8FBFD] transition-colors';

          if (row.href) {
            return (
              <Link key={row.id} to={row.href} className={rowClass}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={row.id}
              type="button"
              className={cn(rowClass, 'w-full text-left')}
              onClick={() => onRowClick?.(row)}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
