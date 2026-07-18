import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { SPOTLIGHT_CONTENT_TABS } from '../../../types/spotlight/discovery/navigation';
import { cn } from '../../../lib/utils';

/** Reusable content-type tab bar for Spotlight discover */
export function SpotlightContentTabs() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const activeTab = params.get('tab') ?? 'featured';

  if (pathname !== '/spotlight') return null;

  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide"
      aria-label="Spotlight content types"
    >
      {SPOTLIGHT_CONTENT_TABS.map((item) => {
        const tabId = item.href.includes('tab=') ? item.href.split('tab=')[1] : 'featured';
        const active = tabId === activeTab || (tabId === 'featured' && !params.get('tab'));
        return (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              'shrink-0 px-3 py-2 min-h-[40px] inline-flex items-center rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors',
              active
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-500 border-[#e8edf2] hover:border-[#E8500A]/40',
            )}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
