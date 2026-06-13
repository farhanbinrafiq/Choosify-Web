import React from 'react';
import { Star, CheckCircle2, ThumbsUp } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ReviewData {
  name: string;
  avatar?: string;
  dp?: string; // Support both naming variants from source files
  time?: string;
  date?: string; // Support both key mappings
  purchaseDate?: string;
  comment?: string;
  content?: string; // Support both key mappings
  rating: number | string;
  verified?: boolean;
  productImages?: string[];
  images?: string[]; // Support both key mappings
  helpful?: number;
  // Product details specifically for dashboard view
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
}

export function PublicReviewCard({
  review,
  isDark = false,
  onHelpfulClick,
  onEditClick,
  onDeleteClick,
  showActions = false,
}: PublicReviewCardProps) {
  const ratingNum = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
  const avatarUrl = review.dp || review.avatar || "https://i.pravatar.cc/150?u=anonymous";
  const displayComment = review.comment || review.content || "";
  const displayDate = review.date || review.time || "Recently";
  const displayProductImages = review.productImages || review.images || [];
  const isVerified = review.verified !== false; // Default to true unless explicitly false

  return (
    <div 
      className={cn(
        "border transition-all duration-300 flex flex-col group rounded-[5px]",
        isDark 
          ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-[#059669]/5" 
          : "bg-gray-50 border-gray-100/50 text-[#1A1D4E] hover:shadow-md"
      )}
      style={{ borderRadius: '5px' }}
    >
      {/* Product Header (custom layout for dashboard/user reviews if applicable) */}
      {review.productName && (
        <div className={cn(
          "p-4 border-b flex items-center gap-4",
          isDark ? "border-white/10" : "border-gray-100"
        )}>
          {review.productImage && (
            <div className="w-12 h-12 rounded-[5px] bg-white p-1 shrink-0 flex items-center justify-center border border-gray-150">
              <img src={review.productImage} className="w-full h-full object-contain rounded-[3px]" alt={review.productName} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className={cn(
              "text-[8px] font-black uppercase tracking-widest block mb-0.5",
              isDark ? "text-gray-500" : "text-gray-400"
            )}>
              REVIEWED PRODUCT
            </span>
            <h4 className={cn(
              "text-xs font-black uppercase italic truncate",
              isDark ? "text-white" : "text-navy"
            )}>
              {review.productName}
            </h4>
          </div>
        </div>
      )}

      {/* Main Review Body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Profile Area & Rating Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-[5px] overflow-hidden border-2 p-0.5 shrink-0 bg-white",
              isDark ? "border-[#F96500]/45" : "border-[#E8500A]"
            )}>
              <img src={avatarUrl} className="w-full h-full object-cover rounded-[3px]" alt={review.name} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={cn(
                  "font-extrabold text-sm italic",
                  isDark ? "text-white" : "text-[#1A1D4E]"
                )}>
                  {review.name}
                </span>
                {isVerified && (
                  <span className="bg-[#4DBC15]/10 text-[#4DBC15] text-[7px] font-black uppercase px-1.5 py-0.5 rounded-[5px] flex items-center gap-0.5 whitespace-nowrap">
                    <CheckCircle2 size={8} className="text-[#4DBC15]" /> Verified
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[8px] font-bold uppercase tracking-wider block mt-0.5",
                isDark ? "text-gray-500" : "text-gray-400"
              )}>
                {displayDate.startsWith("Posted") || displayDate.startsWith("POSTED") ? displayDate : `Posted ${displayDate}`}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex gap-0.5 justify-end">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  size={10} 
                  className={cn(
                    "fill-current", 
                    star <= ratingNum 
                      ? (isDark ? "text-[#F96500]" : "text-[#E8500A]") 
                      : (isDark ? "text-white/10" : "text-gray-200")
                  )} 
                />
              ))}
            </div>
            <div className={cn(
              "text-sm font-black mt-0.5 italic",
              isDark ? "text-white" : "text-[#1A1D4E]"
            )}>
              {ratingNum} <span className={cn("text-[8px] font-sans", isDark ? "text-white/30" : "text-gray-300")}>/ 5</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Attachments */}
        {displayProductImages.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {displayProductImages.map((img, j) => (
              <div key={j} className={cn(
                "w-16 h-16 rounded-[5px] overflow-hidden border cursor-zoom-in shrink-0 bg-white p-0.5",
                isDark ? "border-white/10" : "border-gray-200"
              )}>
                <img src={img} className="w-full h-full object-cover rounded-[3px] hover:scale-110 transition-transform duration-500" alt="review attachment" />
              </div>
            ))}
          </div>
        )}

        {/* Review Comment Box */}
        <div className={cn(
          "p-4 border relative flex-1 min-h-[70px] flex items-center rounded-[5px]",
          isDark 
            ? "bg-white/5 border-white/10" 
            : "bg-white border-gray-100"
        )}>
          <p className={cn(
            "text-xs font-bold leading-relaxed italic border-0 p-0 m-0",
            isDark ? "text-gray-300" : "text-navy/80"
          )}>
            "{displayComment}"
          </p>
        </div>

        {/* Card Footer / Reaction Bar */}
        <div className={cn(
          "flex items-center justify-between mt-auto pt-3 border-t",
          isDark ? "border-white/10" : "border-gray-100/50"
        )}>
          {review.purchaseDate ? (
            <div className="flex flex-col">
              <span className={cn(
                "text-[7px] font-black uppercase tracking-widest italic mb-0.5",
                isDark ? "text-gray-500" : "text-gray-400"
              )}>
                Purchase Date
              </span>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider italic",
                isDark ? "text-white" : "text-[#1A1D4E]"
              )}>
                {review.purchaseDate}
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Action buttons slot */}
          {showActions ? (
            <div className="flex items-center gap-4">
              {onEditClick && (
                <button 
                  onClick={onEditClick}
                  className="text-[9px] font-black text-[#F96500] uppercase tracking-[0.2em] italic hover:underline cursor-pointer border-0 bg-transparent active:scale-95 transition-transform"
                >
                  Edit Review
                </button>
              )}
              {onDeleteClick && (
                <button 
                  onClick={onDeleteClick}
                  className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] italic hover:text-white cursor-pointer border-0 bg-transparent active:scale-95 transition-transform"
                >
                  Delete
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={onHelpfulClick}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest italic transition-colors cursor-pointer",
                  isDark
                    ? "bg-white/5 border-white/10 hover:border-white hover:bg-white/10 text-white"
                    : "bg-white border-gray-100 hover:border-navy text-[#1A1D4E]"
                )}
              >
                <ThumbsUp size={10} /> Helpful ({review.helpful || 0})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
