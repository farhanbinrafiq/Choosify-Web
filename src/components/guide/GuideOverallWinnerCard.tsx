import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type GuideOverallWinnerCardProps = {
  name: string;
  image: string;
  badge?: string;
  rating?: string | number;
  reviews?: string | number;
  score?: string | number;
  scoreLabel?: string;
  checks?: string[];
  shopHref: string;
  className?: string;
};

const DEFAULT_CHECKS = [
  'Best Display Quality',
  'Top Tier Performance',
  'Excellent Camera System',
  'Long-term Software Support',
];

/**
 * Choosify.dc.html Guide Detail — compact Overall Winner strip
 * (image · identity · checklist · Choosify rating / Shop Now).
 */
export function GuideOverallWinnerCard({
  name,
  image,
  badge = 'BEST PICK',
  rating = '4.8',
  reviews = '0',
  score = '9.4',
  scoreLabel = 'EXCELLENT',
  checks = DEFAULT_CHECKS,
  shopHref,
  className,
}: GuideOverallWinnerCardProps) {
  const ratingText = String(rating);
  const reviewsText = String(reviews);
  const scoreText = String(score);
  const checkItems = checks.length > 0 ? checks.slice(0, 4) : DEFAULT_CHECKS;

  return (
    <div
      className={cn(
        'rounded-none px-[22px] py-[22px] sm:px-[26px] text-white mb-9',
        'grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto_auto]',
        'gap-5 lg:gap-[26px] items-center',
        className,
      )}
      style={{ background: 'linear-gradient(100deg,#1a1d2e,#241428)' }}
    >
      <div className="w-[110px] h-[110px] rounded-[10px] overflow-hidden shrink-0 bg-white/5">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="min-w-0 text-left">
        <div className="text-[11px] font-extrabold text-[#FBBF24] tracking-wide mb-2">
          🏆 OVERALL WINNER
        </div>
        <div className="bg-[#EB4501] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded inline-block mb-2">
          {badge}
        </div>
        <div className="text-[17px] font-extrabold mb-1 leading-snug">{name}</div>
        <div className="text-[11.5px] text-white/50">
          ★★★★★ {ratingText} ({reviewsText} reviews)
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-left">
        {checkItems.map((ck) => (
          <div
            key={ck}
            className="text-[11.5px] text-white/80 flex items-center gap-1.5"
          >
            <span className="text-[#07DD05] font-bold shrink-0">✓</span>
            {ck}
          </div>
        ))}
      </div>

      <div className="bg-white/[0.06] rounded-[10px] px-[14px] py-[14px] sm:px-[22px] text-center min-w-[100px] w-full sm:w-auto">
        <div className="text-[10px] text-white/50 mb-1">CHOOSIFY RATING</div>
        <div className="text-[26px] font-extrabold text-[#EB4501] leading-none mb-1">
          {scoreText}
        </div>
        <div className="text-[9.5px] text-white/40 mb-2">Out of 10</div>
        <div className="bg-[#2323FF] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded inline-block mb-2.5">
          {scoreLabel}
        </div>
        <Link
          to={shopHref}
          className="block w-full bg-[#EB4501] hover:bg-[#CF4400] text-white border-0 py-2 rounded-md text-[11px] font-extrabold transition-colors"
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}
