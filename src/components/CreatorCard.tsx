import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, Youtube, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Creator {
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
  trustScore?: number;
  followersCount?: string;
  reviewsCount?: number;
}

interface CreatorCardProps {
  creator: Creator;
  onClick?: () => void;
  className?: string;
}

const CREATOR_COVERS: Record<string, string> = {
  "creator-farhan": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
  "creator-sarah": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  "creator-rakib": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
  "creator-nusrat": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
  "creator-gadget": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
  "creator-homefinds": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80",
  "creator-sneaker": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
  "creator-tania": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"
};

function formatReviewsCount(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function TikTokIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

function PinterestIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.4.04-3.43.21-.92 1.34-5.69 1.34-5.69s-.34-.69-.34-1.71c0-1.6 1-.92 1.15-2.82.15-2.1-1.37-3.81-3.38-3.81-2.3 0-3.65 1.73-3.65 3.51 0 .7.27 1.44.6 1.84.07.08.08.15.06.23l-.22.91c-.04.15-.12.18-.28.11-1.04-.48-1.69-2.01-1.69-3.23 0-2.63 1.91-5.05 5.51-5.05 2.89 0 5.14 2.06 5.14 4.82 0 2.87-1.81 5.18-4.32 5.18-.84 0-1.64-.44-1.91-.96 0 0-.42 1.6-.52 1.99-.19.72-.7 1.62-1.05 2.18 1.12.35 2.3.54 3.53.54 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
    </svg>
  );
}

export const CreatorCard = memo(function CreatorCard({ creator, onClick, className }: CreatorCardProps) {
  const rating = creator.rating || 4.8;
  const reviewsCountText = creator.reviews ? formatReviewsCount(creator.reviews) : '12.3K';
  const reviews = creator.reviewsCount || 256;
  const followers = creator.followersCount || '125K';
  const trustScore = creator.trustScore || 98;
  
  // Choose beautiful Unsplash cover based on ID
  const coverUrl = creator.coverImage 
    || CREATOR_COVERS[creator.id as string] 
    || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80";

  return (
    <div
      id={`creator-card-${creator.id}`}
      className={cn(
        "bg-white rounded-2xl border border-gray-200/65 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none text-left w-full h-[470px]",
        className
      )}
    >
      {/* Cover Image and Featured Badge */}
      <div className="relative h-[150px] overflow-hidden shrink-0">
        <img 
          src={coverUrl}
          alt={`${creator.name} Cover`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Featured Tag (orange tag top left) */}
        {creator.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#FF5B00] text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-[4px] uppercase shadow-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Profile Info Area */}
      <div className="px-5 pt-11 pb-5 flex-1 flex flex-col justify-between relative min-w-0">
        {/* Avatar overlaying the cover */}
        <div className="absolute -top-[38px] left-1/2 -translate-x-1/2 z-25">
          <div className="w-[84px] h-[84px] rounded-full border-[3.5px] border-white bg-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
            <img 
              src={creator.avatar} 
              className="w-full h-full object-cover rounded-full" 
              alt={creator.name}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        </div>

        {/* Text Center Details */}
        <div className="text-center w-full mt-1.5 flex-1 flex flex-col justify-start">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h3 className="font-sans text-[15px] font-bold text-[#0E0F23] tracking-tight leading-none truncate">
              {creator.name}
            </h3>
            {/* Green tick Verified badge */}
            <span className="text-[#22C55E] flex items-center shrink-0" title="Verified Creator">
              <CheckCircle2 className="w-4 h-4 fill-[#22C55E]/10" />
            </span>
            <span className="text-[10px] font-medium text-[#22C55E]">Verified</span>
          </div>

          <p className="text-xs text-gray-500 font-medium line-clamp-1">
            {creator.bestFor || "Tech Reviewer"} & Digital Expert
          </p>

          {/* Rating Line */}
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-semibold text-gray-800">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({reviewsCountText} reviews)</span>
          </div>

          {/* Social Platform Badges */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {creator.platforms && creator.platforms.map((platform, idx) => {
              const pLower = platform.toLowerCase();
              if (pLower === 'youtube') {
                return (
                  <div key={idx} className="w-[28px] h-[28px] rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer">
                    <Youtube className="w-3.5 h-3.5" />
                  </div>
                );
              }
              if (pLower === 'instagram') {
                return (
                  <div key={idx} className="w-[28px] h-[28px] rounded-full bg-gradient-to-tr from-[#F9CE34] via-[#EE2A7B] to-[#6228D7] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                );
              }
              if (pLower === 'tiktok') {
                return (
                  <div key={idx} className="w-[28px] h-[28px] rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer">
                    <TikTokIcon className="w-3 h-3 text-white" />
                  </div>
                );
              }
              if (pLower === 'facebook') {
                return (
                  <div key={idx} className="w-[28px] h-[28px] rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer">
                    <Facebook className="w-3.5 h-3.5" />
                  </div>
                );
              }
              if (pLower === 'pinterest' || pLower === 'pin') {
                return (
                  <div key={idx} className="w-[28px] h-[28px] rounded-full bg-[#BD081C] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer">
                    <PinterestIcon className="w-3 h-3 text-white" />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      {/* 3 Column Statistics section */}
      <div className="border-t border-gray-150 bg-[#FAFAFA] grid grid-cols-3 py-3 text-center shrink-0">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[14px] font-bold text-[#0E0F23] leading-tight">
            {reviews}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Reviews
          </span>
        </div>
        <div className="border-x border-gray-200/80 flex flex-col items-center justify-center">
          <span className="text-[14px] font-bold text-[#0E0F23] leading-tight">
            {followers}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Followers
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[14px] font-bold text-[#0E0F23] leading-tight">
            {trustScore}%
          </span>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Trust Score
          </span>
        </div>
      </div>

      {/* Solid Dark Blue/Indigo Button */}
      <div className="px-4 pb-4 shrink-0 bg-white">
        <Link 
          to={`/creators/${creator.id}`}
          onClick={onClick}
          className="w-full py-2.5 bg-[#0C0C1F] hover:bg-[#1A1A3B] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors duration-200 group"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
});
