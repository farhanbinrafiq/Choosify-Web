import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Package } from 'lucide-react';
import type { ViralTodayItem } from '../../../utils/homeViralToday';
import { DcHomePanel } from '../DcHomePanel';
import { ViewAllLink } from '../../design/ViewAllLink';
import { cn } from '../../../lib/utils';

interface HomeSpotlightPreviewSectionProps {
  items: ViralTodayItem[];
}

const AVATAR_COLORS = ['#EB4501', '#2323FF', '#07A828', '#EB4501', '#000435', '#7C3AED'];

/** Choosify.dc.html — "Viral Today" YouTube grid + Reels strip */
export function HomeSpotlightPreviewSection({ items }: HomeSpotlightPreviewSectionProps) {
  const { youtube, reels } = useMemo(() => {
    const yt = items.filter((i) => i.kind === 'youtube').slice(0, 4);
    const rl = items.filter((i) => i.kind === 'reel').slice(0, 6);
    // If one lane is empty, borrow from the other so the section never looks broken
    return {
      youtube: yt.length ? yt : items.slice(0, 4).map((i) => ({ ...i, kind: 'youtube' as const })),
      reels: rl.length ? rl : items.slice(0, 6).map((i) => ({ ...i, kind: 'reel' as const })),
    };
  }, [items]);

  if (!youtube.length && !reels.length) return null;

  return (
    <DcHomePanel id="section-spotlight-preview">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2
          id="section-spotlight-preview-heading"
          className="flex items-center gap-2 text-[19px] font-extrabold text-[#1A1A2E]"
        >
          <span className="text-[#FF000D] text-[17px]" aria-hidden>
            ✦
          </span>
          Viral Today
        </h2>
        <ViewAllLink href="/spotlight" label="VIEW ALL ›" />
      </div>

      {youtube.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {youtube.map((card, i) => (
            <Link key={`yt-${card.id}`} to={card.href} className="min-w-0 group">
              <div className="relative aspect-video rounded-[10px] overflow-hidden mb-2.5 bg-[#F4F7F9]">
                <img
                  src={card.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-[#FF000D] text-white text-[8.5px] font-extrabold px-2 py-0.5 rounded pointer-events-none">
                  YOUTUBE
                </span>
                <button
                  type="button"
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white border-0"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Save"
                >
                  <Bookmark size={11} />
                </button>
                {card.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                    {card.duration}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[42px] h-[42px] rounded-full bg-black/35 border-[1.5px] border-white/90 flex items-center justify-center">
                    <div
                      className="w-0 h-0 ml-0.5"
                      style={{
                        borderStyle: 'solid',
                        borderWidth: '7px 0 7px 11px',
                        borderColor: 'transparent transparent transparent #fff',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {card.channel.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-bold text-[#1A1A2E] leading-snug line-clamp-2 mb-1">
                    {card.title}
                  </div>
                  <div className="text-[11px] text-[#4B5563] flex items-center gap-1">
                    {card.channel}
                    <span className="text-[#2323FF]">✓</span>
                  </div>
                  {(card.views || card.time) && (
                    <div className="text-[10.5px] text-[#9AA0AC]">
                      {[card.views, card.time].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-bold text-[#4B5563]">
                <Package size={12} />
                {card.productCount} Products
              </div>
            </Link>
          ))}
        </div>
      )}

      {reels.length > 0 && (
        <div className="flex flex-nowrap overflow-x-auto gap-3.5 mb-8 snap-x snap-mandatory pb-1 scrollbar-hide">
          {reels.map((card, i) => (
            <Link
              key={`reel-${card.id}`}
              to={card.href}
              className="w-[150px] shrink-0 snap-start"
            >
              <div className="relative aspect-[9/16] rounded-[10px] overflow-hidden mb-2 bg-[#F4F7F9]">
                <img
                  src={card.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-[#FF000D] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded pointer-events-none flex items-center gap-0.5">
                  ⏵ REELS
                </span>
                <button
                  type="button"
                  className="absolute top-2 right-2 w-[22px] h-[22px] rounded-full bg-black/40 flex items-center justify-center text-white z-[1] border-0"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Save"
                >
                  <Bookmark size={10} />
                </button>
                {card.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                    {card.duration}
                  </span>
                )}
              </div>
              <div className="text-[11.5px] font-bold text-[#1A1A2E] leading-snug line-clamp-2 mb-1.5">
                {card.title}
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-[#4B5563] mb-1">
                <div
                  className="w-5 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                />
                <span className="truncate">{card.channel}</span>
                <span className="text-[#2323FF]">✓</span>
              </div>
              {card.likes && (
                <div className="text-[10.5px] text-[#9AA0AC]">♡ {card.likes}</div>
              )}
              <div className={cn('flex items-center gap-1 mt-2 text-[10px] font-bold text-[#4B5563]')}>
                <Package size={11} />
                {card.productCount} Products
              </div>
            </Link>
          ))}
        </div>
      )}
    </DcHomePanel>
  );
}
