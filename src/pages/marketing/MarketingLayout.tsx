import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MarketingSidebar } from '../../components/marketing/MarketingSidebar';

const MODULE_LABELS: Record<string, string> = {
  content: 'Spotlight Content',
  sponsored: 'Sponsored Campaigns',
  collections: 'Collections',
  'live-events': 'Live Events',
  'buying-guides': 'Buying Guides',
  'creator-content': 'Creator Content',
  'brand-campaigns': 'Brand Campaigns',
  media: 'Media Library',
  calendar: 'Content Calendar',
  preview: 'Preview',
  templates: 'Templates',
  studio: 'Publisher Studio',
  intelligence: 'Spotlight Intelligence',
  opportunity: 'Opportunity Center',
};

function resolveModuleLabel(pathname: string): string | null {
  const segment = pathname.replace(/^\/marketing\/?/, '').split('/')[0];
  if (!segment) return 'Marketing';
  return MODULE_LABELS[segment] ?? null;
}

export function MarketingLayout() {
  const location = useLocation();
  const moduleLabel = resolveModuleLabel(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <header className="bg-white border-b border-[#e8edf2] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="text-gray-400 hover:text-[#E8500A]">Dashboard</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link to="/marketing/content" className="font-bold text-navy hover:text-[#E8500A]">Marketing</Link>
            {moduleLabel && moduleLabel !== 'Marketing' && (
              <>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="font-semibold text-[#E8500A]">{moduleLabel}</span>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="flex max-w-7xl mx-auto">
        <MarketingSidebar />
        <Outlet />
      </div>
    </div>
  );
}
