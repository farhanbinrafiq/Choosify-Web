import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import type { IntelligenceNavItem } from '../../../lib/spotlight/intelligence/layoutRegistry';

interface SpotlightIntelligenceNavProps {
  items: IntelligenceNavItem[];
  className?: string;
}

export function SpotlightIntelligenceNav({ items, className }: SpotlightIntelligenceNavProps) {
  return (
    <nav className={cn('flex flex-wrap gap-1 bg-white border border-[#e8edf2] rounded-lg p-1', className)} aria-label="Spotlight Intelligence sections">
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.id === 'mission_control'}
          className={({ isActive }) =>
            cn(
              'px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-colors',
              isActive ? 'bg-[#E8500A] text-white' : 'text-gray-500 hover:text-navy hover:bg-[#F8FBFD]',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
