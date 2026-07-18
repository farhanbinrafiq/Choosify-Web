import React from 'react';
import type { CmsPreviewMode } from '../../types/marketing/cms';
import type { MarketingContentRecord } from '../../types/marketing/cms';
import type { SponsoredCampaignRecord } from '../../types/marketing/cms';
import { ChoosifySponsoredCard } from '../commerce/ChoosifySponsoredCard';
import { UniversalCommerceCard } from '../content/UniversalCommerceCard';
import { getMediaById } from '../../services/spotlightCampaignStorage';
import { cn } from '../../lib/utils';

const PREVIEW_MODES: { id: CmsPreviewMode; label: string; width: number }[] = [
  { id: 'spotlight_card', label: 'Spotlight Card', width: 360 },
  { id: 'spotlight_detail', label: 'Detail Page', width: 960 },
  { id: 'sponsored_card', label: 'Sponsored Card', width: 360 },
  { id: 'mobile', label: 'Mobile', width: 390 },
  { id: 'desktop', label: 'Desktop', width: 1280 },
];

interface CmsPreviewPanelProps {
  mode: CmsPreviewMode;
  onModeChange: (mode: CmsPreviewMode) => void;
  content?: MarketingContentRecord;
  sponsored?: SponsoredCampaignRecord;
}

export function CmsPreviewPanel({ mode, onModeChange, content, sponsored }: CmsPreviewPanelProps) {
  const width = PREVIEW_MODES.find((m) => m.id === mode)?.width ?? 960;
  const media = content?.primaryMediaId ? getMediaById(content.primaryMediaId) : undefined;
  const thumb = media?.thumbnail ?? media?.previewImage ?? 'https://picsum.photos/seed/cms/800/600';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PREVIEW_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={cn(
              'px-3 py-1.5 text-[10px] font-bold uppercase rounded border',
              mode === m.id ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-[#e8edf2]',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        className="mx-auto border border-[#e8edf2] rounded-lg bg-white shadow-lg overflow-hidden transition-all"
        style={{ maxWidth: width }}
      >
        {mode === 'sponsored_card' && sponsored ? (
          <div className="p-4">
            <ChoosifySponsoredCard
              item={{
                id: sponsored.campaignId,
                kind: sponsored.campaignType,
                sponsorName: sponsored.brandName ?? 'Sponsor',
                sponsoredLabel: `Sponsored by ${sponsored.brandName ?? 'Partner'}`,
                href: sponsored.cta.url,
                ctaLabel: sponsored.cta.label,
                title: sponsored.name,
                image: thumb,
                productId: sponsored.productIds[0],
                brandId: sponsored.brandId,
              }}
            />
          </div>
        ) : content ? (
          <div className={cn(mode === 'mobile' ? 'p-3' : 'p-6')}>
            {mode === 'spotlight_card' ? (
              <UniversalCommerceCard
                variant="guide"
                mode="preview"
                model={{
                  id: content.contentId,
                  href: `/spotlight/${content.slug}`,
                  title: content.headline || content.title,
                  excerpt: content.summary,
                  layoutVariant: 'featured',
                  aspectRatio: '16/10',
                  image: thumb,
                  badgeLabel: content.contentType.replace(/_/g, ' '),
                  platform: 'blog',
                }}
              />
            ) : (
              <>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold uppercase text-[#E8500A]">
                  {content.contentType.replace(/_/g, ' ')}
                </span>
                <h2 className="text-xl font-black text-navy mt-1">{content.headline || content.title}</h2>
                <p className="text-sm text-gray-500 mt-2">{content.summary || 'No summary yet.'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {content.pageSections
                    .filter((s) => s.visible)
                    .slice(0, 6)
                    .map((s) => (
                      <span key={s.id} className="px-2 py-1 text-[9px] font-bold uppercase bg-gray-100 rounded">
                        {s.id.replace(/_/g, ' ')}
                      </span>
                    ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-sm">Select content to preview</div>
        )}
      </div>
    </div>
  );
}
