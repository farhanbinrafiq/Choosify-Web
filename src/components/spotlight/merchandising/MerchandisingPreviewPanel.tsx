import React from 'react';
import type { MediaDisplayProfileKey } from '../../media/types/displayProfile';
import type { UniversalMedia } from '../../media/types/mediaModel';
import { MediaRenderer } from '../../media/renderers/MediaRenderer';
import type { CatalogProduct } from '../../../types/catalog';
import type { SpotlightCampaignProductLink } from '../../../types/spotlight/merchandising/productLink';
import { orderProductLinks } from '../../../utils/spotlightMerchandisingOrdering';

const MERCH_PROFILES: { key: MediaDisplayProfileKey; label: string }[] = [
  { key: 'homepage_carousel', label: 'Homepage Card' },
  { key: 'spotlight_feed', label: 'Spotlight Card' },
  { key: 'campaign_details', label: 'Landing Page' },
  { key: 'product_embed', label: 'Product Section' },
  { key: 'brand_embed', label: 'Hero Section' },
  { key: 'mini_card', label: 'Bundle Section' },
];

interface MerchandisingPreviewPanelProps {
  media: UniversalMedia | null;
  headline?: string;
  productLinks: SpotlightCampaignProductLink[];
  catalog: CatalogProduct[];
}

export function MerchandisingPreviewPanel({
  media,
  headline,
  productLinks,
  catalog,
}: MerchandisingPreviewPanelProps) {
  const ordered = orderProductLinks(productLinks);
  const hero = ordered.find((l) => l.role === 'hero');
  const heroProduct = hero ? catalog.find((p) => p.id === hero.productId) : undefined;

  return (
    <div className="space-y-6">
      {headline && <h3 className="font-bold text-navy">{headline}</h3>}
      {heroProduct && (
        <div className="p-3 border rounded bg-white">
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Hero Product</p>
          <p className="text-sm font-semibold">{heroProduct.title}</p>
          <p className="text-xs text-[#EB4501]">৳{heroProduct.price}</p>
        </div>
      )}
      {!media ? (
        <p className="text-sm text-gray-500">Add media to preview cards.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MERCH_PROFILES.map(({ key, label }) => (
            <div key={key}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
              <div className="border rounded overflow-hidden bg-white">
                <MediaRenderer media={media} profile={key} />
              </div>
            </div>
          ))}
        </div>
      )}
      {ordered.length > 1 && (
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Product order preview</p>
          <ol className="text-xs space-y-1">
            {ordered.slice(0, 8).map((l) => {
              const p = catalog.find((c) => c.id === l.productId);
              return (
                <li key={l.productId}>
                  {p?.title ?? l.productId} — <span className="text-gray-400">{l.role}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
