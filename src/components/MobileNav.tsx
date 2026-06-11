import React, { useState } from 'react';
import { Home, ShoppingBag, Store, Sparkles, Tag, User, Grid, Flame } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { SignInModal } from './SignInModal';

export function MobileNav() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const location = useLocation();

  // Do not render on /overview route
  if (location.pathname === '/overview') return null;

  // Dynamic active tab detection including React Router state params
  const isActive = (path: string, state: any) => {
    if (location.pathname !== path) return false;
    
    // Specialized tab tracking inside dashboard structure
    if (path === '/dashboard') {
      const currentTab = location.state?.activeTab || 'overview';
      const targetTab = state?.activeTab || 'overview';
      return currentTab === targetTab;
    }
    
    return true;
  };

  // 1. Retail Bottom Navigation Tabs (8-tabs layout)
  const retailItems = [
    { icon: Home, label: 'Home', path: '/', state: null },
    { icon: Grid, label: 'Categories', path: '/categories', state: null },
    { icon: ShoppingBag, label: 'Products', path: '/products', state: null },
    { icon: Store, label: 'Brands', path: '/brands', state: null },
    { icon: Sparkles, label: 'Recommendations', path: '/guides', state: null },
    { icon: Tag, label: 'Deals', path: '/deals', state: null },
    { icon: Flame, label: 'Viral', path: '/viral-products', state: null },
    { icon: User, label: 'Profile', path: '/dashboard', state: { activeTab: 'overview' } },
  ];

  return (
    <>
      <div 
        className="lg:hidden fixed bottom-6 left-2 right-2 sm:left-6 sm:right-6 z-[100] backdrop-blur-xl border rounded-[28px] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-[#0A0A1F]/90 border-white/10 text-white overflow-hidden"
        id="mobile-bottom-navigation-dock"
      >
        <div className="flex items-center justify-around w-full gap-0.5">
          {retailItems.map((item, index) => {
            const Active = isActive(item.path, item.state);
            return (
              <Link 
                key={`${item.path}-${item.state?.activeTab || 'root'}-${index}`} 
                to={item.path}
                state={item.state}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 px-1 text-center sm:px-3 rounded-[20px] transition-all duration-300 shrink-0 relative",
                  Active 
                    ? "bg-orange-primary/10 text-orange-primary" 
                    : "text-white/40 hover:text-white"
                )}
              >
                <item.icon size={14} className={cn("transition-transform duration-300", Active && "scale-110", Active && "animate-pulse")} />
                
                {/* Visual Accent Pulse Glow on Hover/Active */}
                {Active && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-orange-primary rounded-full" />
                )}
                
                {/* Standard Choosify font pairings and capital style matching */}
                <span className={cn(
                  "text-[6.5px] font-black uppercase tracking-wider italic font-sans transition-all duration-300 line-clamp-1 select-none",
                  Active ? "opacity-100 max-h-4 mt-0.5" : "opacity-0 max-h-0 pointer-events-none"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}
