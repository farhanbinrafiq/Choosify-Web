import React from 'react';
import { RecentlyViewedCard } from '../../../components/RecentlyViewedCard';

interface RecentlyViewedSectionProps {
  recentlyViewed: any[];
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({ recentlyViewed }) => {
  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  return (
    <section className="pt-12 border-t border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Recently Viewed</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Continue where you left off</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {recentlyViewed.map((item: any) => (
          <RecentlyViewedCard key={item.id} product={item} className="snap-start" />
        ))}
      </div>
    </section>
  );
};
