import React from 'react';
import { Bookmark, Heart, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  useCardEngagement,
  type EngagementEntityType,
} from '../hooks/useCardEngagement';

type CardEngagementStripProps = {
  entityType: EngagementEntityType;
  entityId: string | number;
  payload?: Record<string, unknown>;
  defaultLoveCount?: number;
  defaultSaveCount?: number;
  variant?: 'card' | 'hero';
  showShare?: boolean;
  shareUrl?: string;
  className?: string;
  onClickCapture?: (event: React.MouseEvent) => void;
};

export function CardEngagementStrip({
  entityType,
  entityId,
  payload,
  defaultLoveCount,
  defaultSaveCount,
  variant = 'card',
  showShare = false,
  shareUrl,
  className,
  onClickCapture,
}: CardEngagementStripProps) {
  const {
    loveCount,
    saveCount,
    hasLoved,
    isSaved,
    toggleLove,
    toggleSave,
    share,
  } = useCardEngagement({
    entityType,
    entityId,
    payload,
    defaultLoveCount,
    defaultSaveCount,
  });

  if (variant === 'hero') {
    return (
      <div
        className={cn('flex flex-wrap items-center justify-center gap-2.5', className)}
        onClick={onClickCapture}
      >
        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <span className="text-[#FF000D] text-lg font-space font-black">♥</span>
          <span>{loveCount.toLocaleString()} Love Reacts</span>
          <button
            type="button"
            onClick={toggleLove}
            className={cn(
              'h-9 px-4 rounded-lg font-bold text-[12px] tracking-tight flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm whitespace-nowrap',
              hasLoved
                ? 'bg-[#FF000D] text-white border border-[#FF000D]'
                : 'bg-white text-[#1A1A2E] border border-white hover:bg-white/95',
            )}
          >
            <Heart size={13} className={cn(hasLoved && 'fill-current')} />
            {hasLoved ? 'Loved!' : 'Love React'}
          </button>
        </div>

        <div className="hidden sm:block h-4 w-px bg-white/20 shrink-0" aria-hidden="true" />

        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <Bookmark size={14} className="text-[#EB4501]" />
          <span>{saveCount.toLocaleString()} Saved</span>
          <button
            type="button"
            onClick={toggleSave}
            className={cn(
              'h-9 px-4 rounded-lg font-bold text-[12px] tracking-tight flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm whitespace-nowrap border',
              isSaved
                ? 'bg-white text-[#EB4501] border-white'
                : 'bg-[#1A1D4E] text-white border-white/15 hover:bg-[#252a6e]',
            )}
          >
            <Bookmark size={13} className={cn(isSaved && 'fill-current')} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        {showShare ? (
          <>
            <div className="hidden sm:block h-4 w-px bg-white/20 shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={(event) => share(event, shareUrl)}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Share"
            >
              <Share2 size={14} />
            </button>
          </>
        ) : null}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-[#e8edf2]/80',
          className,
        )}
        onClick={onClickCapture}
      >
        <button
          type="button"
          onClick={toggleLove}
          className={cn(
            'inline-flex items-center gap-1.5 min-h-8 px-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 bg-transparent',
            hasLoved ? 'text-[#FF000D]' : 'text-[#8a9bb0] hover:text-[#FF000D]',
          )}
        >
          <Heart size={14} className={cn(hasLoved && 'fill-current')} />
          <span>{loveCount.toLocaleString()}</span>
        </button>

        <button
          type="button"
          onClick={toggleSave}
          className={cn(
            'inline-flex items-center gap-1.5 min-h-8 px-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 bg-transparent',
            isSaved ? 'text-[#FF000D]' : 'text-[#8a9bb0] hover:text-[#FF000D]',
          )}
        >
          <Bookmark size={14} className={cn(isSaved && 'fill-current')} />
          <span>{saveCount.toLocaleString()}</span>
        </button>

        {showShare ? (
          <button
            type="button"
            onClick={(event) => share(event, shareUrl)}
            className="inline-flex items-center gap-1.5 min-h-8 px-1 text-[11px] font-bold uppercase tracking-wider text-[#8a9bb0] hover:text-[#CF4400] transition-colors cursor-pointer border-0 bg-transparent"
          >
            <Share2 size={14} />
          </button>
        ) : (
          <span className="text-[9px] font-semibold text-[#c5d0dc] uppercase tracking-widest">
            Choosify
          </span>
        )}
      </div>
    );
  }

  return null;
}
