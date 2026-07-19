import React from 'react';
import { Link } from 'react-router-dom';
import type { SpotlightHubNavItem } from '../../../types/spotlight/discovery/navigation';
import { cn } from '../../../lib/utils';

interface SpotlightHubNavProps {
  items: SpotlightHubNavItem[];
  sticky?: boolean;
}

export function SpotlightHubNav({ items, sticky = true }: SpotlightHubNavProps) {
  if (!items.length) return null;

  return (
    <nav
      className={cn(
        'flex gap-2 overflow-x-auto py-2 mb-4 border-b border-gray-100',
        sticky && 'sticky top-[calc(var(--navbar-height,64px)+48px)] z-20 bg-white/95 backdrop-blur',
      )}
      aria-label="Campaign hub navigation"
    >
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          className={cn(
            'shrink-0 px-3 py-2 min-h-[44px] inline-flex items-center text-[10px] font-bold uppercase tracking-wide rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]',
            item.isActive
              ? 'bg-[#EB4501] text-white border-[#EB4501]'
              : 'text-gray-500 border-transparent hover:border-[#e8edf2]',
          )}
          aria-current={item.isActive ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
