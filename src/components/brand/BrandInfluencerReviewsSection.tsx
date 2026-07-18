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
        eyebrow=""
        title="CREATORS REVIEW"
        subtitle="Video reviews from YouTube, Instagram & Facebook creators"
      />
    </Suspense>
  );
}
