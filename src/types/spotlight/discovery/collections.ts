/**
 * Spotlight Collections — seasonal, editorial, brand, creator collections (architecture).
 */

export type SpotlightCollectionKind =
  | 'seasonal'
  | 'editorial'
  | 'event'
  | 'brand'
  | 'creator'
  | 'community';

export interface SpotlightCollectionRef {
  kind: 'campaign' | 'product' | 'creator' | 'guide' | 'live' | 'recommendation' | 'review' | 'announcement';
  entityId: string;
  contentId?: string;
  sortOrder?: number;
}

export interface SpotlightCollection {
  collectionId: string;
  slug: string;
  name: string;
  description?: string;
  kind: SpotlightCollectionKind;
  coverImageUrl?: string;
  theme?: string;
  tags: string[];
  items: SpotlightCollectionRef[];
  /** Editorial / seasonal scheduling */
  startsAt?: string;
  endsAt?: string;
  publisherId?: string;
  isFeatured?: boolean;
  isSponsored?: boolean;
  createdAt: string;
  updatedAt: string;
}
