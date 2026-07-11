import React, { useCallback, useRef, useState } from 'react';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import { MediaRenderer } from '../../media/renderers/MediaRenderer';
import { MediaPreview } from '../../media/renderers/MediaPreview';
import { MediaPlaceholder } from '../../media/renderers/MediaPlaceholder';
import { getHomepageSpotlightMediaProfile } from '../homepage/spotlightMediaProfile';
import { cn } from '../../../lib/utils';

interface SpotlightContentMediaProps {
  content: SpotlightContent;
  onPreviewStart?: () => void;
  onPreviewComplete?: () => void;
  className?: string;
  priority?: boolean;
}

export function SpotlightContentMedia({
  content,
  onPreviewStart,
  onPreviewComplete,
  className,
  priority,
}: SpotlightContentMediaProps) {
  const [previewing, setPreviewing] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const profile = getHomepageSpotlightMediaProfile();
  const media = content.media;
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startPreview = useCallback(() => {
    if (!media?.videoUrl || reducedMotion) return;
    setPreviewing(true);
    onPreviewStart?.();
    requestAnimationFrame(() => void videoRef.current?.play().catch(() => setMediaError(true)));
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

  if (content.live?.embedUrl && !media?.videoUrl) {
    return (
      <div className={cn('relative w-full overflow-hidden rounded-[5px] bg-black', className)} style={{ aspectRatio: '16/9' }}>
        <iframe
          src={content.live.embedUrl}
          title={content.headline}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }

  if (!media || mediaError) {
    return (
      <MediaPlaceholder
        label={content.headline}
        className={cn('w-full', className)}
        aspectRatio={profile.aspectRatio}
      />
    );
  }

  if (!media.videoUrl) {
    return (
      <MediaRenderer
        media={media}
        profile={{ ...profile, priorityImage: priority }}
        className={className}
        onError={() => setMediaError(true)}
      />
    );
  }

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-black rounded-[5px]', className)}
      style={{ aspectRatio: profile.aspectRatio, maxHeight: profile.maxHeight }}
      onMouseEnter={() => window.matchMedia('(hover: hover)').matches && startPreview()}
      onMouseLeave={() => window.matchMedia('(hover: hover)').matches && stopPreview()}
    >
      {!previewing ? (
        <button type="button" className="absolute inset-0 w-full h-full" onClick={startPreview} aria-label={`Preview ${content.headline}`}>
          <MediaPreview media={media} className="w-full h-full" priority={priority} />
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center text-sm">▶</span>
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
          aria-label={media.altText || content.headline}
          onEnded={stopPreview}
          onError={() => setMediaError(true)}
        />
      )}
    </div>
  );
}
