import React from 'react';
import { Home, Search, Heart, User, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export function MobileNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/categories' },
    { icon: Layers, label: 'Compare', path: '/compare' },
    { icon: Heart, label: 'Vault', path: '/deals' },
    { icon: User, label: 'Profile', path: '/dashboard' },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100] bg-navy/90 backdrop-blur-xl border border-white/10 rounded-[28px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Active = isActive(item.path);
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all",
                Active ? "bg-orange-primary/10 text-orange-primary" : "text-white/40 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(Active && "animate-pulse")} />
              <span className={cn("text-[8px] font-black uppercase tracking-widest italic", Active ? "opacity-100" : "opacity-0")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
