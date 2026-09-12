import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { resolveCreatorReviewMedia } from '../../lib/videoEmbed';

export interface CreatorReviewMediaCardProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  creatorHandle?: string;
  views?: string;
  /** Set only when this review is genuinely Choosify-hosted content with its
   *  own detail route (e.g. a canonical Spotlight/content id resolved by the
   *  caller) — "View review details" then navigates there in-app. Every
   *  current caller passes raw external videoUrl-only data with no such
   *  route, so this is left undefined and the control falls back to the
   *  review's real external URL instead. Never fabricated. */
  contentHref?: string;
  className?: string;
  /** Opens the shared Choosify media viewer for this review. The card is a
   *  poster only — it never mounts a third-party iframe itself, so there is
   *  only ever one embed live on the page at a time (see
   *  CreatorReviewViewerModal, which owns the single active-media state). */
  onPlay: () => void;
}

/**
 * Creator Review media tile — Product/Brand Details page.
 *
 * A pure poster card: thumbnail + platform badge + play affordance. Three
 * independent interactions, none of which can trigger another:
 *  1. Play (the whole media area) → calls onPlay(), which the parent uses to
 *     open the shared Choosify viewer modal. No iframe here, no navigation.
 *  2. "Open on <Platform>" → real target="_blank" anchor, opens the
 *     original content on its source platform in a new tab.
 *  3. "View review details" → resolves by source: a real Choosify detail
 *     route (contentHref) when one exists, otherwise the review's actual
 *     external URL (YouTube/Facebook/Instagram/TikTok/etc.) in a new tab.
 *     Never sends an external review through the Recommendations/Guide
 *     system just because it renders inside this section.
 */
export function CreatorReviewMediaCard({
  videoUrl,
  title,
  thumbnail,
  creatorHandle,
  views,
  contentHref,
  className,
  onPlay,
}: CreatorReviewMediaCardProps) {
  const media = resolveCreatorReviewMedia(videoUrl, thumbnail);
  const isPortrait = media.orientation === 'portrait';

  return (
    <div
      className={cn(
        'flex flex-col shrink-0',
        isPortrait ? 'w-[190px] sm:w-[210px]' : 'w-[280px] sm:w-[320px]',
        className,
      )}
    >
      <div className="relative">
        {/* Platform badge — top-left, above the poster. */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <span className="inline-block px-2 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-extrabold uppercase tracking-wide">
            {media.platformLabel}
          </span>
        </div>

        {/* "Open on <Platform>" — isolated control, own click handler, stops
            propagation so it never also triggers the play button beneath it. */}
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

        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${title}`}
          className={cn(
            'relative w-full overflow-hidden rounded-[10px] bg-[#F4F7F9] block group cursor-pointer',
            isPortrait ? 'aspect-[9/16]' : 'aspect-video',
          )}
        >
          <img
            src={media.thumbnailUrl || PLACEHOLDER_IMAGE}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A1A2E] ml-0.5 fill-[#1A1A2E]" />
            </div>
          </div>
        </button>
      </div>

      <div className="mt-2 min-w-0">
        <div className="text-[11.5px] font-bold text-[#1A1A2E] leading-snug line-clamp-2">{title}</div>
        {(creatorHandle || views) && (
          <div className="text-[10.5px] text-[#9AA0AC] mt-0.5 truncate">
            {[creatorHandle, views].filter(Boolean).join(' · ')}
          </div>
        )}
        {contentHref ? (
          <Link
            to={contentHref}
            className="inline-block mt-1 text-[10.5px] font-bold text-[#FF5B00] hover:underline"
          >
            View review details →
          </Link>
        ) : (
          <a
            href={media.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-[10.5px] font-bold text-[#FF5B00] hover:underline"
          >
            View review details →
          </a>
        )}
      </div>
    </div>
  );
}

export default CreatorReviewMediaCard;
