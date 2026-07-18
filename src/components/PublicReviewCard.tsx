import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ReviewData {
  name: string;
  avatar?: string;
  dp?: string;
  time?: string;
  date?: string;
  purchaseDate?: string;
  comment?: string;
  content?: string;
  rating: number | string;
  verified?: boolean;
  productImages?: string[];
  images?: string[];
  helpful?: number;
  productName?: string;
  productImage?: string;
  tags?: string[];
}

interface PublicReviewCardProps {
  id?: string | number;
  review: ReviewData;
  isDark?: boolean;
  onHelpfulClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  showActions?: boolean;
}

/** Choosify.dc.html public review card — Product / Brand detail feeds */
export function PublicReviewCard({
  review,
  isDark = false,
  onHelpfulClick,
  onEditClick,
  onDeleteClick,
  showActions = false,
}: PublicReviewCardProps) {
  const ratingNum = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
  const avatarUrl = review.dp || review.avatar;
  const displayComment = review.comment || review.content || '';
  const displayDate = review.date || review.time || 'Recently';
  const displayProductImages = review.productImages || review.images || [];
  const isVerified = review.verified !== false;
  const initial = (review.name || '?').charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'rounded-[14px] p-[18px] flex flex-col text-left',
        isDark
          ? 'bg-white/5 border border-white/10 text-white'
          : 'bg-white border border-[#E8EDF2]',
      )}
    >
      {review.productName && (
        <div
          className={cn(
            'pb-3 mb-3 border-b flex items-center gap-3',
            isDark ? 'border-white/10' : 'border-[#F1F1F3]',
          )}
        >
          {review.productImage && (
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9]">
              <img src={review.productImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[9px] font-bold text-[#9AA0AC] uppercase tracking-wide">
              Reviewed product
            </div>
            <div className={cn('text-[13px] font-bold truncate', isDark ? 'text-white' : 'text-[#1A1A2E]')}>
              {review.productName}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {avatarUrl ? (
            <div className="w-[42px] h-[42px] rounded-full overflow-hidden shrink-0 bg-[#F4F7F9]">
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FF5B00] text-white flex items-center justify-center text-[13px] font-extrabold shrink-0">
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <div
              className={cn(
                'text-[13.5px] font-bold mb-0.5 truncate',
                isDark ? 'text-white' : 'text-[#1A1A2E]',
              )}
            >
              {review.name}
            </div>
            {isVerified && (
              <div className="flex items-center gap-1 text-[11px] text-[#16A34A] font-bold">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="#16A34A" aria-hidden>
                  <circle cx="10" cy="10" r="9" />
                  <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="1.8" fill="none" />
                </svg>
                Verified Buyer
              </div>
            )}
          </div>
        </div>
        <div className="text-[11px] text-[#9AA0AC] whitespace-nowrap shrink-0">{displayDate}</div>
      </div>

      <div className="flex items-center gap-1.5 mb-2.5">
        <span className={cn('text-[15px] font-extrabold', isDark ? 'text-white' : 'text-[#1A1A2E]')}>
          {Number.isFinite(ratingNum) ? ratingNum.toFixed(1).replace(/\.0$/, '') : ratingNum}
        </span>
        <span className="text-[#FBBF24] text-sm tracking-widest" aria-hidden>
          {'★'.repeat(Math.min(5, Math.round(ratingNum || 0)))}
          {'☆'.repeat(Math.max(0, 5 - Math.round(ratingNum || 0)))}
        </span>
      </div>

      <p
        className={cn(
          'text-[13px] leading-relaxed m-0 mb-3.5',
          isDark ? 'text-white/80' : 'text-[#374151]',
        )}
      >
        {displayComment}
      </p>

      {displayProductImages.length > 0 && (
        <div className="flex gap-2 mb-3.5 flex-wrap">
          {displayProductImages.slice(0, 4).map((img, j) => (
            <div
              key={j}
              className="w-16 h-16 rounded-[10px] overflow-hidden shrink-0 bg-[#F4F7F9]"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {review.tags && review.tags.length > 0 && (
        <div className="flex gap-2 mb-3.5 flex-wrap">
          {review.tags.map((tg) => (
            <span
              key={tg}
              className="bg-[#F4F7F9] text-[10.5px] font-semibold text-[#4B5563] px-2.5 py-1 rounded-xl"
            >
              {tg}
            </span>
          ))}
        </div>
      )}

      <div
        className={cn(
          'flex justify-between items-center pt-3 border-t mt-auto',
          isDark ? 'border-white/10' : 'border-[#F1F1F3]',
        )}
      >
        {showActions ? (
          <div className="flex items-center gap-4">
            {onEditClick && (
              <button
                type="button"
                onClick={onEditClick}
                className="text-[12px] font-bold text-[#FF5B00] bg-transparent border-0 cursor-pointer p-0"
              >
                Edit Review
              </button>
            )}
            {onDeleteClick && (
              <button
                type="button"
                onClick={onDeleteClick}
                className="text-[12px] font-bold text-[#9AA0AC] bg-transparent border-0 cursor-pointer p-0"
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onHelpfulClick}
            className="inline-flex items-center gap-1.5 text-[12px] text-[#4B5563] font-bold bg-transparent border-0 cursor-pointer p-0"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#4B5563" strokeWidth="1.7" aria-hidden>
              <path d="M2 9h3v9H2zM5 9l3-7c1 0 2 1 2 2v3h5c1 0 2 1 1.5 2l-1.5 7c-.3 1-1 2-2 2H5" />
            </svg>
            Helpful ({review.helpful || 0})
          </button>
        )}
        {!showActions && <MoreHorizontal size={16} className="text-[#9AA0AC]" aria-hidden />}
      </div>
    </div>
  );
}
