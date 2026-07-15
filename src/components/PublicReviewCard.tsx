import React from 'react';
import { Star, CheckCircle2, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './ui/badges/Badge';

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
}

interface PublicReviewCardProps {
  id?: string | number;
  review: ReviewData;
  isDark?: boolean;
  onHelpfulClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  showActions?: boolean;
  onOptionsClick?: () => void;
  className?: string;
}

export function PublicReviewCard({
  review,
  isDark = false,
  showActions = false,
  onHelpfulClick,
  onEditClick,
  onDeleteClick,
  onOptionsClick,
  className,
}: PublicReviewCardProps) {
  const ratingNum = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
  const avatarUrl = review.dp || review.avatar || "https://i.pravatar.cc/150?u=anonymous";
  const displayComment = review.comment || review.content || "";
  const displayDate = review.date || review.time || "2 days ago";
  const displayProductImages = review.productImages || review.images || [];
  const isVerified = review.verified !== false;

  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 flex flex-col", className)}>
      {/* Header Profile & Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <img src={avatarUrl} alt={review.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#000435]">{review.name}</span>
              {isVerified && (
                <Badge variant="green" className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Buyer
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium text-slate-400 mt-0.5">{displayDate}</span>
          </div>
        </div>
      </div>

      {/* Rating & Review Content */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-black text-[#000435]">{ratingNum.toFixed(1)}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= ratingNum ? "fill-[#FF5B00] text-[#FF5B00]" : "fill-slate-100 text-slate-200"
                )}
              />
            ))}
          </div>
        </div>
        <p className="text-sm font-medium text-slate-600 leading-relaxed">
          {displayComment}
        </p>
      </div>

      {/* Attachments */}
      {displayProductImages.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {displayProductImages.map((img, j) => (
            <div key={j} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 cursor-zoom-in shrink-0 bg-slate-50">
              <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" alt="review attachment" />
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        {showActions ? (
          <div className="flex items-center gap-4">
            {onEditClick && (
              <button 
                onClick={onEditClick}
                className="text-xs font-bold text-[#FF5B00] hover:underline"
              >
                Edit Review
              </button>
            )}
            {onDeleteClick && (
              <button 
                onClick={onDeleteClick}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <>
            <button 
              onClick={onHelpfulClick}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#000435] transition-colors"
            >
              <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful || 0})
            </button>
            <button onClick={onOptionsClick} className="text-slate-400 hover:text-[#000435] transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
