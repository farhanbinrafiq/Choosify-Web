import React from 'react';
import {
  UniversalCommerceCard,
  guideToContentCardModel,
  resolveCommerceCardVariant,
} from '../content';
import type { CatalogGuide } from '../../types/catalog';

type GuideCardInput = CatalogGuide & { excerpt?: string };

/** @deprecated Use UniversalCommerceCard — kept for backward-compatible imports */
export function ReelCard({ guide }: { guide: GuideCardInput | null | undefined }) {
  if (!guide?.id) return null;
  const model = guideToContentCardModel(guide);
  return (
    <UniversalCommerceCard
      mode="editorial"
      variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
      model={model}
    />
  );
}

/** @deprecated Use UniversalCommerceCard — kept for backward-compatible imports */
export function HorizontalMediaCard({
  guide,
  badgeType,
}: {
  guide: GuideCardInput | null | undefined;
  badgeType: 'youtube' | 'blog';
}) {
  if (!guide?.id) return null;
  const normalized: GuideCardInput = {
    ...guide,
    type: badgeType === 'youtube' ? 'video' : 'article',
  };
  const model = guideToContentCardModel(normalized);
  return (
    <UniversalCommerceCard
      mode="editorial"
      variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
      model={model}
    />
  );
}
