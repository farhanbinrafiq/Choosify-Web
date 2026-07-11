import React, { Suspense, lazy } from 'react';
import { LoadingFallback } from '../LoadingFallback';

const CreatorReviewsPreview = lazy(() =>
  import('../creatorReviews/CreatorReviewsPreview').then((module) => ({
    default: module.CreatorReviewsPreview,
  })),
);

export function BrandInfluencerReviewsSection({
  brandName,
  brandId,
}: {
  brandName: string;
  brandId?: string | number;
  brandLogo?: string;
  fullWidth?: boolean;
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreatorReviewsPreview
        context="brand"
        brandId={brandId ? String(brandId) : undefined}
        brandName={brandName}
        eyebrow="Spotlight Preview"
        title={`Creator Reviews for ${brandName}`}
        subtitle="Influencer reviews and official creator collaborations."
      />
    </Suspense>
  );
}
