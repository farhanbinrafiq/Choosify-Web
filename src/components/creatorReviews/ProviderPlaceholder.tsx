import React from 'react';
import { Facebook, Instagram, Music2, Video } from 'lucide-react';
import type { CreatorReviewPlatform } from '../../lib/videoEmbed';

/**
 * Honest "no thumbnail available" tile for a Creator Review card -- shown
 * only when there is genuinely no custom thumbnail AND no provider-derived
 * one (Facebook/Instagram have no credential-free thumbnail API; TikTok
 * falls here only while its oEmbed fetch is in flight or has failed). This
 * is a deterministic, platform-branded color+icon+label tile -- it must
 * never be mistaken for a real screenshot or video frame.
 */
const PROVIDER_STYLES: Partial<Record<CreatorReviewPlatform, { background: string; Icon: typeof Facebook }>> = {
  facebook_video: { background: 'linear-gradient(135deg, #1877F2 0%, #0C44AE 100%)', Icon: Facebook },
  facebook_reel: { background: 'linear-gradient(135deg, #1877F2 0%, #0C44AE 100%)', Icon: Facebook },
  instagram_post: {
    background: 'linear-gradient(135deg, #FEDA75 0%, #FA7E1E 30%, #D62976 60%, #4F5BD5 100%)',
    Icon: Instagram,
  },
  instagram_reel: {
    background: 'linear-gradient(135deg, #FEDA75 0%, #FA7E1E 30%, #D62976 60%, #4F5BD5 100%)',
    Icon: Instagram,
  },
  tiktok: { background: 'linear-gradient(135deg, #010101 0%, #232323 100%)', Icon: Music2 },
};

export function ProviderPlaceholder({
  platform,
  label,
}: {
  platform: CreatorReviewPlatform;
  label: string;
}) {
  const { background, Icon } = PROVIDER_STYLES[platform] ?? { background: '#4B5563', Icon: Video };
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white text-center px-3"
      style={{ background }}
    >
      <Icon size={22} strokeWidth={1.75} />
      <span className="text-[10px] font-extrabold uppercase tracking-wide">{label}</span>
      <span className="text-[8.5px] opacity-75">Thumbnail unavailable</span>
    </div>
  );
}

export default ProviderPlaceholder;
