import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Eye,
  Heart,
  Instagram,
  LucidePenTool,
  Play,
  Share2,
  Youtube,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PLACEHOLDER_IMAGE } from '../../constants';
import type {
  CommerceCardVariant,
  ContentCardPlatform,
  UniversalCommerceCardProps,
} from './universalCommerceCardTypes';

function PlatformIcon({ platform, size = 14 }: { platform: ContentCardPlatform; size?: number }) {
  if (platform === 'instagram') return <Instagram size={size} />;
  if (platform === 'youtube') return <Youtube size={size} />;
  if (platform === 'live') return <Play size={size} />;
  return <LucidePenTool size={size} />;
}

function formatCompactDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCount(value?: string | number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

const MEDIA_ASPECT: Record<CommerceCardVariant, string> = {
  'landscape-video': 'aspect-[16/10]',
  'portrait-reel': 'aspect-[9/16]',
  blog: 'aspect-[16/10]',
  image: 'aspect-[16/10]',
  live: 'aspect-[16/10]',
  guide: 'aspect-[16/10]',
  square: 'aspect-square',
};

interface CommerceCardMediaProps {
  variant: CommerceCardVariant;
  image?: string;
  videoUrl?: string;
  liveEmbedUrl?: string;
  badgeLabel: string;
  readTime?: string;
  platform: ContentCardPlatform;
  duration?: string;
  hasVideo: boolean;
  isHovering: boolean;
  title?: string;
  showOverlayTitle: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

function CommerceCardMedia({
  variant,
  image,
  videoUrl,
  liveEmbedUrl,
  badgeLabel,
  readTime,
  platform,
  duration,
  hasVideo,
  isHovering,
  title,
  showOverlayTitle,
  videoRef,
  onImageError,
}: CommerceCardMediaProps) {
  const isReel = variant === 'portrait-reel';
  const isBlog = variant === 'blog' || variant === 'guide';

  return (
    <div
      className={cn(
        'overflow-hidden relative bg-gray-50 shrink-0 w-full',
        MEDIA_ASPECT[variant],
        !isReel && 'bg-slate-950',
      )}
    >
      {liveEmbedUrl && variant === 'live' ? (
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
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-all duration-500',
              isHovering ? 'opacity-0' : 'opacity-100',
            )}
          >
            <div
              className={cn(
                'rounded-full bg-play-red flex items-center justify-center border border-white/20',
                isReel ? 'w-12 h-12' : 'w-14 h-14',
              )}
            >
              <Play className="text-white fill-white ml-0.5" size={isReel ? 18 : 20} />
            </div>
          </div>
          {duration && (
            <div
              className={cn(
                'absolute bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white',
                isReel ? 'bottom-4 right-4' : 'bottom-4 right-4',
              )}
            >
              {duration}
            </div>
          )}
        </div>
      ) : (
        <img
          src={image || PLACEHOLDER_IMAGE}
          loading="lazy"
          onError={onImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
          alt=""
        />
      )}

      {isReel && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-10" />
      )}

      <div className={cn('absolute top-4 left-4 z-10', isReel && 'top-4 left-4 z-20')}>
        <div
          className={cn(
            'bg-white px-2.5 py-1 rounded flex items-center gap-1.5 border border-gray-100 w-max',
            isReel && 'shadow-none',
          )}
        >
          {isBlog ? (
            <>
              <BookOpen size={11} className="text-orange-primary" />
              <span className="text-[9px] font-mono text-gray-500 leading-none">
                {readTime ?? badgeLabel}
              </span>
            </>
          ) : (
            <span className="text-[9px] font-semibold text-black uppercase tracking-wider leading-none">
              {badgeLabel}
            </span>
          )}
        </div>
      </div>

      <div className={cn('absolute top-4 right-4 z-10', isReel && 'z-20')}>
        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
          <PlatformIcon platform={platform} size={14} />
        </div>
      </div>

      {showOverlayTitle && isReel && title && (
        <div className="absolute inset-x-0 bottom-0 p-4 z-20 pt-20 pointer-events-none">
          <h3 className="text-sm font-semibold text-white tracking-tight leading-snug mb-1.5 group-hover:text-orange-primary transition-colors text-left line-clamp-2">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}

export function UniversalCommerceCard({
  model,
  variant,
  mode = 'editorial',
  onNavigate,
  className,
}: UniversalCommerceCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const isReel = variant === 'portrait-reel';
  const isCommerce = mode === 'commerce';
  const isPreview = mode === 'preview';
  const showReelBody = isReel && (isCommerce || isPreview);
  const hasVideo = Boolean(model.videoUrl);
  const showOverlayTitle = isReel;
  const ctaLabel = model.ctaLabel ?? model.primaryCta?.label ?? 'Explore';
  const formattedDate = formatCompactDate(model.publishedAt);
  const viewLabel = formatCount(model.views) ?? formatCount(model.popularityScore);

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

  const cardShell = cn(
    'group cursor-pointer block bg-white rounded-[5px] border border-[#e8edf2] hover:scale-[1.01] transition-all duration-300 flex flex-col h-full w-full text-left',
    isReel ? 'p-3 max-w-[285px] sm:max-w-[320px] md:max-w-none mx-auto' : 'overflow-hidden',
    className,
  );

  const bodyContent = (
    <>
      {!showOverlayTitle && (
        <div className="flex-1 flex flex-col text-left min-w-0">
          <h3 className="text-xs font-semibold uppercase text-[#1a1a2e] group-hover:text-orange-primary transition-colors leading-snug line-clamp-2 mb-1">
            {model.title}
          </h3>

          {model.excerpt && (
            <p className="text-gray-400 text-[11px] leading-relaxed mb-2 line-clamp-2">{model.excerpt}</p>
          )}
        </div>
      )}

      {(isCommerce || isPreview) && model.product && (
        <div className="flex items-center gap-2 mb-2 min-w-0">
          {model.product.image && (
            <img
              src={model.product.image}
              alt=""
              className="w-8 h-8 rounded object-cover border border-gray-100 shrink-0"
              loading="lazy"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-[#1a1a2e] line-clamp-1">{model.product.title}</p>
            <p className="text-[10px] font-black text-orange-primary">
              ৳{model.product.price.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {(isCommerce || isPreview) && (model.creatorName || model.creatorAvatar || formattedDate) && (
        <div className="flex items-center gap-2 mb-2 min-w-0">
          {model.creatorAvatar ? (
            <img
              src={model.creatorAvatar}
              alt=""
              className="w-5 h-5 rounded-full object-cover border border-gray-100 shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-100 shrink-0" aria-hidden />
          )}
          <div className="min-w-0 flex-1 flex items-center gap-2 text-[10px] text-gray-400">
            {model.creatorName && (
              <span className="font-semibold text-gray-500 truncate">{model.creatorName}</span>
            )}
            {formattedDate && <span className="truncate">{formattedDate}</span>}
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto gap-2">
        <div className="flex items-center gap-3 sm:gap-4 text-[10px] font-mono text-gray-400 min-w-0">
          <span className="flex items-center gap-1">
            <Heart size={13} className="text-rose-500" /> {formatCount(model.likes) ?? viewLabel ?? '12K'}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} /> {viewLabel ?? formatCount(model.likes) ?? '1.2k'}
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Share2 size={13} /> {formatCount(model.shares) ?? '450'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(isCommerce || isPreview) && (
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 group-hover:text-orange-primary transition-colors hidden sm:inline">
              {ctaLabel}
            </span>
          )}
          <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-600 group-hover:bg-orange-primary group-hover:text-white transition-colors flex items-center justify-center">
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link
      to={model.href}
      onClick={onNavigate}
      className={cardShell}
      onMouseEnter={hasVideo ? startPreview : undefined}
      onMouseLeave={hasVideo ? stopPreview : undefined}
      aria-label={model.title}
    >
      <div className={cn(isReel && 'rounded-[5px] overflow-hidden relative bg-slate-950 shrink-0')}>
        <CommerceCardMedia
          variant={variant}
          image={model.image}
          videoUrl={model.videoUrl}
          liveEmbedUrl={model.liveEmbedUrl}
          badgeLabel={model.badgeLabel}
          readTime={model.readTime}
          platform={model.platform}
          duration={model.duration}
          hasVideo={hasVideo}
          isHovering={isHovering}
          title={model.title}
          showOverlayTitle={showOverlayTitle}
          videoRef={videoRef}
          onImageError={handleImageError}
        />
      </div>

      {(showReelBody || !showOverlayTitle) && (
        <div className={cn('flex-1 flex flex-col min-w-0 bg-white', isReel ? 'pt-3' : 'p-4')}>
          {bodyContent}
        </div>
      )}
    </Link>
  );
}
