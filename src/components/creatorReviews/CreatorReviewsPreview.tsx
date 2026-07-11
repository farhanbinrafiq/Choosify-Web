import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { getAllBrandPosts } from '../../lib/brandPosts';
import { GUIDE_MEDIA_GRID } from '../../lib/pageLayout';
import { resolveSpotlightExperience } from '../../utils/spotlightContentResolver';
import {
  adaptiveBrandPreviewCount,
  adaptiveProductPreviewCount,
  resolveCreatorReviewsPreview,
  type CreatorReviewsPreviewContext,
  type LegacyCreatorContentItem,
} from '../../utils/creatorReviewsPreview';
import {
  UniversalCommerceCard,
  spotlightToPreviewContentCardModel,
  legacyCreatorContentToPreviewModel,
  resolveCommerceCardVariant,
} from '../content';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

export interface CreatorReviewsPreviewProps {
  context: CreatorReviewsPreviewContext;
  productId?: string;
  brandId?: string;
  brandName?: string;
  productTitle?: string;
  featuredContentId?: string;
  legacyCreatorContent?: LegacyCreatorContentItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

/** Compact Spotlight preview grid for Product / Brand detail pages */
export function CreatorReviewsPreview({
  context,
  productId,
  brandId,
  brandName,
  productTitle,
  featuredContentId,
  legacyCreatorContent,
  eyebrow = 'Spotlight Preview',
  title,
  subtitle,
  className,
}: CreatorReviewsPreviewProps) {
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();

  const allContent = useMemo(
    () =>
      resolveSpotlightExperience({
        catalog: allCatalogProducts,
        guides: allCatalogGuides,
        creators: allCreators,
        brandPosts: getAllBrandPosts(),
        brandLogos: BRAND_LOGOS,
      }),
    [allCatalogProducts, allCatalogGuides, allCreators],
  );

  const preview = useMemo(
    () =>
      resolveCreatorReviewsPreview(allContent, {
        context,
        productId,
        brandId,
        brandName,
        featuredContentId,
        legacyCreatorContent,
      }),
    [
      allContent,
      context,
      productId,
      brandId,
      brandName,
      featuredContentId,
      legacyCreatorContent,
    ],
  );

  const legacyFallbackCards = useMemo(() => {
    if (preview.totalCount > 0 || !legacyCreatorContent?.length) return [];
    const cap =
      context === 'product'
        ? adaptiveProductPreviewCount(legacyCreatorContent.length)
        : adaptiveBrandPreviewCount(legacyCreatorContent.length);
    return legacyCreatorContent.slice(0, cap).map((item) =>
      legacyCreatorContentToPreviewModel(item, { brandName, productId }),
    );
  }, [preview.totalCount, legacyCreatorContent, context, brandName, productId]);

  const showLegacyOnly = preview.totalCount === 0 && legacyFallbackCards.length > 0;
  const showViewAll =
    preview.showViewAll ||
    (showLegacyOnly && (legacyCreatorContent?.length ?? 0) > legacyFallbackCards.length);

  const resolvedTitle =
    title ??
    (context === 'product'
      ? `Creator Reviews for ${productTitle ?? brandName ?? 'this product'}`
      : `Creator Reviews for ${brandName ?? 'this brand'}`);

  const resolvedSubtitle =
    subtitle ??
    (context === 'product'
      ? 'Honest creator takes to help you decide with confidence.'
      : 'Influencer reviews and official creator collaborations.');

  if (preview.totalCount === 0 && !legacyCreatorContent?.length) {
    return (
      <section
        id="influencer-reviews-section"
        className={`w-full rounded-[5px] border border-dashed border-[#e8edf2] bg-[#fafbfc] p-6 text-center ${className ?? ''}`}
      >
        <p className="text-sm font-semibold text-[#8a9bb0]">Creator reviews coming soon</p>
        <Link
          to={preview.viewAllHref}
          className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#E8500A] hover:underline min-h-[44px]"
        >
          Browse Spotlight Reviews <ChevronRight size={12} />
        </Link>
      </section>
    );
  }

  return (
    <section
      id="influencer-reviews-section"
      className={`w-full rounded-[5px] border border-[#e8edf2] bg-white p-4 sm:p-5 ${className ?? ''}`}
      aria-labelledby="creator-reviews-preview-heading"
    >
      <header className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="text-left min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">{eyebrow}</p>
          <h2
            id="creator-reviews-preview-heading"
            className="text-base sm:text-lg font-black italic uppercase tracking-tighter text-[#1a1a2e] leading-tight"
          >
            {resolvedTitle}
          </h2>
          <p className="text-[11px] text-gray-500 mt-1 max-w-xl">{resolvedSubtitle}</p>
        </div>
        {showViewAll && (
          <Link
            to={preview.viewAllHref}
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#E8500A] hover:underline shrink-0 min-h-[44px]"
          >
            View All Reviews ({preview.totalCount || legacyCreatorContent?.length})
            <ChevronRight size={12} />
          </Link>
        )}
      </header>

      <div className={GUIDE_MEDIA_GRID} aria-label="Creator review preview cards">
        {preview.items.map((content) => {
          const model = spotlightToPreviewContentCardModel(content, brandName);
          return (
            <UniversalCommerceCard
              key={content.contentId}
              mode="preview"
              variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
              model={model}
            />
          );
        })}
        {legacyFallbackCards.map((model) => (
          <UniversalCommerceCard
            key={model.id}
            mode="preview"
            variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
            model={model}
          />
        ))}
      </div>

      {showViewAll && (
        <div className="mt-4 pt-4 border-t border-[#e8edf2] flex justify-center sm:justify-end">
          <Link
            to={preview.viewAllHref}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[5px] border border-[#e8edf2] text-[10px] font-black uppercase tracking-wider text-[#1a1a2e] hover:border-[#E8500A]/40 hover:text-[#E8500A] min-h-[44px] w-full sm:w-auto"
          >
            View All Reviews
            <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
