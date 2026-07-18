import React from 'react';
import type { SpotlightLiveSource } from '../../../types/spotlight/interactive/sources';
import { LIVE_SOURCE_PROVIDER_LABELS } from '../../../types/spotlight/interactive/sources';
import { cn } from '../../../lib/utils';

interface LiveEmbedPlayerProps {
  source: SpotlightLiveSource;
  title: string;
  posterUrl?: string;
  className?: string;
}

/** Unified live player — provider embed only, no custom streaming */
export function LiveEmbedPlayer({ source, title, posterUrl, className }: LiveEmbedPlayerProps) {
  if (source.status === 'future') {
    return (
      <div
        className={cn('aspect-video bg-gray-900 rounded-[5px] flex items-center justify-center text-white p-6 text-center', className)}
        role="img"
        aria-label={`${LIVE_SOURCE_PROVIDER_LABELS[source.provider]} coming soon`}
      >
        <div>
          <p className="text-sm font-bold">{LIVE_SOURCE_PROVIDER_LABELS[source.provider]}</p>
          <p className="text-xs text-white/60 mt-1">Provider integration reserved</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full overflow-hidden rounded-[5px] bg-black', className)}>
      <iframe
        src={source.embedUrl}
        title={title}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {posterUrl && (
        <span className="sr-only">Poster: {posterUrl}</span>
      )}
      <p className="sr-only">
        Streaming via {LIVE_SOURCE_PROVIDER_LABELS[source.provider]}. Commerce provided by Choosify.
      </p>
    </div>
  );
}
