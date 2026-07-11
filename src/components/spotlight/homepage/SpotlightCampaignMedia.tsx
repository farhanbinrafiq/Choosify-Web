import React, { useCallback, useRef, useState } from 'react';
import type { UniversalMedia } from '../../media/types/mediaModel';
import { MediaRenderer } from '../../media/renderers/MediaRenderer';
import { MediaPreview } from '../../media/renderers/MediaPreview';
import { MediaPlaceholder } from '../../media/renderers/MediaPlaceholder';
import { getHomepageSpotlightMediaProfile } from './spotlightMediaProfile';
import { cn } from '../../../lib/utils';

interface SpotlightCampaignMediaProps {
  media: UniversalMedia | null;
  headline: string;
  onPreviewStart?: () => void;
  onPreviewComplete?: () => void;
  className?: string;
}

export function SpotlightCampaignMedia({
  media,
  headline,
  onPreviewStart,
  onPreviewComplete,
  className,
}: SpotlightCampaignMediaProps) {
  const [previewing, setPreviewing] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const profile = getHomepageSpotlightMediaProfile();
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startPreview = useCallback(() => {
    if (!media?.videoUrl || reducedMotion) return;
    setPreviewing(true);
    onPreviewStart?.();
    requestAnimationFrame(() => {
      const el = videoRef.current;
      if (!el) return;
      void el.play().catch(() => setMediaError(true));
    });
  }, [media?.videoUrl, onPreviewStart, reducedMotion]);

  const stopPreview = useCallback(() => {
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    if (previewing) onPreviewComplete?.();
    setPreviewing(false);
  }, [onPreviewComplete, previewing]);

  if (!media || mediaError) {
    return (
      <MediaPlaceholder
        label={headline || 'Campaign media'}
        className={cn('w-full', className)}
        aspectRatio={profile.aspectRatio}
      />
    );
  }

  const isVideo = Boolean(media.videoUrl);

  if (!isVideo) {
    return (
      <MediaRenderer
        media={media}
        profile={profile}
        className={className}
        onError={() => setMediaError(true)}
      />
    );
  }

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-black rounded-[5px]', className)}
      style={{ aspectRatio: profile.aspectRatio, maxHeight: profile.maxHeight }}
      onMouseEnter={() => {
        if (window.matchMedia('(hover: hover)').matches) startPreview();
      }}
      onMouseLeave={() => {
        if (window.matchMedia('(hover: hover)').matches) stopPreview();
      }}
    >
      {!previewing ? (
        <button
          type="button"
          className="absolute inset-0 w-full h-full"
          onClick={startPreview}
          aria-label={`Preview ${headline}`}
        >
          <MediaPreview media={media} className="w-full h-full" />
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center text-sm">
              ▶
            </span>
          </span>
        </button>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={media.videoUrl}
          poster={media.thumbnail}
          muted
          playsInline
          loop
          aria-label={media.altText || headline}
          onEnded={stopPreview}
          onError={() => setMediaError(true)}
        />
      )}
    </div>
  );
}
