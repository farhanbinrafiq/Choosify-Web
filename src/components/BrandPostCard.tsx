import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import type { BrandPost } from '../types/brandPost';
import { formatBrandPostDateRange } from '../lib/brandPosts';
import { CardEngagementStrip } from './CardEngagementStrip';
import { useGlobalState } from '../context/GlobalStateContext';
import { resolveEventBadges } from '../utils/eventBadges';

type BrandPostCardProps = {
  post: BrandPost;
  variant?: 'grid' | 'carousel';
  compact?: boolean;
  className?: string;
};

export function BrandPostCard({ post, variant = 'grid', compact = false, className }: BrandPostCardProps) {
  const { siteConfig } = useGlobalState();
  const dateLabel = formatBrandPostDateRange(post.startDate, post.endDate);
  const badges = resolveEventBadges(post, siteConfig);

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
      {/* Photo only — no text or badges on the image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={post.heroImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      </div>

      <div className={cn('flex flex-col flex-1 gap-2', compact ? 'p-3' : 'p-4')}>
        <div className="flex flex-wrap items-center gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className={cn(
                'px-2 py-0.5 rounded-full font-black uppercase tracking-wider text-white',
                compact ? 'text-[8px]' : 'text-[9px]',
              )}
              style={{ backgroundColor: badge.color }}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            'rounded-full bg-[#1A1D4E] text-white flex items-center justify-center font-black shrink-0',
            compact ? 'w-7 h-7 text-[9px]' : 'w-8 h-8 text-[10px]',
          )}>
            {post.brandLogo || post.brandName.slice(0, 2).toUpperCase()}
          </div>
          <span className={cn('font-bold text-[#1A1D4E] truncate', compact ? 'text-[10px]' : 'text-[11px]')}>
            {post.brandName}
          </span>
        </div>

        <h3 className={cn(
          'font-bold text-[#1A1D4E] leading-snug line-clamp-2 group-hover:text-[#E8500A] transition-colors',
          compact ? 'text-[11px]' : 'text-[13px]',
        )}>
          {post.title}
        </h3>
        <p className={cn('text-[#8a9bb0] leading-relaxed line-clamp-2', compact ? 'text-[10px]' : 'text-[11px]')}>
          {post.excerpt}
        </p>

        <div className={cn('mt-auto border-t border-[#e8edf2]', compact ? 'pt-2 space-y-1' : 'pt-3 space-y-1.5')}>
          {dateLabel && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#1A1D4E]/80">
              <CalendarDays size={compact ? 11 : 12} className="text-[#E8500A] shrink-0" />
              <span className="truncate">{dateLabel}</span>
            </div>
          )}
          {post.location && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
              <MapPin size={compact ? 11 : 12} className="shrink-0" />
              <span className="truncate">{post.location}</span>
            </div>
          )}
        </div>

        <CardEngagementStrip
          entityType="brand-post"
          entityId={post.id}
          payload={post}
          onClickCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />

        <div className={cn(
          'flex items-center gap-1 font-black uppercase tracking-wider text-[#E8500A]',
          compact ? 'text-[9px] pt-0.5' : 'text-[10px] pt-1',
        )}>
          <Sparkles size={compact ? 10 : 11} />
          Read details
        </div>
      </div>
    </Link>
  );
}
