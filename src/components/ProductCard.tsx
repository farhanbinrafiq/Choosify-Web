import React from 'react';
import { Star, Heart, Plus } from 'lucide-react';
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
  currency = '৳'
}: { 
  product: any;
  variant?: any;
  showCountdown?: any;
  imageContainerStyle?: any;
  titleStyle?: any;
  isGuideDetail?: any;
  isDashboard?: any;
  currency?: string;
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
      className="bg-white rounded-[20px] flex flex-col shadow-soft hover:shadow-high-density transition-all duration-300 relative group cursor-pointer w-full text-left overflow-hidden h-full border-none"
    >
      {/* Top Image Section */}
      <div className="relative w-full aspect-[4/3] bg-[#F7F8FC] flex items-center justify-center p-4 overflow-hidden rounded-t-[20px]">
        {/* Top Left Badges */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5 z-10">
          {product.discount && (
            <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded tracking-wide shadow-sm">
              {product.discount}
            </span>
          )}
          {product.badge && (
            <span className={cn(
              "text-[9px] font-bold text-white px-2 py-0.5 rounded tracking-wider shadow-sm",
              product.badge.toLowerCase().includes('featured') ? 'bg-blue-600' : 
              product.badge.toLowerCase().includes('best') ? 'bg-blue-600' :
              product.badge.toLowerCase().includes('new') ? 'bg-green-600' : 'bg-slate-800'
            )}>
              {product.badge.toUpperCase()}
            </span>
          )}
        </div>

        {/* Top Right Wishlist */}
        <button 
          type="button"
          onClick={toggleSave}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow hover:scale-105 active:scale-95 transition-all text-gray-400 hover:text-red-500 z-10 cursor-pointer"
        >
          <Heart 
            size={14} 
            className={cn("transition-colors", isSaved ? "fill-red-500 text-red-500" : "")} 
          />
        </button>

        {/* Image */}
        <img 
          src={product.image || PLACEHOLDER_IMAGE} 
          alt={product.title} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Info Section */}
      <div className="p-4 flex flex-col flex-grow bg-white relative">
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
          
          {/* Rating Row */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#FF5B00]">
            <Star className="w-3.5 h-3.5 text-[#FF5B00] fill-[#FF5B00]" />
            <span>{ratingString} ({reviewsCount})</span>
          </div>
        </div>

        {/* Floating Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#FF5B00] text-white flex items-center justify-center shadow-md hover:bg-[#EB4501] hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
          aria-label="Add to cart"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
