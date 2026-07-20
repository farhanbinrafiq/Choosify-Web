import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PLACEHOLDER_IMAGE } from '../../constants';
import type {
  CommerceCardVariant,
  UniversalCommerceCardProps,
} from './universalCommerceCardTypes';

function formatCompactDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatCount(value?: string | number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

const MEDIA_ASPECT: Record<CommerceCardVariant, string> = {
  'landscape-video': 'aspect-video',
  'portrait-reel': 'aspect-[9/16]',
  blog: 'aspect-[4/3]',
  image: 'aspect-video',
  live: 'aspect-video',
  guide: 'aspect-[4/3]',
  square: 'aspect-square',
};

const AVATAR_COLORS = ['#EB4501', '#2323FF', '#07A828', '#EB4501', '#000435', '#6C4CFF'];

function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

interface CommerceCardMediaProps {
  variant: CommerceCardVariant;
  image?: string;
  videoUrl?: string;
  liveEmbedUrl?: string;
  badgeLabel: string;
  readTime?: string;
  duration?: string;
  hasVideo: boolean;
  isHovering: boolean;
  title?: string;
  viewersLabel?: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onBookmarkClick: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

/** Choosify.dc.html — Viral Today / Discover media chrome */
function CommerceCardMedia({
  variant,
  image,
  videoUrl,
  liveEmbedUrl,
  badgeLabel,
  readTime,
  duration,
  hasVideo,
  isHovering,
  title,
  viewersLabel,
  videoRef,
  onImageError,
  onBookmarkClick,
  isSaved = false,
}: CommerceCardMediaProps) {
  const isReel = variant === 'portrait-reel';
  const isBlog = variant === 'blog' || variant === 'guide';
  const isLive = variant === 'live';
  const showPlay = variant === 'landscape-video' || variant === 'image' || (hasVideo && !isReel);

  const badgeText = isBlog
    ? (badgeLabel || readTime || 'GUIDE')
    : isLive
      ? 'LIVE'
      : isReel
        ? `⏵ ${(badgeLabel || 'REELS').toUpperCase().replace(/^⏵\s*/, '')}`
        : (badgeLabel || 'YOUTUBE').toUpperCase();

  return (
    <div
      className={cn(
        'overflow-hidden relative bg-[#F4F7F9] shrink-0 w-full rounded-[10px]',
        MEDIA_ASPECT[variant],
      )}
    >
      {liveEmbedUrl && isLive ? (
        <iframe src={liveEmbedUrl} title={title ?? 'Live'} className="w-full h-full" loading="lazy" />
      ) : hasVideo ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={image}
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]"
          />
          {showPlay && (
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-all duration-500 pointer-events-none',
                isHovering ? 'opacity-0' : 'opacity-100',
              )}
            >
              <div className="w-[42px] h-[42px] rounded-full bg-black/35 flex items-center justify-center border-[1.5px] border-white/90">
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
          )}
        </div>
      ) : (
        <>
          <img
            src={image || PLACEHOLDER_IMAGE}
            loading="lazy"
            onError={onImageError}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            alt=""
          />
          {showPlay && (
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
          )}
        </>
      )}

      <div className="absolute top-2 left-2 z-10 flex gap-1.5">
        <div
          className={cn(
            'px-2 py-0.5 rounded text-white font-extrabold w-max pointer-events-none',
            isReel ? 'text-[8px] bg-[#FF000D]' : 'text-[8.5px] bg-[#FF000D]',
            isBlog && 'bg-[#F59E0B] text-[8px] text-[#1A1A2E]',
            isLive && 'bg-[#FF000D] text-[9px]',
          )}
        >
          {badgeText}
        </div>
        {isLive && viewersLabel && (
          <div className="bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded pointer-events-none">
            👁 {viewersLabel}
          </div>
        )}
      </div>

      <button
        type="button"
        className={cn(
          'absolute top-2 right-2 z-10 rounded-full bg-white shadow-sm flex items-center justify-center border-0 cursor-pointer',
          isReel ? 'w-[22px] h-[22px]' : 'w-6 h-6',
        )}
        onClick={onBookmarkClick}
        aria-label={isSaved ? 'Unsave' : 'Save'}
        aria-pressed={isSaved}
      >
        <Heart
          size={isReel ? 10 : 11}
          className="text-[#EB4501]"
          strokeWidth={2}
          fill={isSaved ? '#EB4501' : 'none'}
        />
      </button>

      {duration && !isLive && (
        <div
          className={cn(
            'absolute bottom-2 right-2 bg-black/75 text-white font-bold rounded pointer-events-none z-10',
            isReel ? 'text-[9.5px] px-1.5 py-0.5' : 'text-[10px] px-1.5 py-0.5',
          )}
        >
          {duration}
        </div>
      )}
    </div>
  );
}

/** LE-006 — brand/creator identity above media (opt-in; not used on dc Viral Today tiles) */
function CommerceCardPublisherHeader({
  name,
  avatar,
  typeLabel,
  date,
  isVerified,
  isSponsored,
  className,
}: {
  name?: string;
  avatar?: string;
  typeLabel?: string;
  date?: string;
  isVerified?: boolean;
  isSponsored?: boolean;
  className?: string;
}) {
  if (!name) return null;
  const subline = isSponsored ? 'Sponsored' : (date ?? typeLabel);

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      {avatar ? (
        <img
          src={avatar}
          alt=""
          className="w-7 h-7 rounded-full object-cover border border-[#E8EDF2] shrink-0"
          loading="lazy"
        />
      ) : (
        <span
          className="w-7 h-7 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center shrink-0"
          style={{ background: avatarColor(name) }}
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[11px] font-bold text-[#1A1A2E] truncate leading-tight">{name}</span>
          {isVerified && <span className="text-[#2323FF] text-[10px] shrink-0">✓</span>}
        </div>
        {subline && (
          <p className="text-[9px] text-[#9AA0AC] uppercase tracking-wide leading-tight truncate">
            {subline}
          </p>
        )}
      </div>
      {isSponsored && (
        <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider text-[#9AA0AC] border border-[#E8EDF2] rounded px-1.5 py-0.5">
          Sponsored
        </span>
      )}
    </div>
  );
}

function ProductsChip({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 mt-2.5 text-[11px] font-bold text-[#4B5563]">
      <Package size={12} strokeWidth={1.8} />
      {count} Products
    </div>
  );
}

export function UniversalCommerceCard({
  model,
  variant,
  mode = 'editorial',
  showPublisherHeader = false,
  onNavigate,
  className,
  compactMedia = false,
}: UniversalCommerceCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isReel = variant === 'portrait-reel';
  const isBlog = variant === 'blog' || variant === 'guide';
  const isLive = variant === 'live';
  const isLandscape = variant === 'landscape-video' || variant === 'image' || variant === 'square';
  const hasVideo = Boolean(model.videoUrl);
  const formattedDate = formatCompactDate(model.publishedAt);
  const viewLabel = formatCount(model.views) ?? formatCount(model.popularityScore);
  const likesLabel = formatCount(model.likes);
  const publisherName = model.creatorName ?? model.brandName;
  const channelName = model.creatorName ?? model.brandName ?? 'Choosify';
  const hasPublisherHeader = showPublisherHeader && Boolean(publisherName);
  const productCount = model.product ? 1 : 0;
  const timeLabel = formattedDate ?? 'Recently';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const startPreview = useCallback(() => {
    if (!hasVideo) return;
    setIsHovering(true);
    videoRef.current?.play().catch(() => undefined);
  }, [hasVideo]);

  const stopPreview = useCallback(() => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const stopBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  /** Discover Blog Stories — horizontal 40% square | 60% text */
  if (compactMedia && isBlog) {
    const guideBadge = model.badgeLabel || 'GUIDE';
    return (
      <Link
        to={model.href}
        onClick={onNavigate}
        className={cn(
          'group cursor-pointer flex flex-row items-start gap-3 w-full min-w-0 text-left no-underline',
          className,
        )}
        aria-label={model.title}
      >
        <div className="relative w-[40%] shrink-0 aspect-square rounded-[10px] overflow-hidden bg-[#F4F7F9]">
          <img
            src={model.image || PLACEHOLDER_IMAGE}
            loading="lazy"
            onError={handleImageError}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            alt=""
          />
          <div className="absolute top-1.5 left-1.5 z-10">
            <div className="px-1.5 py-0.5 rounded bg-[#F59E0B] text-[#1A1A2E] text-[8px] font-extrabold w-max pointer-events-none">
              {guideBadge}
            </div>
          </div>
          <button
            type="button"
            className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border-0 cursor-pointer"
            onClick={stopBookmark}
            aria-label={isSaved ? 'Unsave' : 'Save'}
            aria-pressed={isSaved}
          >
            <Heart
              size={11}
              className="text-[#EB4501]"
              strokeWidth={2}
              fill={isSaved ? '#EB4501' : 'none'}
            />
          </button>
        </div>
        <div className="w-[60%] min-w-0 flex flex-col justify-center gap-1 py-0.5 self-stretch">
          <div className="text-[12px] font-bold text-[#1A1A2E] leading-snug line-clamp-3 group-hover:text-[#CF4400] transition-colors">
            {model.title}
          </div>
          <div className="text-[10.5px] text-[#9AA0AC]">
            By {channelName} <span className="text-[#2323FF]">✓</span>
            {model.readTime ? ` · ${model.readTime}` : ''}
          </div>
        </div>
      </Link>
    );
  }

  const cardShell = cn(
    'group cursor-pointer block flex flex-col h-full w-full text-left min-w-0',
    isBlog || isLive
      ? cn(
          'bg-white rounded-[10px] overflow-hidden',
          mode === 'commerce' && 'border border-[#E8EDF2]',
        )
      : 'bg-transparent',
    isReel ? 'max-w-[150px]' : '',
    className,
  );

  /** Choosify.dc.html YouTube / landscape body */
  const landscapeBody = (
    <>
      <div className="flex gap-2.5">
        {model.creatorAvatar ? (
          <img
            src={model.creatorAvatar}
            alt=""
            className="w-7 h-7 rounded-full object-cover shrink-0"
            loading="lazy"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
            style={{ background: avatarColor(channelName) }}
          >
            {channelName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[12.5px] font-bold text-[#1A1A2E] leading-snug line-clamp-2 mb-1">
            {model.title}
          </div>
          <div className="text-[11px] text-[#4B5563] flex items-center gap-1">
            <span className="truncate">{channelName}</span>
            {(model.isVerified !== false) && <span className="text-[#2323FF] shrink-0">✓</span>}
          </div>
          {(viewLabel || timeLabel) && (
            <div className="text-[10.5px] text-[#9AA0AC]">
              {[viewLabel, timeLabel].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      </div>
      {(mode === 'commerce' || mode === 'preview' || productCount > 0) && (
        <ProductsChip count={productCount} />
      )}
    </>
  );

  /** Choosify.dc.html Reels body — title under media, no overlay */
  const reelBody = (
    <>
      <div className="text-[11.5px] font-bold text-[#1A1A2E] leading-snug line-clamp-2 mb-1.5">
        {model.title}
      </div>
      {publisherName && (
        <div className="flex items-center gap-1.5 text-[10.5px] text-[#4B5563] mb-1 min-w-0">
          {model.creatorAvatar ? (
            <img
              src={model.creatorAvatar}
              alt=""
              className="w-5 h-5 rounded-full object-cover shrink-0"
              loading="lazy"
            />
          ) : (
            <div
              className="w-5 h-5 rounded-full shrink-0"
              style={{ background: avatarColor(publisherName) }}
            />
          )}
          <span className="truncate">{publisherName}</span>
          <span className="text-[#2323FF] shrink-0">✓</span>
        </div>
      )}
      {likesLabel && <div className="text-[10.5px] text-[#9AA0AC]">♡ {likesLabel}</div>}
      {(mode === 'commerce' || mode === 'preview' || productCount > 0) && (
        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-[#4B5563]">
          <Package size={11} strokeWidth={1.8} />
          {productCount} Products
        </div>
      )}
    </>
  );

  /** Choosify.dc.html Blog Stories sidebar tile */
  const blogBody = (
    <>
      <div className="text-[12px] font-bold text-[#1A1A2E] leading-snug line-clamp-2 mb-1.5">
        {model.title}
      </div>
      <div className="text-[10.5px] text-[#9AA0AC]">
        By {channelName} <span className="text-[#2323FF]">✓</span>
        {model.readTime ? ` · ${model.readTime}` : ''}
      </div>
    </>
  );

  /** Discover Live — compact vertical fallback of horizontal live card */
  const liveBody = (
    <>
      <div className="text-[15px] font-bold text-[#1A1A2E] mb-1.5 line-clamp-2">{model.title}</div>
      {model.excerpt && (
        <p className="text-[12px] text-[#6B7280] mb-3 line-clamp-2">{model.excerpt}</p>
      )}
      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
            style={{ background: avatarColor(channelName) }}
          >
            {channelName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-bold text-[#1A1A2E] flex items-center gap-1 truncate">
              {channelName} <span className="text-[#2323FF]">✓</span>
            </div>
            {model.publisherTypeLabel && (
              <div className="text-[10.5px] text-[#9AA0AC] truncate">{model.publisherTypeLabel}</div>
            )}
          </div>
        </div>
        <span className="shrink-0 bg-[#FF000D] text-white text-[11.5px] font-bold px-4 py-2 rounded-md">
          WATCH LIVE
        </span>
      </div>
      <ProductsChip count={productCount} />
    </>
  );

  const body =
    isReel ? reelBody : isBlog ? blogBody : isLive ? liveBody : landscapeBody;

  return (
    <Link
      to={model.href}
      onClick={onNavigate}
      className={cardShell}
      onMouseEnter={hasVideo ? startPreview : undefined}
      onMouseLeave={hasVideo ? stopPreview : undefined}
      aria-label={model.title}
    >
      {hasPublisherHeader && (
        <CommerceCardPublisherHeader
          name={publisherName}
          avatar={model.creatorAvatar}
          typeLabel={model.publisherTypeLabel}
          date={formattedDate}
          isVerified={model.isVerified}
          isSponsored={model.isSponsored}
          className={isReel ? 'pb-2.5' : 'px-4 pt-3 pb-2.5'}
        />
      )}

      <div className={cn(isReel && 'shrink-0', isBlog || isLive ? 'p-0' : 'mb-2.5')}>
        <CommerceCardMedia
          variant={variant}
          image={model.image}
          videoUrl={model.videoUrl}
          liveEmbedUrl={model.liveEmbedUrl}
          badgeLabel={model.badgeLabel}
          readTime={model.readTime}
          duration={model.duration}
          hasVideo={hasVideo}
          isHovering={isHovering}
          title={model.title}
          viewersLabel={viewLabel}
          videoRef={videoRef}
          onImageError={handleImageError}
          onBookmarkClick={stopBookmark}
          isSaved={isSaved}
        />
      </div>

      <div
        className={cn(
          'flex-1 flex flex-col min-w-0',
          isReel && 'pt-0',
          isBlog && 'px-0 pt-2.5 pb-3.5',
          isLive && 'p-4',
          isLandscape && !hasPublisherHeader && '',
        )}
      >
        {body}
      </div>
    </Link>
  );
}
