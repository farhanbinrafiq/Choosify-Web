import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { MediaDisplayProfile } from '../types/displayProfile';
import type { UniversalMedia } from '../types/mediaModel';
import { resolvePosterImage } from '../types/mediaModel';
import { useMediaPlayback } from '../hooks/useMediaPlayback';
import { MediaError } from './MediaError';
import { MediaLoading } from './MediaLoading';
import { MediaPreview } from './MediaPreview';

interface VideoRendererProps {
  media: UniversalMedia;
  profile: MediaDisplayProfile;
  className?: string;
  aspectRatio?: string;
  onError?: (message: string) => void;
}

export function VideoRenderer({
  media,
  profile,
  className,
  aspectRatio,
  onError,
}: VideoRendererProps) {
  const [showVideo, setShowVideo] = useState(!profile.lazyVideo);
  const { videoRef, hasError, isLoaded, setHasError, setIsLoaded, play } = useMediaPlayback({
    autoplay: profile.autoplay,
    muted: profile.muted,
    loop: profile.loop,
    showControls: profile.showControls,
    lazyLoad: profile.lazyVideo,
  });

  if (!media.videoUrl) {
    return <MediaError message="Video source is missing." className={className} aspectRatio={aspectRatio} />;
  }

  if (hasError) {
    return <MediaError message="Unable to load video." className={className} aspectRatio={aspectRatio} />;
  }

  const poster = resolvePosterImage(media) || media.thumbnail;

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-black', profile.rounded && 'rounded-[5px]', className)}
      style={{
        aspectRatio,
        maxHeight: profile.maxHeight,
      }}
    >
      {!isLoaded && <MediaLoading className="absolute inset-0" />}

      {!showVideo && profile.lazyVideo ? (
        <button
          type="button"
          className="absolute inset-0 w-full h-full"
          onClick={() => {
            setShowVideo(true);
            void play();
          }}
          aria-label={media.altText || 'Play video'}
        >
          <MediaPreview media={media} className="w-full h-full" priority={profile.priorityImage} />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center text-lg">
              ▶
            </span>
          </span>
        </button>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ objectFit: profile.objectFit }}
          src={media.videoUrl}
          poster={poster}
          controls={profile.showControls}
          autoPlay={profile.autoplay}
          muted={profile.muted}
          loop={profile.loop}
          playsInline
          preload={profile.lazyVideo ? 'none' : 'metadata'}
          aria-label={media.altText || media.caption || 'Campaign video'}
          onLoadedData={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            onError?.('Video failed to load');
          }}
        />
      )}

      {media.caption && (
        <figcaption className="sr-only">{media.caption}</figcaption>
      )}
      {media.transcriptPlaceholder && (
        <div className="sr-only" aria-label="Transcript placeholder">
          {media.transcriptPlaceholder}
        </div>
      )}
    </div>
  );
}
