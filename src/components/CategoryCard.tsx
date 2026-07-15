import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface CategoryCardProps {
  id: number | string;
  title: string;
  discount?: string;
  image: string;
  items?: string[];
  count?: number;
  onLikeToggle?: (id: number | string) => void;
  isLiked?: boolean;
  handleItemClick?: (item: string) => void;
}

export const CategoryCard = memo(function CategoryCard({
  id,
  title,
  discount = 'Up to 30% Off',
  image,
  items = [],
  count = 120,
  onLikeToggle,
  isLiked = false,
  handleItemClick,
}: CategoryCardProps) {
  const navigate = useNavigate();
  const [localLiked, setLocalLiked] = useState(false);

  const activeLiked = isLiked || localLiked;

  const handleCardClick = () => {
    navigate('/categories');
    toast.success(`Welcome to ${title}! Discover top-rated brands and products.`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeToggle) {
      onLikeToggle(id);
    } else {
      setLocalLiked(!activeLiked);
      toast.success(!activeLiked ? "Added category to your favorites!" : "Removed category from favorites", {
        icon: !activeLiked ? "❤️" : "💔",
      });
    }
  };

  return (
    <div 
      id={`category-card-${id}`}
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer group border border-slate-100 text-left"
    >
      {/* Top Image Container: Full-bleed aspect-[16/10] */}
      <div className="relative aspect-[16/10] bg-[#F7F8FC] w-full overflow-hidden select-none">
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-4 left-4 z-10 bg-[#FFF0F0] text-[#FF5B00] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wide shadow-xs border border-[#FF5B00]/10 uppercase">
            {discount}
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleLikeClick}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:scale-105 active:scale-95 transition-all text-gray-400 hover:text-red-500 cursor-pointer border border-slate-100"
          title="Save category"
        >
          <Heart 
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              activeLiked ? "fill-red-500 text-red-500" : "text-gray-800"
            )} 
          />
        </button>

        {/* Full Bleed Image with object-cover */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Title & Product Count Subtext */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="mb-4">
          {/* Main Title */}
          <h3 className="text-base font-bold text-[#000435] tracking-tight mb-1 hover:text-[#FF5B00] transition-colors leading-tight">
            {title}
          </h3>
          
          {/* Product Count Gray Subtext */}
          <p className="text-xs font-semibold text-slate-400">
            {count.toLocaleString()} Products
          </p>
        </div>

        {/* Explore Category Button */}
        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full btn-outline py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm border border-slate-200 hover:bg-slate-50 cursor-pointer text-[#000435] rounded-xl"
          >
            Explore Category
          </button>
        </div>
      </div>
    </div>
  );
});
