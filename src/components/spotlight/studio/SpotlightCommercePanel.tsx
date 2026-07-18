import React from 'react';
import { ProductMerchandisingPanel } from '../merchandising/ProductMerchandisingPanel';
import { MediaManagerPanel } from '../cms/MediaManagerPanel';

interface SpotlightCommercePanelProps {
  productIds: string[];
  primaryProductId?: string;
  brandId?: string;
  categoryId?: string;
  onProductsChange: (ids: string[], primaryId?: string) => void;
}

export function SpotlightCommercePanel({
  productIds,
  primaryProductId,
  brandId,
  categoryId,
  onProductsChange,
}: SpotlightCommercePanelProps) {
  return (
    <div className="p-6">
      <h2 className="text-sm font-black text-navy uppercase mb-4">Commerce Blocks</h2>
      <p className="text-xs text-gray-500 mb-4">Attach products for shoppable Spotlight experiences. Reuses campaign merchandising engine.</p>
      <ProductMerchandisingPanel
        linkedProductIds={productIds}
        primaryProductId={primaryProductId}
        brandId={brandId}
        categoryId={categoryId}
        onChange={(merch, legacy) => onProductsChange(legacy.linkedProductIds, legacy.primaryProductId)}
      />
    </div>
  );
}

interface SpotlightMediaPanelProps {
  mediaIds: string[];
  onChange: (mediaIds: string[]) => void;
}

export function SpotlightMediaPanel({ mediaIds, onChange }: SpotlightMediaPanelProps) {
  return (
    <div className="p-6">
      <h2 className="text-sm font-black text-navy uppercase mb-4">Media Library</h2>
      <p className="text-xs text-gray-500 mb-4">Landscape, portrait, square, reels, video — one renderer adapts orientation.</p>
      <MediaManagerPanel mediaIds={mediaIds} primaryMediaId={mediaIds[0]} onChange={onChange} />
    </div>
  );
}
