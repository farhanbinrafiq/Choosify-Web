import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import type { BrandPost } from '../types/brandPost';
import { BRAND_POST_KIND_LABELS } from '../types/brandPost';
import { formatBrandPostDateRange } from '../lib/brandPosts';

type BrandPostCardProps = {
  post: BrandPost;
  variant?: 'grid' | 'carousel';
  className?: string;
};

export function BrandPostCard({ post, variant = 'grid', className }: BrandPostCardProps) {
  const dateLabel = formatBrandPostDateRange(post.startDate, post.endDate);

  return (
    <Link
      to={`/whats-on/${post.slug}`}
      className={cn(
        'group flex flex-col bg-white rounded-[5px] border border-[#e8edf2] overflow-hidden shadow-sm',
        'hover:border-[#E8500A]/35 hover:shadow-md transition-all duration-300 text-left h-full',
        variant === 'carousel' && 'w-[280px] shrink-0',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={post.heroImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#E8500A] text-white">
            Sponsored
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/90 text-[#1A1D4E]">
            {BRAND_POST_KIND_LABELS[post.kind]}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/95 border border-white flex items-center justify-center text-[10px] font-black text-[#1A1D4E] shrink-0">
            {post.brandLogo || post.brandName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow truncate">{post.brandName}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-[13px] font-bold text-[#1A1D4E] leading-snug line-clamp-2 group-hover:text-[#E8500A] transition-colors">
          {post.title}
        </h3>
        <p className="text-[11px] text-[#8a9bb0] leading-relaxed line-clamp-2">{post.excerpt}</p>

        <div className="mt-auto pt-3 space-y-1.5 border-t border-[#e8edf2]">
          {dateLabel && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#1A1D4E]/80">
              <CalendarDays size={12} className="text-[#E8500A] shrink-0" />
              <span className="truncate">{dateLabel}</span>
            </div>
          )}
          {post.location && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{post.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#E8500A] pt-1">
          <Sparkles size={11} />
          Read details
        </div>
      </div>
    </Link>
  );
}
