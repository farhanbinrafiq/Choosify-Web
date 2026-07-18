import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Megaphone,
  Target,
  FolderOpen,
  Radio,
  BookOpen,
  Users,
  Building2,
  Image,
  Calendar,
  Eye,
  LayoutTemplate,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MODULES = [
  { to: '/marketing/content', label: 'Spotlight Content', icon: Megaphone, match: '/marketing/content' },
  { to: '/marketing/sponsored', label: 'Sponsored Campaigns', icon: Target, match: '/marketing/sponsored' },
  { to: '/marketing/collections', label: 'Collections', icon: FolderOpen, match: '/marketing/collections' },
  { to: '/marketing/live-events', label: 'Live Events', icon: Radio, match: '/marketing/live-events' },
  { to: '/marketing/buying-guides', label: 'Buying Guides', icon: BookOpen, match: '/marketing/buying-guides' },
  { to: '/marketing/creator-content', label: 'Creator Content', icon: Users, match: '/marketing/creator-content' },
  { to: '/marketing/brand-campaigns', label: 'Brand Campaigns', icon: Building2, match: '/marketing/brand-campaigns' },
  { to: '/marketing/media', label: 'Media Library', icon: Image, match: '/marketing/media' },
  { to: '/marketing/calendar', label: 'Content Calendar', icon: Calendar, match: '/marketing/calendar' },
  { to: '/marketing/preview', label: 'Preview', icon: Eye, match: '/marketing/preview' },
  { to: '/marketing/templates', label: 'Templates', icon: LayoutTemplate, match: '/marketing/templates' },
] as const;

const LEGACY = [
  { to: '/marketing/studio', label: 'Publisher Studio', icon: Megaphone, match: '/marketing/studio' },
  { to: '/marketing/intelligence', label: 'Spotlight Intelligence', icon: BarChart3, match: '/marketing/intelligence' },
  { to: '/marketing/opportunity', label: 'Opportunity Center', icon: Lightbulb, match: '/marketing/opportunity' },
] as const;

function isActive(pathname: string, match: string) {
  if (match === '/marketing/content') {
    return pathname.startsWith('/marketing/content');
  }
  return pathname.startsWith(match);
}

export function MarketingSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-56 shrink-0 border-r border-[#e8edf2] bg-white min-h-[calc(100vh-73px)] p-4 hidden md:block">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Marketing</p>
      <nav className="space-y-0.5" aria-label="Marketing CMS modules">
        {MODULES.map(({ to, label, icon: Icon, match }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors',
              isActive(pathname, match)
                ? 'bg-[#E8500A]/10 text-[#E8500A]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-navy',
            )}
          >
            <Icon size={14} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-6 mb-3 px-2">Legacy</p>
      <nav className="space-y-0.5">
        {LEGACY.map(({ to, label, icon: Icon, match }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors',
              isActive(pathname, match)
                ? 'bg-gray-100 text-navy'
                : 'text-gray-500 hover:bg-gray-50',
            )}
          >
            <Icon size={14} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
