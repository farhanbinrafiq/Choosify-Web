import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface CreatorCardDesignProps {
  creator: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
    score: number;
    bestFor: string;
    platforms: string[];
    rating: number;
    reviews: number;
    isHot?: boolean;
    isFeatured?: boolean;
    coverImage?: string;
    bio?: string;
  };
  onClick?: () => void;
}

const CREATOR_COVERS: Record<string, string> = {
  "creator-farhan": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
  "creator-sarah": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  "creator-mily": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  "creator-imtiaz": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
  "creator-shakib": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80"
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export const CreatorCardDesign = memo(function CreatorCardDesign({ creator, onClick }: CreatorCardDesignProps) {
  const rating = creator.rating || 4.7;
  const reviewsCount = creator.reviews || 85;
  const score = creator.score || 90;
  const mainPlatform = creator.platforms && creator.platforms.length > 0 ? creator.platforms[0] : 'YouTube';
  const bestForText = creator.bestFor || 'Lifestyles';
  const bioText = creator.bio || `Creative influencer sharing content at ${creator.handle}`;

  const coverUrl = creator.coverImage 
    || CREATOR_COVERS[creator.id] 
    || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80";

  return (
    <Link
      to={`/creators/${creator.id}`}
      onClick={onClick}
      className="block w-full max-w-[340px] bg-white rounded-[12px] border border-[#e8edf2] hover:shadow-lg hover:border-[#E8500A]/40 transition-all duration-300 overflow-hidden group select-none flex flex-col justify-between relative"
    >
      {/* FEATURED BADGE */}
      {creator.isFeatured && (
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Featured
          </span>
        </div>
      )}
      {creator.isHot && !creator.isFeatured && (
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Hot
          </span>
        </div>
      )}

      {/* COVER PHOTO SECTION */}
      <div className="relative w-full h-[150px] bg-gradient-to-r from-[#1A1D4E]/10 to-[#E8500A]/10 overflow-hidden shrink-0">
        <img 
          src={coverUrl}
          alt={`${creator.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
        
        {/* AVATAR - overlapping cover at bottom-left */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2 z-10">
          <div className="w-[80px] h-[80px] rounded-[8px] border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg">
            <img 
              src={creator.avatar} 
              className="w-full h-full object-cover" 
              alt={creator.name}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* CREATOR INFO SECTION */}
      <div className="px-4 pt-12 pb-3 text-left flex-1 flex flex-col justify-center min-w-0">
        <h3 className="text-base font-black text-[#1A1D4E] uppercase line-clamp-1 mb-1 leading-tight tracking-tight">
          {creator.name}
        </h3>
        
        <p className="text-xs text-gray-500 mb-2 line-clamp-1 leading-normal font-medium">
          {creator.handle} • {bioText}
        </p>
        
        <div className="flex items-center gap-1.5 leading-none mt-0.5">
          <div className="flex items-center text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={11} 
                className={cn(
                  "fill-current", 
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200 fill-none"
                )} 
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#1A1D4E]">
            {rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-gray-400">
            ({formatNumber(reviewsCount)} reviews)
          </span>
        </div>
      </div>

      {/* STATS SECTION - 3 COLUMNS */}
      <div className="border-t border-b border-[#e8edf2] px-4 py-3 bg-[#F8FBFD] shrink-0">
        <div className="grid grid-cols-3 gap-1">
          {/* Column 1: Best For */}
          <div className="text-center min-w-0">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 leading-none">
              Best For
            </div>
            <div className="text-xs font-black text-[#1A1D4E] truncate leading-tight">
              {bestForText}
            </div>
          </div>
          
          {/* Column 2: Creator Score */}
          <div className="text-center border-l border-r border-[#e8edf2] min-w-0 px-1">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 leading-none">
              Score
            </div>
            <div className="text-xs font-black text-[#E8500A] truncate leading-tight">
              {score}%
            </div>
          </div>
          
          {/* Column 3: Platform */}
          <div className="text-center min-w-0 flex flex-col items-center justify-center">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 leading-none">
              Platform
            </div>
            <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-black text-[10px] leading-none uppercase tracking-wide">
              {mainPlatform}
            </div>
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="px-4 py-3 shrink-0 bg-white">
        <button 
          type="button"
          className="w-full py-2.5 bg-[#1A1D4E] hover:bg-[#0F0F2E] text-white text-[11px] font-black uppercase rounded-[5px] transition-all duration-200 flex items-center justify-center gap-1.5 group"
        >
          View Profile
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </div>
    </Link>
  );
});

// Simple cn utility local helper in case not fully defined
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
