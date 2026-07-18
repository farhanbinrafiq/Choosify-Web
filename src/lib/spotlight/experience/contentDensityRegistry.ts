/**
 * Content Density System — LE-005 Phase 5.5.1 (CTO upgrade)
 * Three reusable density levels for mixed editorial shopping feeds.
 */

export type ContentDensity = 'compact' | 'standard' | 'featured';

export interface ContentDensityDefinition {
  id: ContentDensity;
  label: string;
  cardWidth: number;
  maxDescriptionLines: number;
  showSecondaryActions: boolean;
  showPublisherRow: boolean;
  publisherSecondary: boolean;
  mediaMaxHeight?: string;
  padding: 'sm' | 'md' | 'lg';
}

export const CONTENT_DENSITY_REGISTRY: Record<ContentDensity, ContentDensityDefinition> = {
  compact: {
    id: 'compact',
    label: 'Compact',
    cardWidth: 240,
    maxDescriptionLines: 0,
    showSecondaryActions: false,
    showPublisherRow: true,
    publisherSecondary: true,
    mediaMaxHeight: '320px',
    padding: 'sm',
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    cardWidth: 280,
    maxDescriptionLines: 2,
    showSecondaryActions: true,
    showPublisherRow: true,
    publisherSecondary: true,
    mediaMaxHeight: '420px',
    padding: 'md',
  },
  featured: {
    id: 'featured',
    label: 'Featured',
    cardWidth: 360,
    maxDescriptionLines: 3,
    showSecondaryActions: true,
    showPublisherRow: true,
    publisherSecondary: true,
    mediaMaxHeight: '520px',
    padding: 'lg',
  },
};

/** Map legacy card variant props to density */
export function densityFromVariant(variant?: 'default' | 'compact' | 'hero'): ContentDensity {
  if (variant === 'hero') return 'featured';
  if (variant === 'compact') return 'compact';
  return 'standard';
}

/** Resolve density from section layout + content signals */
export function resolveContentDensity(input: {
  sectionLayout?: string;
  isSponsored?: boolean;
  isFeatured?: boolean;
  contentType?: string;
  variant?: 'default' | 'compact' | 'hero';
}): ContentDensity {
  if (input.variant) return densityFromVariant(input.variant);
  if (input.sectionLayout === 'hero' || input.isFeatured) return 'featured';
  if (['new_launch', 'live', 'promotion', 'campaign'].includes(input.contentType ?? '') && input.isSponsored) {
    return 'featured';
  }
  if (input.sectionLayout === 'carousel') return 'compact';
  return 'standard';
}
