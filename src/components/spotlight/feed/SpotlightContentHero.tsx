import React, { useMemo } from 'react';
import { DetailSliverMediaGallery } from '../../commerce/DetailSliverMediaGallery';
import { buildGuideGalleryItems, buildSpotlightContentGalleryItems } from '../../media/choosifyMediaAdapters';
import type { SpotlightLiveConfig } from '../../../types/spotlight/experience/live';

export type SpotlightHeroVariant = 'portrait' | 'landscape' | 'image' | 'carousel' | 'live' | 'replay';

interface SpotlightContentHeroProps {
  guide: { title?: string; image?: string; videoUrl?: string; type?: string; category?: string };
  variant: SpotlightHeroVariant;
  liveEmbedUrl?: string;
  videoUrl?: string;
  posterImage?: string;
  headline?: string;
  media?: Parameters<typeof buildSpotlightContentGalleryItems>[0]['media'];
  live?: SpotlightLiveConfig;
  showAddVideo?: boolean;
  onAddVideo?: () => void;
  /** Show the LIVE NOW / Upcoming / Replay badge over the media card. */
  showLiveBadge?: boolean;
}

/** Spotlight / Guide Detail hero — shared `DetailSliverMediaGallery` (animation, peeks, autoplay). */
export function SpotlightContentHero({
  guide,
  variant,
  liveEmbedUrl,
  videoUrl,
  posterImage,
  headline,
  media,
  live,
  showAddVideo,
  onAddVideo,
  showLiveBadge,
}: SpotlightContentHeroProps) {
  const items = useMemo(() => {
    const contentItems = buildSpotlightContentGalleryItems({
      headline: headline ?? guide.title ?? 'Spotlight',
      media:
        media ??
        ({
          videoUrl: videoUrl ?? guide.videoUrl,
          thumbnail: posterImage ?? guide.image,
          mediaType:
            variant === 'portrait'
              ? 'vertical_video'
              : variant === 'live' || variant === 'replay' || variant === 'landscape'
                ? 'landscape_video'
                : undefined,
        } as NonNullable<Parameters<typeof buildSpotlightContentGalleryItems>[0]['media']>),
      live: live ?? (liveEmbedUrl ? { embedUrl: liveEmbedUrl } : undefined),
    });

    if (contentItems.length > 0 && !(contentItems.length === 1 && contentItems[0].url.includes('placeholder'))) {
      return contentItems;
    }

    return buildGuideGalleryItems({
      ...guide,
      videoUrl: videoUrl ?? guide.videoUrl,
      image: posterImage ?? guide.image,
      type: variant === 'portrait' ? 'reels' : guide.type,
    });
  }, [guide, variant, liveEmbedUrl, videoUrl, posterImage, headline, media, live]);

  const liveBadge = useMemo(() => {
    if (!showLiveBadge || !live) return undefined;
    const status = live.status ?? 'ended';
    const isLive = status === 'live';
    const isUpcoming = status === 'upcoming';
    return {
      label: isLive ? 'Live Now' : isUpcoming ? 'Upcoming Live' : 'Live Replay',
      isLive,
      isUpcoming,
      scheduledAt: live.scheduledAt,
      ctaLabel: live.embedUrl ? (isLive ? 'Watch Live' : isUpcoming ? 'Notify Me' : 'Watch Replay') : undefined,
    };
  }, [showLiveBadge, live]);

  return (
    <div id="spotlight-content-hero">
      <DetailSliverMediaGallery
        items={items}
        ariaLabel={`${headline ?? guide.title ?? 'Spotlight'} media gallery`}
        showAddVideo={showAddVideo}
        onAddVideo={onAddVideo}
        liveBadge={liveBadge}
      />
    </div>
  );
}
