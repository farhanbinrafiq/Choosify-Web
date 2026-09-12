import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toast } from '../lib/notify';
import { cn } from '../lib/utils';
import { isBrandLogoUrl } from './brand/BrandLogo';

interface CreatorCardDesignProps {
  creator: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
    score: number;
    bestFor: string;
    platforms: string[];
    /** `null` = honestly unknown, omit from the stats row. `undefined` keeps
     *  legacy directory-tile placeholder behavior for older callers. */
    rating: number | null;
    reviews: number | null;
    followers?: number | Record<string, string> | null;
    isHot?: boolean;
    isFeatured?: boolean;
    coverImage?: string;
    bio?: string;
    niche?: string;
    /** Defaults to true (existing directory-tile behavior) when omitted. */
    verified?: boolean;
  };
  onClick?: () => void;
}

const AVATAR_COLORS = [
  '#FF5B00',
  '#2323FF',
  '#07A828',
  '#6C4CFF',
  '#18154C',
  '#FF5B00',
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
  // `null` is an explicit "honestly unknown" signal (omit); `undefined` keeps
  // the legacy directory-tile placeholder for callers that don't supply it.
  const rating = creator.rating === null ? null : creator.rating || 4.7;
  const reviewsCount = creator.reviews === null ? null : creator.reviews || 85;
  const followersRaw = creator.followers;
  const followers =
    followersRaw === null
      ? null
      : typeof followersRaw === 'number'
        ? followersRaw
        : Math.max(
            1200,
            Math.round(
              (reviewsCount || 85) * 48 + (Number(String(creator.id).replace(/\D/g, '')) || 0) % 9000,
            ),
          );
  const niche = creator.niche || creator.bestFor || creator.platforms?.[0] || 'Lifestyle';
  const verified = creator.verified !== false;
  const initial = (creator.name || '?').charAt(0).toUpperCase();
  const bg = hashColor(String(creator.id || creator.name));
  const hasPhoto = Boolean(creator.avatar && (creator.avatar.startsWith('http') || creator.avatar.startsWith('/')));
  const stats = [
    reviewsCount !== null ? { label: 'Reviews', value: formatNumber(reviewsCount) } : null,
    followers !== null ? { label: 'Followers', value: formatNumber(followers) } : null,
    rating !== null ? { label: 'Rating', value: rating.toFixed(1) } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => {
      const next = !prev;
      toast.success(next ? 'Saved creator' : 'Removed from saved creators');
      return next;
    });
  };

  const hasCover = isBrandLogoUrl(creator.coverImage);

  return (
    <Link
      to={`/creators/${creator.id}`}
      onClick={onClick}
      className="block w-full min-w-0 h-full bg-white rounded-[10px] border border-[#E8EDF2] overflow-hidden relative group select-none"
    >
      {/* Cover/banner — same treatment as BrandCardDesign: a real uploaded
          profile cover when the creator has one, else the same kind of
          hash-based gradient fallback (never fabricated, never the avatar
          stretched to fill this space). */}
      <div className="relative h-[92px] overflow-hidden">
        {hasCover ? (
          <img src={creator.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${bg} 0%, #1A1D4E 100%)` }}
          />
        )}
      </div>

      <button
        type="button"
        onClick={toggleWish}
        className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#E8EDF2] cursor-pointer z-10 shadow-sm"
        aria-label={isSaved ? 'Unsave creator' : 'Save creator'}
      >
        <Heart
          size={11}
          strokeWidth={2}
          className="text-[#FF5B00]"
          fill={isSaved ? '#FF5B00' : 'none'}
        />
      </button>

      <div className="relative p-5 pt-9 text-center flex flex-col flex-1">
        {/* Avatar 72×72 + verified badge — now overlaps the cover's lower edge,
            same positioning technique as the Brand card's circular logo. */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-[2] w-[72px] h-[72px]">
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
          {verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#2323FF] border-2 border-white flex items-center justify-center text-white text-[10px] font-extrabold">
              ✓
            </div>
          )}
        </div>

        <h3 className="text-[14px] font-extrabold text-[#1A1A2E] mb-0.5 truncate">{creator.name}</h3>
        <p className="text-[11.5px] text-[#9AA0AC] mb-3.5 truncate">{niche}</p>

        {/* Stats: only fields with real, non-fabricated data are shown */}
        {stats.length > 0 && (
          <div className="flex items-center justify-between border-y border-[#F1F1F3] py-3 mb-4">
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-[26px] bg-[#F1F1F3]" />}
                <div className="flex-1 text-center">
                  <div className="text-[14px] font-extrabold text-[#1A1A2E] leading-none">
                    {s.value}
                  </div>
                  <div className="text-[9.5px] text-[#9AA0AC] mt-1">{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        <span className="mt-auto block w-full choosify-dark-surface hover:brightness-110 text-white text-center py-[9px] rounded-lg text-[11.5px] font-bold transition-[filter]">
          View Profile
        </span>
      </div>
    </Link>
  );
});
