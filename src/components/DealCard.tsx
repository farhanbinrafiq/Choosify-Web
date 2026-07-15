import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Heart, ShoppingCart, Truck, Shield } from 'lucide-react';

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
  cashback?: number;
  freeDelivery?: boolean;
  officialWarranty?: boolean;
  dealEndsAt?: string | number;
}

const getCountdownText = (dealEndsAt: any) => {
  if (!dealEndsAt) return '';
  if (typeof dealEndsAt === 'string' && (dealEndsAt.includes(':') || dealEndsAt.includes('Ends in'))) {
    return dealEndsAt.startsWith('Ends in') ? dealEndsAt : `Ends in ${dealEndsAt}`;
  }
  try {
    const end = new Date(dealEndsAt).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Ends in ${days.toString().padStart(2, '0')}d : ${hours.toString().padStart(2, '0')}h : ${mins.toString().padStart(2, '0')}m`;
  } catch (e) {
    return `Ends in 02d : 14h : 36m`;
  }
};

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
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex group text-left cursor-pointer h-[190px] w-full"
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
          {product.dealEndsAt && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-black/75 text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-xs">
                {getCountdownText(product.dealEndsAt)}
              </span>
            </div>
          )}
        </div>

        {/* Info contents */}
        <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
              {product.brand}
            </span>
            <h4 className="font-bold text-[13px] text-[#050B2C] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-2 mt-1">
              {product.title}
            </h4>
          </div>

          {/* Pricing, progress claimed */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-black text-[#FF5B00]">
                BDT {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-gray-400 line-through">
                BDT {product.originalPrice.toLocaleString()}
              </span>
            </div>

            {/* Badges for Free Delivery and Official Warranty */}
            {(product.freeDelivery || product.officialWarranty) && (
              <div className="flex flex-wrap gap-1 mt-1">
                {product.freeDelivery && (
                  <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-full px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-slate-500">
                    <Truck size={10} className="text-slate-400" />
                    <span>Free Delivery</span>
                  </div>
                )}
                {product.officialWarranty && (
                  <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-full px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-slate-500">
                    <Shield size={10} className="text-slate-400" />
                    <span>Warranty</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 mt-1 select-none">
              <Star className="w-3.5 h-3.5 fill-[#FF5B00] text-[#FF5B00]" />
              <span className="text-xs font-bold text-gray-800">{product.rating}</span>
              <span className="text-xs font-medium text-gray-400">({product.reviewsText})</span>
            </div>

            {/* Cashback text row */}
            {product.cashback && (
              <p className="text-[11px] font-extrabold text-emerald-600 tracking-tight leading-none pt-1">
                Get up to ৳{product.cashback.toLocaleString()} cashback
              </p>
            )}
          </div>

          {/* Footer interactions bar */}
          <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-50 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onLike) onLike(product.id, product.title, e);
              }}
              className={`h-8 px-3 rounded-xl border flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                isLiked 
                  ? 'border-red-200 text-red-500 bg-red-50/50' 
                  : 'border-slate-150 text-gray-400 hover:text-red-500 hover:bg-slate-50'
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
              className="w-8 h-8 rounded-full bg-[#FF5B00] hover:bg-[#E04F00] text-white flex items-center justify-center transition-all shadow-sm shadow-[#FF5B00]/15 hover:scale-105 cursor-pointer border-0 p-0"
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
