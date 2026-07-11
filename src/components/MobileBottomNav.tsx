import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Flame, Search, User } from 'lucide-react';
import { cn } from '../lib/utils';

const ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/categories', label: 'Categories', icon: LayoutGrid },
  { path: '/spotlight', label: 'Spotlight', icon: Flame },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/dashboard', label: 'Profile', icon: User },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-[#e8edf2] bg-white/95 backdrop-blur safe-area-bottom"
      aria-label="Mobile bottom navigation"
    >
      <ul className="flex items-stretch justify-around max-w-lg mx-auto">
        {ITEMS.map(({ path, label, icon: Icon }) => (
          <li key={path} className="flex-1">
            <Link
              to={path}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[9px] font-bold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E8500A]',
                isActive(path) ? 'text-[#E8500A]' : 'text-gray-400',
              )}
              aria-current={isActive(path) ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
