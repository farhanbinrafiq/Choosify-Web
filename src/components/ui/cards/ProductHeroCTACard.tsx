import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Star, Heart, Repeat } from 'lucide-react';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';

export interface ProductVariant {
  label: string;
  value: string;
  colorHex?: string;
}

export interface ProductHeroCTACardProps {
  image: string;
  title: string;
  subtitle?: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
  discountBadge?: string;
  cashbackText?: string;
  colors?: ProductVariant[];
  storages?: ProductVariant[];
  onBuyNow?: () => void;
  onWishlist?: () => void;
  onCompare?: () => void;
  className?: string;
}

export const ProductHeroCTACard: React.FC<ProductHeroCTACardProps> = ({
  image,
  title,
  subtitle,
  rating,
  reviewCount,
  price,
  originalPrice,
  discountBadge,
  cashbackText,
  colors,
  storages,
  onBuyNow,
  onWishlist,
  onCompare,
  className
}) => {
  const [selectedColor, setSelectedColor] = useState(colors?.[0]?.value || '');
  const [selectedStorage, setSelectedStorage] = useState(storages?.[0]?.value || '');

  return (
    <div className={cn("bg-white rounded-none p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100", className)}>
      {/* Product Image Area */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-50 rounded-none p-8 relative min-h-[300px]">
        {discountBadge && (
          <Badge variant="red" className="absolute top-4 left-4">
            {discountBadge}
          </Badge>
        )}
        <button onClick={onWishlist} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#EB4501] hover:text-[#CF4400] transition-colors">
          <Heart className="w-5 h-5 text-[#EB4501]" strokeWidth={2} />
        </button>
        <img src={image} alt={title} className="max-w-full max-h-[400px] object-contain drop-shadow-2xl" />
      </div>

      {/* Product Info Area */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-black text-[#000435] leading-tight tracking-tight mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-bold text-slate-500 mb-4">{subtitle}</p>
        )}

        {/* Ratings */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1 bg-[#07D005] px-2 py-0.5 rounded text-white font-bold text-xs">
            {rating.toFixed(1)} <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-400">({reviewCount} Reviews)</span>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#000435]">{price}</span>
            {originalPrice && (
              <span className="text-lg font-bold text-slate-400 line-through decoration-slate-300">
                {originalPrice}
              </span>
            )}
            {discountBadge && (
              <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {discountBadge}
              </span>
            )}
          </div>
          {cashbackText && (
            <p className="text-xs font-bold text-[#EB4501] mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EB4501]"></span>
              {cashbackText}
            </p>
          )}
        </div>

        {/* Variants - Colors */}
        {colors && colors.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Colors:</h4>
            <div className="flex items-center gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-200 shadow-sm",
                    selectedColor === color.value ? "border-[#EB4501] scale-110" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.colorHex }}
                  title={color.label}
                  aria-label={`Select color ${color.label}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Variants - Storages */}
        {storages && storages.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Storage:</h4>
            <div className="flex flex-wrap gap-2">
              {storages.map((storage) => (
                <button
                  key={storage.value}
                  onClick={() => setSelectedStorage(storage.value)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200",
                    selectedStorage === storage.value 
                      ? "border-[#000435] bg-[#000435] text-white" 
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {storage.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          <Button variant="outline" onClick={onWishlist} leftIcon={<Heart className="w-4 h-4 text-[#EB4501]" strokeWidth={2} />}>
            Add to Wishlist
          </Button>
          <Button
            variant="outline"
            onClick={onCompare}
            leftIcon={
              <Repeat className="w-4 h-4" stroke="url(#choosify-emi-icon-grad)" />
            }
            className="bg-white border-slate-200"
          >
            <span className="choosify-emi-gradient-text">Compare</span>
          </Button>
          <Button variant="cta" className="flex-1 min-w-[150px]" onClick={onBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
