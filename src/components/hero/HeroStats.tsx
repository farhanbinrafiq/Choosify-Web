import React from 'react';
import { cn } from '../../lib/utils';
import type { HeroStatItem } from './types';

interface HeroStatsProps {
  stats: HeroStatItem[];
  className?: string;
  light?: boolean;
}

export function HeroStats({ stats, className, light = true }: HeroStatsProps) {
  if (!stats.length) return null;

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4', className)}>
      {stats.map(({ id, label, value, icon: Icon }) => (
        <div
          key={id}
          className={cn(
            'group rounded-2xl p-4 md:p-5 transition-all duration-200',
            light
              ? 'bg-white/8 backdrop-blur-md border border-white/12 hover:bg-white/12 hover:border-white/20'
              : 'bg-white border border-[#eef2f6] shadow-sm hover:shadow-md',
          )}
        >
          {Icon && (
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform',
                light ? 'bg-[#E8500A]/20 text-[#FF8A50]' : 'bg-[#FFF0E8] text-[#E8500A]',
              )}
            >
              <Icon size={18} aria-hidden />
            </div>
          )}
          <p className={cn('text-xl md:text-2xl font-bold tracking-tight', light ? 'text-white' : 'text-[#1A1D4E]')}>
            {value}
          </p>
          <p className={cn('text-[11px] font-medium mt-0.5', light ? 'text-white/60' : 'text-[#8a9bb0]')}>{label}</p>
        </div>
      ))}
    </div>
  );
}
