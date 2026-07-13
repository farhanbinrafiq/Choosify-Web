import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Grid, ShoppingBag, ShieldCheck, Sparkles, 
  SlidersHorizontal, Flame, Heart, Users 
} from 'lucide-react';
import { cn } from '../lib/utils';

export function QuickAccessCard() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/categories', label: 'Categories', icon: Grid },
    { to: '/products', label: 'Products', icon: ShoppingBag },
    { to: '/brands', label: 'Brands', icon: ShieldCheck },
    { to: '/guides', label: 'Discover', icon: Sparkles },
    { to: '/compare', label: 'Compare', icon: SlidersHorizontal },
    { to: '/deals', label: 'Deals', icon: Flame },
    { to: '/creators', label: 'Creators', icon: Users },
  ];

  return (
    <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm w-full mb-4">
      <div className="flex items-center gap-1 pb-3 mb-4 border-b border-[#e8edf2] px-1">
        <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider text-left">
          QUICK ACCESS
        </h3>
      </div>
      <div className="space-y-1.5 text-left">
        {links.map((link) => {
          const Icon = link.icon;
          // Check if link is active. If home, exact check. Else, startsWith is fine.
          const isActive = link.to === '/' 
            ? currentPath === '/' 
            : currentPath === link.to || currentPath.startsWith(link.to + '/');

          return (
            <Link
              key={link.to}
              to={link.to}
              id={`quick-access-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-[5px] transition-all duration-300 group",
                isActive 
                  ? "bg-[#FFF0E8] text-[#E8500A] font-black" 
                  : "bg-transparent text-[#1A1A2E] hover:bg-orange-primary/5 hover:text-[#E8500A] font-semibold"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  size={16} 
                  className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A]"
                  )} 
                />
                <span className="font-sans text-xs uppercase tracking-wide">
                  {link.label}
                </span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8500A]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
