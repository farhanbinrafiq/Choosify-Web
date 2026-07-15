import React from 'react';
import { Star, Heart, Plus, Scale, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import toast from 'react-hot-toast';

export function ProductCard({ 
  product, 
  variant,
  showCountdown,
  imageContainerStyle,
  titleStyle,
  isGuideDetail,
  isDashboard,
  currency = '৳',
  onCompareToggle,
  isCompared = false
}: { 
  product: any;
  variant?: any;
  showCountdown?: any;
  imageContainerStyle?: any;
  titleStyle?: any;
  isGuideDetail?: any;
  isDashboard?: any;
  currency?: string;
  onCompareToggle?: (product: any) => void;
  isCompared?: boolean;
}) {
  const navigate = useNavigate();
  const { savedProducts, setSavedProducts } = useDashboard();
  const { addToCart } = useGlobalState();
  const isSaved = savedProducts.some(p => p.id === product.id);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      setSavedProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success('Removed from wishlist');
    } else {
      setSavedProducts(prev => [...prev, product]);
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Successfully added ${product.title} to cart!`);
  };

  const parsePrice = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return parseFloat(String(val).replace(/,/g, '')) || 0;
  };

  const priceNum = parsePrice(product.price);
  const originalPriceNum = parsePrice(product.originalPrice);

  const ratingString = product.rating || '4.8';
  const reviewsCount = product.reviews || '1.2k';

  return (
    <div 
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-2xl flex flex-col shadow-sm hover:shadow-md transition-all duration-300 relative group cursor-pointer w-full text-left overflow-hidden h-full border border-slate-100"
    >
      {/* Top Image Section */}
      <div className="relative w-full aspect-[4/3] bg-[#F7F8FC] flex items-center justify-center p-1.5 sm:p-2 overflow-hidden rounded-t-2xl">
        {/* Top Left Badges */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5 z-10">
          {product.discount && (
            <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full tracking-wide shadow-sm">
              {product.discount}
            </span>
          )}
          {product.badge && (
            <span className={cn(
              "text-[9px] font-bold text-white px-2 py-0.5 rounded-full tracking-wider shadow-sm",
              product.badge.toLowerCase().includes('featured') ? 'bg-blue-600' : 
              product.badge.toLowerCase().includes('best') ? 'bg-blue-600' :
              product.badge.toLowerCase().includes('new') ? 'bg-green-600' : 'bg-slate-800'
            )}>
              {product.badge.toUpperCase()}
            </span>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          {onCompareToggle && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle(product);
              }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center bg-white shadow hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-100",
                isCompared ? "text-[#FF5B00] border-[#FF5B00]/40" : "text-gray-400 hover:text-[#000435]"
              )}
              title="Compare product"
            >
              <Scale size={13} strokeWidth={2.5} />
            </button>
          )}
          <button 
            type="button"
            onClick={toggleSave}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow hover:scale-105 active:scale-95 transition-all text-gray-400 hover:text-red-500 cursor-pointer border border-slate-100"
          >
            <Heart 
              size={13} 
              className={cn("transition-colors", isSaved ? "fill-red-500 text-red-500" : "")} 
            />
          </button>
        </div>

        {/* Image */}
        <img 
          src={product.image || PLACEHOLDER_IMAGE} 
          alt={product.title} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Info Section */}
      <div className="p-4 flex flex-col flex-grow bg-white relative justify-between">
        <div>
          {/* Official Store Badge near price row */}
          {product.isOfficialStore && (
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-full w-fit mb-1.5">
              <Check size={10} strokeWidth={3.5} className="text-emerald-600" />
              <span>Official Store</span>
            </div>
          )}

          <h3 className="text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug tracking-tight mb-2 min-h-[38px]">
            {product.title}
          </h3>
          
          <div className="mt-auto space-y-1">
            {/* Pricing Row */}
            <div className="flex items-baseline gap-2">
              <span className="text-[16px] font-black text-[#FF5B00]">
                {currency}{priceNum.toLocaleString()}
              </span>
              {originalPriceNum > 0 && originalPriceNum > priceNum && (
                <span className="text-[12px] font-medium text-slate-400 line-through">
                  {currency}{originalPriceNum.toLocaleString()}
                </span>
              )}
            </div>

            {/* Cashback text row */}
            {product.cashback && (
              <p className="text-[11px] font-extrabold text-emerald-600 tracking-tight leading-none pt-0.5 pb-1">
                Get up to ৳{product.cashback.toLocaleString()} cashback
              </p>
            )}
            
            {/* Rating Row */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#FF5B00]">
              <Star className="w-3.5 h-3.5 text-[#FF5B00] fill-[#FF5B00]" />
              <span>{ratingString} ({reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Buy Now Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full btn-primary h-9 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5B00]/15"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
