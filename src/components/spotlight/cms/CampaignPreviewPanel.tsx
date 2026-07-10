import React from 'react';
import type { MediaDisplayProfileKey } from '../../media/types/displayProfile';
import type { UniversalMedia } from '../../media/types/mediaModel';
import { MediaRenderer } from '../../media/renderers/MediaRenderer';

const PREVIEW_PROFILES: { key: MediaDisplayProfileKey; label: string }[] = [
  { key: 'homepage_carousel', label: 'Homepage Card' },
  { key: 'spotlight_feed', label: 'Spotlight Feed' },
  { key: 'campaign_details', label: 'Campaign Details' },
  { key: 'brand_embed', label: 'Brand Section' },
  { key: 'product_embed', label: 'Product Section' },
  { key: 'mini_card', label: 'Mini Card' },
];

interface CampaignPreviewPanelProps {
  media: UniversalMedia | null;
  headline?: string;
  subHeadline?: string;
}

export function CampaignPreviewPanel({ media, headline, subHeadline }: CampaignPreviewPanelProps) {
  if (!media) {
    return (
      <div className="p-6 bg-gray-50 rounded border border-dashed border-gray-200 text-center text-sm text-gray-500">
        Add media in Step 2 to see live previews.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(headline || subHeadline) && (
        <div className="space-y-1">
          {headline && <h3 className="font-bold text-navy">{headline}</h3>}
          {subHeadline && <p className="text-sm text-gray-500">{subHeadline}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREVIEW_PROFILES.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
            <div className="border border-[#e8edf2] rounded overflow-hidden bg-white">
              <MediaRenderer media={media} profile={key} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
