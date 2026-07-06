import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { BrandPostCard } from './BrandPostCard';
import type { BrandPost } from '../types/brandPost';
import { cn } from '../lib/utils';

type BrandPostCarouselSectionProps = {
  posts: BrandPost[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  id?: string;
  badgeLabel?: string;
  showSponsoredBadge?: boolean;
};

export function BrandPostCarouselSection({
  posts,
  title = 'Events',
  subtitle = 'Upcoming launches, festivals, and brand events from verified shops.',
  viewAllHref = '/whats-on',
  viewAllLabel = 'View All Events',
  className,
  id,
  badgeLabel = 'Discovery',
  showSponsoredBadge = true,
}: BrandPostCarouselSectionProps) {
  if (!posts.length) return null;

  return (
    <div
      id={id}
      className={cn(
        'bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-4 mb-4 gap-3">
        <div className="text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles size={14} className="text-[#E8500A]" />
            <span className="text-[10px] font-black text-[#E8500A] uppercase tracking-[0.2em]">
              {badgeLabel}
            </span>
            {showSponsoredBadge && (
              <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest text-[#E8500A]/90 border border-[#E8500A]/30 uppercase bg-[#E8500A]/10 rounded-full">
                Sponsored
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold text-[#1a1a2e] mt-1 uppercase tracking-tight">
            {title.includes(' ') ? (
              <>
                {title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-[#E8500A]">{title.split(' ').slice(-1)}</span>
              </>
            ) : (
              <span className="text-[#E8500A]">{title}</span>
            )}
          </h2>
          <p className="text-[11px] text-[#8a9bb0] mt-1 text-left max-w-xl">{subtitle}</p>
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="inline-flex items-center gap-1.5 hover:bg-gray-50 text-[#E8500A] hover:text-[#CF4400] text-xs font-bold uppercase tracking-wider rounded-lg transition-all shrink-0"
          >
            {viewAllLabel} <ChevronRight size={14} />
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
        {posts.map((post) => (
          <BrandPostCard key={post.id} post={post} variant="carousel" className="snap-start" />
        ))}
      </div>
    </div>
  );
}
