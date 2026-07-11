import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SPOTLIGHT_DISCOVERY_NAV } from '../../../types/spotlight/discovery/navigation';
import { cn } from '../../../lib/utils';

export function SpotlightDiscoveryNav() {
  const { pathname, search } = useLocation();
  const current = `${pathname}${search}`;

  return (
    <nav
      className="sticky top-[var(--navbar-height,64px)] z-30 -mx-4 px-4 py-2 mb-6 bg-white/95 backdrop-blur border-b border-[#e8edf2]"
      aria-label="Spotlight discovery navigation"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {SPOTLIGHT_DISCOVERY_NAV.map((item) => {
          const active = item.href === current || (item.href === '/spotlight' && pathname === '/spotlight' && !search.includes('tab='));
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'shrink-0 px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8500A]',
                active
                  ? 'bg-[#E8500A] text-white border-[#E8500A]'
                  : 'bg-white text-gray-500 border-[#e8edf2] hover:border-[#E8500A]/40',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
