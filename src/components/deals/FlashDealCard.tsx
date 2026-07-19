import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PLACEHOLDER_IMAGE } from '../../constants';

export interface FlashDealCardProps {
  id: string | number;
  name: string;
  image?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  claimedPct?: number;
  likes?: string | number;
  href?: string;
  onAddToCart?: (e: React.MouseEvent) => void;
  onToggleWish?: (e: React.MouseEvent) => void;
  wished?: boolean;
  className?: string;
}

/** Choosify.dc.html Deals — Flash Deal tile */
export function FlashDealCard({
  id,
  name,
  image,
  category = 'Deals',
  price,
  originalPrice,
  badge = `${Math.max(5, Math.round(((originalPrice ?? price * 1.2) - price) / (originalPrice ?? price * 1.2) * 100))}% OFF`,
  claimedPct = 62,
  likes = '1.2K',
  href,
  onAddToCart,
  onToggleWish,
  wished = false,
  className,
}: FlashDealCardProps) {
  const to = href ?? `/products/${id}`;

  return (
    <Link
      to={to}
      className={cn(
        'block bg-white rounded-[10px] overflow-hidden border border-[#E8EDF2] group',
        className,
      )}
    >
      <div className="relative h-[150px] bg-[#F4F7F9]">
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-[#FF000D] text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded pointer-events-none">
          {badge}
        </span>
        <span className="absolute top-2 right-2 bg-black/55 text-white text-[8px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
          FLASH DEAL
        </span>
      </div>
      <div className="px-3 pt-2.5 pb-3.5">
        <div className="text-[9px] font-bold text-[#9AA0AC] mb-1">{category}</div>
        <div className="text-[12px] font-normal text-[#1A1A2E] mb-2 leading-snug line-clamp-2">
          {name}
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <div className="text-[14px] font-extrabold text-[#EB4501]">
            ৳{price.toLocaleString()}
          </div>
          {originalPrice != null && originalPrice > price && (
            <div className="text-[10px] text-[#9AA0AC] line-through">
              ৳{originalPrice.toLocaleString()}
            </div>
          )}
        </div>
        <div className="h-1 rounded bg-[#F1F1F3] overflow-hidden mb-2.5">
          <div
            className="h-full bg-[#EB4501] rounded"
            style={{ width: `${Math.min(100, Math.max(8, claimedPct))}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleWish?.(e);
            }}
            className="flex items-center gap-1 text-[10.5px] text-[#9AA0AC] border-0 bg-transparent p-0 cursor-pointer"
          >
            <Heart
              size={12}
              strokeWidth={1.6}
              className={cn(
                wished ? 'text-[#FF000D] fill-[#FF000D]' : 'text-[#CBD5E1]',
              )}
            />
            {likes}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(e);
            }}
            className="relative w-[26px] h-[26px] rounded-full bg-[#EB4501] flex items-center justify-center border-0 cursor-pointer shrink-0"
            aria-label="Add to cart"
          >
            <ShoppingCart size={13} className="text-white" strokeWidth={1.7} />
            <span className="absolute -top-1 -right-1 w-[13px] h-[13px] rounded-full bg-[#1A1A2E] text-white text-[9px] font-extrabold flex items-center justify-center leading-none">
              +
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}

export interface DealOfTheDayCardProps {
  id: string | number;
  name: string;
  image?: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating?: number;
  reviews?: number;
  sold?: string;
  claimedPct?: number;
  refreshLabel?: string;
  href?: string;
}

/** Choosify.dc.html Deals — Deal of the Day navy panel */
export function DealOfTheDayCard({
  id,
  name,
  image,
  price,
  originalPrice,
  badge = '55% OFF',
  rating = 4.8,
  reviews = 214,
  sold = '1.2K',
  claimedPct = 72,
  refreshLabel = '02:14:33',
  href,
}: DealOfTheDayCardProps) {
  const to = href ?? `/products/${id}`;

  return (
    <div className="choosify-dark-surface rounded-xl p-5 text-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[12px] font-extrabold text-[#EB4501] flex items-center gap-1">
          🏅 DEAL OF THE DAY
        </div>
        <div className="text-[9.5px] text-white/50">New deal in {refreshLabel}</div>
      </div>
      <Link to={to} className="relative h-[130px] rounded-[10px] overflow-hidden mb-3 block">
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 right-2 bg-[#FF000D] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
          {badge}
        </span>
      </Link>
      <div className="text-[12.5px] font-bold text-white mb-1.5 line-clamp-2">{name}</div>
      <div className="flex items-baseline gap-2 mb-2">
        <div className="text-base font-extrabold text-[#EB4501]">৳{price.toLocaleString()}</div>
        {originalPrice != null && originalPrice > price && (
          <div className="text-[11px] text-white/50 line-through">
            ৳{originalPrice.toLocaleString()}
          </div>
        )}
      </div>
      <div className="text-[10.5px] text-white/50 mb-2">
        ★ {rating} ({reviews}) · {sold} Sold
      </div>
      <div className="h-[5px] rounded bg-white/12 overflow-hidden mb-3.5">
        <div
          className="h-full bg-[#EB4501] rounded"
          style={{ width: `${Math.min(100, Math.max(8, claimedPct))}%` }}
        />
      </div>
      <Link
        to={to}
        className="mt-auto block w-full text-center bg-[#EB4501] text-white py-[11px] rounded-lg text-[12px] font-bold no-underline hover:brightness-110"
      >
        VIEW DEAL
      </Link>
    </div>
  );
}
