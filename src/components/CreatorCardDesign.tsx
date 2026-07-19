import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

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
    followers?: number | Record<string, string>;
    isHot?: boolean;
    isFeatured?: boolean;
    coverImage?: string;
    bio?: string;
    niche?: string;
  };
  onClick?: () => void;
}

const AVATAR_COLORS = [
  '#EB4501',
  '#2323FF',
  '#07A828',
  '#6C4CFF',
  '#000435',
  '#EB4501',
  '#0F766E',
  '#BE123C',
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function hashColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

/** Choosify.dc.html Creators List directory tile */
export const CreatorCardDesign = memo(function CreatorCardDesign({
  creator,
  onClick,
}: CreatorCardDesignProps) {
  const [isSaved, setIsSaved] = useState(false);
  const rating = creator.rating || 4.7;
  const reviewsCount = creator.reviews || 85;
  const followersRaw = creator.followers;
  const followers =
    typeof followersRaw === 'number'
      ? followersRaw
      : Math.max(
          1200,
          Math.round(
            reviewsCount * 48 + (Number(String(creator.id).replace(/\D/g, '')) || 0) % 9000,
          ),
        );
  const niche = creator.niche || creator.bestFor || creator.platforms?.[0] || 'Lifestyle';
  const initial = (creator.name || '?').charAt(0).toUpperCase();
  const bg = hashColor(String(creator.id || creator.name));
  const hasPhoto = Boolean(creator.avatar && (creator.avatar.startsWith('http') || creator.avatar.startsWith('/')));

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => {
      const next = !prev;
      toast.success(next ? 'Saved creator' : 'Removed from saved creators');
      return next;
    });
  };

  return (
    <Link
      to={`/creators/${creator.id}`}
      onClick={onClick}
      className="block w-full min-w-0 h-full bg-white rounded-[10px] border border-[#E8EDF2] p-5 text-center relative group select-none"
    >
      <button
        type="button"
        onClick={toggleWish}
        className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#E8EDF2] cursor-pointer z-10 shadow-sm"
        aria-label={isSaved ? 'Unsave creator' : 'Save creator'}
      >
        <Heart
          size={11}
          strokeWidth={1.6}
          className={cn(
            isSaved ? 'text-[#FF000D] fill-[#FF000D]' : 'text-[#CBD5E1]',
          )}
        />
      </button>

      {/* Avatar 72×72 + verified badge */}
      <div className="relative w-[72px] h-[72px] mx-auto mb-3">
        <div
          className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-white text-[20px] font-extrabold"
          style={{ background: bg }}
        >
          {hasPhoto ? (
            <img
              src={creator.avatar}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            initial
          )}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#2323FF] border-2 border-white flex items-center justify-center text-white text-[10px] font-extrabold">
          ✓
        </div>
      </div>

      <h3 className="text-[14px] font-extrabold text-[#1A1A2E] mb-0.5 truncate">{creator.name}</h3>
      <p className="text-[11.5px] text-[#9AA0AC] mb-3.5 truncate">{niche}</p>

      {/* Stats: Reviews | Followers | Rating */}
      <div className="flex items-center justify-between border-y border-[#F1F1F3] py-3 mb-4">
        <div className="flex-1 text-center">
          <div className="text-[14px] font-extrabold text-[#1A1A2E] leading-none">
            {formatNumber(reviewsCount)}
          </div>
          <div className="text-[9.5px] text-[#9AA0AC] mt-1">Reviews</div>
        </div>
        <div className="w-px h-[26px] bg-[#F1F1F3]" />
        <div className="flex-1 text-center">
          <div className="text-[14px] font-extrabold text-[#1A1A2E] leading-none">
            {formatNumber(followers)}
          </div>
          <div className="text-[9.5px] text-[#9AA0AC] mt-1">Followers</div>
        </div>
        <div className="w-px h-[26px] bg-[#F1F1F3]" />
        <div className="flex-1 text-center">
          <div className="text-[14px] font-extrabold text-[#1A1A2E] leading-none">
            {rating.toFixed(1)}
          </div>
          <div className="text-[9.5px] text-[#9AA0AC] mt-1">Rating</div>
        </div>
      </div>

      <span className="block w-full bg-[#2323FF] hover:brightness-110 text-white text-center py-[9px] rounded-lg text-[11.5px] font-bold transition-[filter]">
        View Profile
      </span>
    </Link>
  );
});
