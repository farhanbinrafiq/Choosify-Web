import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { VideoEmbedCard } from '../ui/content/VideoEmbedCard';
import { resolveCreatorReviewMedia } from '../../lib/videoEmbed';

export interface CreatorReviewMediaCardProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  creatorHandle?: string;
  views?: string;
  /** Separate, explicit "View review details" control — omit to hide it
   *  entirely. Never combined with the play/open actions below. */
  viewAllHref?: string;
  className?: string;
}

/**
 * Creator Review media tile — Product/Brand Details page.
 *
 * Three independent interactions, none of which can trigger another:
 *  1. Play button → inline embed playback (VideoEmbedCard), stays on this
 *     page. No <Link>/navigate anywhere in the media area.
 *  2. "Open on <Platform>" → real target="_blank" anchor, opens the
 *     original content on its source platform in a new tab.
 *  3. "View review details" (optional) → the only in-app navigation this
 *     card ever performs, and only from its own explicit control.
 *
 * This replaces the previous pattern (a whole-card <Link> whose onClick
 * also called window.open on the video URL) that fired both a Choosify
 * navigation AND an external tab on a single click.
 */
export function CreatorReviewMediaCard({
  videoUrl,
  title,
  thumbnail,
  creatorHandle,
  views,
  viewAllHref,
  className,
}: CreatorReviewMediaCardProps) {
  const media = resolveCreatorReviewMedia(videoUrl, thumbnail);
  const isPortrait = media.orientation === 'portrait';

  const embedPlatform =
    media.platform === 'youtube' || media.platform === 'youtube_shorts'
      ? 'youtube'
      : media.platform === 'instagram_reel' || media.platform === 'instagram_post'
        ? 'instagram'
        : media.platform === 'facebook_reel' || media.platform === 'facebook_video'
          ? 'facebook'
          : media.platform === 'tiktok'
            ? 'tiktok'
            : null;

  return (
    <div className={cn('flex flex-col', isPortrait ? 'max-w-[220px]' : 'max-w-[340px]', className)}>
      <div className="relative">
        {/* Platform badge — top-left, above whatever VideoEmbedCard renders. */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <span className="inline-block px-2 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-extrabold uppercase tracking-wide">
            {media.platformLabel}
          </span>
        </div>

        {/* "Open on <Platform>" — isolated control, own click handler,
            stops propagation defensively even though nothing wraps this
            card in a navigating element. */}
        <a
          href={media.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title={`Open on ${media.platformLabel}`}
          aria-label={`Open on ${media.platformLabel}`}
          className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-black/70 hover:bg-black/85 flex items-center justify-center text-white transition-colors"
        >
          <ExternalLink size={12} />
        </a>

        {embedPlatform ? (
          <VideoEmbedCard
            url={videoUrl}
            platform={embedPlatform}
            title={title}
            thumbnail={media.thumbnailUrl || PLACEHOLDER_IMAGE}
            aspectRatio={isPortrait ? '9:16' : '16:9'}
            className="!rounded-[10px]"
          />
        ) : (
          // Unrecognized platform — never framed. Neutral poster + the same
          // "Open on <Platform>" affordance, larger, as the only playback
          // path available.
          <div
            className={cn(
              'relative w-full overflow-hidden rounded-[10px] bg-[#F4F7F9]',
              isPortrait ? 'aspect-[9/16]' : 'aspect-video',
            )}
          >
            <img
              src={media.thumbnailUrl || PLACEHOLDER_IMAGE}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 text-center px-3">
              <p className="text-white text-[11px] font-semibold">Preview not available here</p>
              <a
                href={media.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#1A1A2E] text-[10.5px] font-bold"
              >
                Open on {media.platformLabel} <ExternalLink size={10} />
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 min-w-0">
        <div className="text-[11.5px] font-bold text-[#1A1A2E] leading-snug line-clamp-2">{title}</div>
        {(creatorHandle || views) && (
          <div className="text-[10.5px] text-[#9AA0AC] mt-0.5 truncate">
            {[creatorHandle, views].filter(Boolean).join(' · ')}
          </div>
        )}
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="inline-block mt-1 text-[10.5px] font-bold text-[#FF5B00] hover:underline"
          >
            View review details →
          </Link>
        )}
      </div>
    </div>
  );
}

export default CreatorReviewMediaCard;
