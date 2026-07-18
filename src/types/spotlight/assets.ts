/**
 * Extended campaign assets beyond media (LE-005.2).
 * Architecture only — no upload UI in LE-005.3.1.
 */

export type SpotlightCampaignAssetType =
  | 'media'
  | 'pdf'
  | 'specification_sheet'
  | 'manual'
  | 'coupon'
  | 'external_link'
  | 'download'
  | 'brochure'
  | 'ar_package'
  | 'three_d_model'
  | 'interactive_demo';

export interface SpotlightCampaignAsset {
  assetId: string;
  assetType: SpotlightCampaignAssetType;
  title: string;
  description?: string;
  /** Reference to spotlight_media for media-type assets */
  mediaId?: string;
  /** URL for external links, PDFs, downloads */
  url?: string;
  fileSize?: number;
  mimeType?: string;
  displayOrder: number;
  isPrimary?: boolean;
  createdAt: string;
  updatedAt: string;
}
