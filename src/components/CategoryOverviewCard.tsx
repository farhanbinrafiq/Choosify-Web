import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface CategoryCardProps {
  id: number;
  title: string;
  discount: string;
  image: string;
  items: string[];
  count: number;
  onLikeToggle?: (id: number) => void;
  isLiked?: boolean;
}

export function CategoryOverviewCard({
  id,
  title,
  discount,
  image,
  items,
  count,
  onLikeToggle,
  isLiked = false,
}: CategoryCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    // Navigate to product detail page of choice for rich demo
    navigate('/product/1');
    toast.success(`Welcome to ${title}! Showing top trending models.`);
  };

  const handleItemClick = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    navigate('/product/1');
    toast.success(`Filtering products by subcategory: ${item}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeToggle) {
      onLikeToggle(id);
    } else {
      toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist", {
        icon: isLiked ? "💔" : "❤️",
      });
    }
  };

  return (
    <div 
      id={`category-card-${id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-[20px] shadow-soft hover:shadow-high-density transition-all duration-350 flex flex-col overflow-hidden h-full cursor-pointer group border-none"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/11] bg-[#F7F8FC] flex items-center justify-center p-6 select-none overflow-hidden border-none">
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 z-10 bg-[#FFF0F0] text-[#FF5B00] text-[11px] font-extrabold px-2.5 py-0.5 rounded-[6px] tracking-wide shadow-xs border-none">
          {discount}
        </div>

        {/* Favorite Heart Outline (Plain minimalist black/grey stroke, no bg as in screenshot) */}
        <button
          onClick={handleLikeClick}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500 transition-colors p-1.5 focus:outline-none cursor-pointer"
          title="Save category"
        >
          <Heart 
            className={cn(
              "w-[21px] h-[21px] stroke-[1.8px] transition-transform duration-200 active:scale-90",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-800"
            )} 
          />
        </button>

        {/* Centered Product Image */}
        <div className="w-4/5 h-4/5 flex items-center justify-center relative">
          <img
            src={image}
            alt={title}
            className="max-h-full max-w-full object-contain transition-transform duration-550 ease-out group-hover:scale-106 filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.04)]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Title & Subcategories List */}
      <div className="p-5 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Main Title */}
          <h3 className="text-[17px] font-extrabold text-[#000435] tracking-tight mb-3 hover:text-[#F96500] transition-colors leading-tight">
            {title}
          </h3>

          {/* Vertical Sub-links */}
          <div className="space-y-1.5 mb-4">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={(e) => handleItemClick(e, item)}
                className="block text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors bg-transparent border-0 p-0 text-left cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Show all Link */}
        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="text-xs font-bold text-[#4B6BFB] hover:text-blue-700 transition-colors bg-transparent border-0 p-0 text-left cursor-pointer uppercase tracking-wider"
          >
            Show all ({count})
          </button>
        </div>
      </div>
    </div>
  );
}
