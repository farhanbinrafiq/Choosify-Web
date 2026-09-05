import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { getVideoEmbedUrl, isEmbeddableVideo } from '../../../lib/videoEmbed';

export interface VideoEmbedCardProps {
  url: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'vimeo';
  title?: string;
  thumbnail?: string;
  aspectRatio?: '16:9' | '9:16' | '4:3' | '1:1';
  className?: string;
}

export const VideoEmbedCard: React.FC<VideoEmbedCardProps> = ({
  url,
  platform,
  title,
  thumbnail,
  aspectRatio = '16:9',
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(!thumbnail);

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  };

  // youtube/tiktok/instagram/facebook all go through the shared,
  // security-reviewed builder (lib/videoEmbed.ts): the iframe src is always
  // built from a regex-extracted id/shortcode interpolated into a fixed,
  // hardcoded official-embed template (or, for Facebook, the original URL
  // appears only as an encoded query value on facebook.com's own documented
  // video plugin) — never the raw input URL framed directly — and is
  // host-allowlisted before ever reaching the iframe. vimeo keeps its own
  // extraction here since lib/videoEmbed.ts doesn't cover it.
  const getEmbedUrl = (): string | null => {
    if (platform === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=${thumbnail ? 1 : 0}` : null;
    }
    if (!isEmbeddableVideo(url)) return null;
    const embed = getVideoEmbedUrl(url);
    if (platform === 'youtube' && !embed.includes('autoplay=')) {
      return `${embed}${embed.includes('?') ? '&' : '?'}autoplay=${thumbnail ? 1 : 0}`;
    }
    return embed;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className={cn("choosify-dark-surface rounded-3xl overflow-hidden border border-slate-100 shadow-md relative w-full group", className)}>
      <div className={cn("relative w-full overflow-hidden", aspectRatioClasses[aspectRatio])}>
        {!isPlaying && thumbnail ? (
          <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
            <img src={thumbnail} alt={title || 'Video thumbnail'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-xl">
                <Play className="w-6 h-6 text-white ml-1 fill-white" />
              </div>
            </div>
            {title && (
              <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent">
                <h4 className="text-white font-bold truncate">{title}</h4>
              </div>
            )}
          </div>
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={title || "Video Player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0 bg-black"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/80 text-white/60 text-xs font-medium">
            Video unavailable
          </div>
        )}
      </div>
    </div>
  );
};
