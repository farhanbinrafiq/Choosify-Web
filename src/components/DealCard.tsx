import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react';

interface DealPromo {
  type?: 'flash' | 'coupon' | 'promo' | string;
  bg?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  code?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DealProduct {
  id: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewsText: string;
  claimedPercent: number;
  likes: number;
}

interface DealCardProps {
  variant?: 'promo' | 'product';
  deal?: DealPromo;
  product?: DealProduct;
  isLiked?: boolean;
  onLike?: (id: string, name: string, e: React.MouseEvent) => void;
  onAddToCart?: (name: string, e: React.MouseEvent) => void;
  onClick?: () => void;
}

export const DealCard = memo(function DealCard({
  variant = 'promo',
  deal,
  product,
  isLiked = false,
  onLike,
  onAddToCart,
  onClick
}: DealCardProps) {
  const navigate = useNavigate();

  if (variant === 'product' && product) {
    const handleCardClick = () => {
      if (onClick) {
        onClick();
      } else {
        navigate(`/products/${product.id}`);
      }
    };

    return (
      <div 
        id={`deal-card-${product.id}`}
        onClick={handleCardClick}
        className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex group text-left cursor-pointer h-[190px] w-full"
      >
        {/* Left image area */}
        <div className="relative w-28 sm:w-36 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          {product.discount && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-[#EF4444] text-white text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase shadow-sm">
                {product.discount}
              </span>
            </div>
          )}
        </div>

        {/* Info contents */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
              {product.brand}
            </span>
            <h4 className="font-bold text-[13px] text-[#050B2C] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-2 mt-1">
              {product.title}
            </h4>
          </div>

          {/* Pricing, progress claimed */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-[#FF5B00]">
                BDT {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-gray-400 line-through">
                BDT {product.originalPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-1.5 select-none">
              <Star className="w-3.5 h-3.5 fill-[#FF5B00] text-[#FF5B00]" />
              <span className="text-xs font-bold text-gray-800">{product.rating}</span>
              <span className="text-xs font-medium text-gray-400">({product.reviewsText})</span>
            </div>

            {/* Progress Claimed */}
            <div className="mt-3.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mb-1">
                <span className="text-[#FF5B00] font-black">{product.claimedPercent}% Claimed</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF5B00] rounded-full" 
                  style={{ width: `${product.claimedPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Footer interactions bar */}
          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-gray-100 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onLike) onLike(product.id, product.title, e);
              }}
              className={`h-8 px-3 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                isLiked 
                  ? 'border-red-200 text-red-500 bg-red-50' 
                  : 'border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{product.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onAddToCart) onAddToCart(product.title, e);
              }}
              className="w-8 h-8 rounded-full bg-[#FF5B00] hover:bg-[#E04F00] text-white flex items-center justify-center transition-all shadow-xs hover:scale-105 cursor-pointer border-0 p-0"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, promotional deal block
  if (deal) {
    const handlePromoClick = () => {
      if (onClick) {
        onClick();
      } else {
        navigate('/deals');
      }
    };

    const IconComponent = deal.icon;

    return (
      <div 
        id={`deal-promo-card`}
        onClick={handlePromoClick}
        className={`${deal.bg || 'bg-gradient-to-br from-[#FF5B00] to-[#EB4501]'} rounded-3xl p-8 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-transparent w-full`}
      >
        <div className="relative z-10 flex flex-col h-full text-left">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 w-fit px-2 py-1 rounded mb-4">
            {deal.label}
          </span>
          <h3 className="text-2xl font-black leading-tight mb-2">{deal.title}</h3>
          <p className="text-sm font-medium text-white/80 mb-6">{deal.subtitle}</p>
          
          <div className="mt-auto">
            {deal.code ? (
              <div className="bg-white/20 rounded-xl px-4 py-3 flex items-center justify-center border border-white/20 border-dashed">
                <span className="font-mono font-bold tracking-wider">{deal.code}</span>
              </div>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                {deal.cta || 'SHOP NOW'} <ChevronRight size={14} />
              </span>
            )}
          </div>
        </div>
        {IconComponent && <IconComponent className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 pointer-events-none" />}
      </div>
    );
  }

  return null;
});
