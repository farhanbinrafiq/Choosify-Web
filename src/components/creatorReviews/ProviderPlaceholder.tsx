import React from 'react';
import { Facebook, Instagram, Music2, Video, Play } from 'lucide-react';
import type { CreatorReviewPlatform } from '../../lib/videoEmbed';

/**
 * Honest "no thumbnail available" tile for a Creator Review card -- shown
 * only when there is genuinely no custom thumbnail AND no provider-derived
 * one (Facebook/Instagram have no credential-free thumbnail API; TikTok
 * falls here only while its oEmbed fetch is in flight or has failed). This
 * is a deterministic, platform-branded color+icon+label tile -- it must
 * never be mistaken for a real screenshot or video frame.
 *
 * Renders its own play affordance (matching the card's real-thumbnail play
 * button exactly) rather than relying on the card's generic black-tint
 * hover overlay -- that overlay was previously layered on top of this same
 * background, which is what made an already-dark tile (TikTok's near-black
 * gradient especially) read as an empty/broken thumbnail in production
 * rather than an intentional branded state. The card skips that overlay
 * whenever this component is what's showing (see CreatorReviewMediaCard).
 */
const PROVIDER_STYLES: Partial<Record<CreatorReviewPlatform, { background: string; Icon: typeof Facebook }>> = {
  facebook_video: { background: 'linear-gradient(160deg, #2196F3 0%, #0C44AE 100%)', Icon: Facebook },
  facebook_reel: { background: 'linear-gradient(160deg, #2196F3 0%, #0C44AE 100%)', Icon: Facebook },
  instagram_post: {
    background: 'linear-gradient(160deg, #FEDA75 0%, #FA7E1E 35%, #D62976 65%, #4F5BD5 100%)',
    Icon: Instagram,
  },
  instagram_reel: {
    background: 'linear-gradient(160deg, #FEDA75 0%, #FA7E1E 35%, #D62976 65%, #4F5BD5 100%)',
    Icon: Instagram,
  },
  tiktok: { background: 'linear-gradient(160deg, #3A3A3E 0%, #0A0A0C 100%)', Icon: Music2 },
};

export function ProviderPlaceholder({
  platform,
  label,
}: {
  platform: CreatorReviewPlatform;
  label: string;
}) {
  const { background, Icon } =
    PROVIDER_STYLES[platform] ?? { background: 'linear-gradient(160deg, #6B7280 0%, #374151 100%)', Icon: Video };
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-white text-center px-3"
      style={{ background }}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={13} strokeWidth={2} />
        <span className="text-[10.5px] font-extrabold uppercase tracking-wide">{label}</span>
      </div>
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A1A2E] ml-0.5 fill-[#1A1A2E]" />
      </div>
      <span className="text-[9.5px] font-semibold text-white/85">Preview unavailable</span>
    </div>
  );
}

export default ProviderPlaceholder;
