import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';

export interface NavItem {
  id: string;
  label: string;
  count?: number;
}

export interface StickyNavigationProps {
  items: NavItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  productInfo?: {
    image: string;
    title: string;
    price: string;
  };
  ctaText?: string;
  onCtaClick?: () => void;
}

export const StickyNavigation: React.FC<StickyNavigationProps> = ({
  items,
  activeId,
  onItemClick,
  productInfo,
  ctaText = 'Buy Now',
  onCtaClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300); // Typical trigger point
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-white border-b border-slate-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Tabs */}
          <div className="flex h-full overflow-x-auto hide-scrollbar gap-6">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  'h-full flex items-center text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap px-1',
                  activeId === item.id
                    ? 'border-[#000435] text-[#000435]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                )}
              >
                {item.label}
                {item.count !== undefined && (
                  <span className="ml-1.5 text-[10px] text-slate-400">({item.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Product Mini Preview + CTA (Only visible when scrolled if desired, or always based on design) */}
          {productInfo && (
            <div className={cn(
              "hidden lg:flex items-center gap-4 transition-opacity duration-300",
              isScrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
              <div className="flex items-center gap-3">
                <img src={productInfo.image} alt={productInfo.title} className="w-10 h-10 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100" />
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-[#000435] leading-none">{productInfo.title}</span>
                  <span className="text-xs font-bold text-slate-500 mt-1">{productInfo.price}</span>
                </div>
              </div>
              <Button variant="cta" size="sm" onClick={onCtaClick} className="ml-2 shadow-md">
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
