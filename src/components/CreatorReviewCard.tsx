import React from 'react';
import { Play, ShieldCheck, Youtube, Instagram, Tv } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CreatorReview {
  id: string;
  cover: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  duration: string;
  views: string;
  date: string;
  category: string;
  categoryColor: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'choosify';
  sponsor?: string;
}

const platformIcons = {
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Tv, // Using Tv as a placeholder for TikTok
  choosify: Play
};

interface Props {
  review: CreatorReview;
  onClick?: () => void;
  className?: string;
}

export function CreatorReviewCard({ review, onClick, className }: Props) {
  const PlatformIcon = platformIcons[review.platform];

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative min-w-[280px] lg:min-w-[320px] h-[400px] rounded-[24px] overflow-hidden cursor-pointer group shadow-soft hover:shadow-high-density hover:-translate-y-1 transition-all duration-300 snap-start shrink-0 border-none",
        className
      )}
    >
      <img src={review.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={review.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 group-hover:bg-black/30 transition-colors duration-300" />
      
      {/* Top badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <span className={cn("text-[10px] font-bold text-white px-3 py-1 rounded-full tracking-wider shadow-md uppercase", review.categoryColor)}>
          {review.category}
        </span>
        {review.sponsor && (
          <span className="text-[10px] font-bold text-white px-3 py-1 rounded-full tracking-wider shadow-md uppercase bg-black/40 backdrop-blur-md border border-white/10">
            Sponsored
          </span>
        )}
      </div>

      {/* Platform Icon & Views/Date */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlatformIcon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-[#FF5B00] group-hover:border-[#FF5B00] transition-all duration-300 shadow-xl">
          <Play className="w-6 h-6 text-white ml-1 fill-white" />
        </div>
      </div>
      
      <div className="absolute bottom-5 left-5 right-5 text-white z-20">
        {/* Video Stats */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 uppercase tracking-widest mb-2">
          <span>{review.duration}</span>
          <span className="w-1 h-1 rounded-full bg-white/50"></span>
          <span>{review.views} views</span>
          <span className="w-1 h-1 rounded-full bg-white/50"></span>
          <span>{review.date}</span>
        </div>

        <h3 className="text-lg font-bold leading-tight mb-4 drop-shadow-md line-clamp-2 group-hover:text-white transition-colors">{review.title}</h3>
        
        <div className="flex items-center gap-3">
          <img src={review.creator.avatar} className="w-7 h-7 rounded-full border border-white/20" alt={review.creator.name} />
          <span className="text-sm font-bold text-white/90">{review.creator.name}</span>
          {review.creator.verified && (
             <ShieldCheck size={14} className="text-emerald-400 ml-auto group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all" />
          )}
        </div>
      </div>
    </div>
  );
}
