import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  GitCompare,
  Heart,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { SPOTLIGHT_CONTENT_TYPE_META } from '../../../types/spotlight/experience/contentTypes';
import { useSpotlightImpression } from '../../../hooks/useSpotlightImpression';
import { useDashboard } from '../../../context/DashboardContext';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { SpotlightContentMedia } from './SpotlightContentMedia';
import { SpotlightPublisherRow } from './SpotlightPublisherRow';
import { SpotlightLiveBadge } from './SpotlightLiveBadge';
import { SpotlightCommerceStrip } from './SpotlightCommerceStrip';
import {
  resolveSpotlightCardForContent,
  spotlightCardDefinition,
} from '../../../lib/spotlight/feed/cardRegistry';
import {
  resolveContentDensity,
  CONTENT_DENSITY_REGISTRY,
} from '../../../lib/spotlight/experience/contentDensityRegistry';
import { cn } from '../../../lib/utils';

const SEASONAL_STYLES: Record<string, string> = {
  eid: 'ring-1 ring-emerald-200/60',
  ramadan: 'ring-1 ring-purple-200/60',
  christmas: 'ring-1 ring-red-200/60',
  new_year: 'ring-1 ring-amber-200/60',
  summer_sale: 'ring-1 ring-sky-200/60',
  back_to_school: 'ring-1 ring-indigo-200/60',
};

export interface SpotlightCardRendererProps {
  content: SpotlightContent;
  impressionCallbacks?: SpotlightImpressionCallbacks;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
  sectionLayout?: string;
  /** Mobile feed uses full-width cards with sticky commerce CTAs */
  feedMode?: 'grid' | 'mobile_feed' | 'carousel' | 'hero' | 'list';
}

/**
 * Universal adaptive card renderer — commerce-first hierarchy:
 * Media → Product/Service → CTA → Brand → Creator
 */
export function SpotlightCardRenderer({
  content,
  impressionCallbacks,
  className,
  variant = 'default',
  sectionLayout,
  feedMode = 'grid',
}: SpotlightCardRendererProps) {
  const { allCatalogProducts } = useGlobalState();
  const { savedProducts, setSavedProducts, addToCompare } = useDashboard();

  const trackId = content.sourceId;
  const { ref, trackClick, trackPreviewStart, trackPreviewComplete } = useSpotlightImpression(
    trackId,
    impressionCallbacks ?? {},
  );

  const primaryProductId = content.commerce.featuredProductIds[0] ?? content.connections.productIds[0];
  const product = primaryProductId
    ? allCatalogProducts.find((p) => p.id === primaryProductId)
    : undefined;
  const hasService = content.commerce.featuredServiceIds.length > 0 || content.connections.serviceIds.length > 0;

  const { mode: cardMode } = resolveSpotlightCardForContent({
    contentType: content.contentType,
    mediaType: content.media?.mediaType,
    hasProducts: Boolean(product),
    hasServices: hasService,
    categoryIds: content.connections.categoryIds,
    headline: content.headline,
  });

  const cardDef = spotlightCardDefinition(
    content.contentType,
    content.media?.mediaType,
    Boolean(product),
    hasService,
  );

  const density = resolveContentDensity({
    sectionLayout,
    isSponsored: content.isSponsored,
    isFeatured: variant === 'hero',
    contentType: content.contentType,
    variant,
  });
  const densityDef = CONTENT_DENSITY_REGISTRY[density];
  const isFeatured = density === 'featured';
  const isCompact = density === 'compact';
  const isMobileFeed = feedMode === 'mobile_feed';

  const isSaved = product ? savedProducts.some((p) => p.id === product.id) : false;
  const productUrl = product ? `/products/${product.slug || product.id}` : undefined;
  const typeLabel = SPOTLIGHT_CONTENT_TYPE_META[content.contentType]?.label ?? 'Spotlight';
  const shopLabel = content.commerce.primaryCta?.label ?? 'Shop Now';
  const contentActionLabel = content.ctaLabel;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${content.href}`;
    if (navigator.share) {
      await navigator.share({ title: content.headline, url }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    }
    trackClick();
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    if (isSaved) {
      setSavedProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success('Removed from vault');
    } else {
      setSavedProducts((prev) => [...prev, product]);
      toast.success('Saved to vault');
    }
    trackClick();
  };

  return (
    <article
      ref={ref}
      className={cn(
        'flex flex-col h-full bg-white border border-[#e8edf2] rounded-[5px] overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left',
        content.seasonalTheme && content.seasonalTheme !== 'none' ? SEASONAL_STYLES[content.seasonalTheme] : '',
        isFeatured && !isMobileFeed && 'md:flex-row md:items-stretch',
        isMobileFeed && 'w-full',
        className,
      )}
      data-seasonal={content.seasonalTheme !== 'none' ? content.seasonalTheme : undefined}
      data-card-mode={cardMode}
      data-density={density}
      data-feed-mode={feedMode}
      aria-label={product ? `${product.title} — ${content.headline}` : content.headline}
    >
      <Link
        to={content.href}
        onClick={trackClick}
        className={cn(
          'relative block',
          isFeatured && !isMobileFeed ? 'md:w-1/2 shrink-0' : 'w-full',
        )}
        aria-label={`View ${content.headline}`}
      >
        <SpotlightContentMedia
          content={content}
          onPreviewStart={trackPreviewStart}
          onPreviewComplete={trackPreviewComplete}
          priority={isFeatured}
          naturalOrientation={cardDef.naturalMedia}
        />
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#EB4501] text-white">
            {typeLabel}
          </span>
          {product && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/95 text-[#1a1a2e] border border-[#e8edf2]">
              Shoppable
            </span>
          )}
          {content.isSponsored && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
              Sponsored
            </span>
          )}
          {(content.isLive || content.contentType === 'live') && (
            <SpotlightLiveBadge status={content.live?.status === 'upcoming' ? 'upcoming' : 'live'} />
          )}
        </div>
      </Link>

      <div
        className={cn(
          'flex flex-col flex-1',
          densityDef.padding === 'sm' ? 'p-3 gap-2' : densityDef.padding === 'lg' ? 'p-5 gap-4' : 'p-4 gap-3',
          isFeatured && !isMobileFeed && 'md:justify-center',
          isMobileFeed && 'sticky bottom-0 bg-white z-10',
        )}
      >
        {(product || hasService) && (
          <SpotlightCommerceStrip
            product={product}
            serviceLabel={hasService && !product ? 'Featured service' : undefined}
            extraProductCount={content.extraProductCount}
            brandName={content.publisher.publisherType === 'brand' ? content.publisher.name : undefined}
            compact={isCompact}
          />
        )}

        <div className={cn('flex flex-col gap-2', isCompact && 'gap-1.5')}>
          {productUrl ? (
            <>
              <Link
                to={`${productUrl}#buy`}
                onClick={trackClick}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#EB4501] text-white text-[10px] font-black uppercase tracking-wider rounded hover:bg-[#CF4400] transition-colors min-h-[44px]"
              >
                <ShoppingBag size={12} aria-hidden />
                {shopLabel}
              </Link>
              <div className={cn('grid gap-2', isCompact ? 'grid-cols-1' : 'grid-cols-2')}>
                <Link
                  to={productUrl}
                  onClick={trackClick}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1.5 border border-[#e8edf2] text-[9px] font-bold uppercase tracking-wide text-[#1a1a2e] rounded hover:border-[#EB4501]/40 min-h-[44px]"
                >
                  Product Details
                </Link>
                <Link
                  to={content.href}
                  onClick={trackClick}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1.5 border border-[#EB4501]/20 text-[9px] font-bold uppercase tracking-wide text-[#EB4501] rounded hover:bg-[#CF4400]/5 min-h-[44px]"
                >
                  {contentActionLabel}
                  <ChevronRight size={11} />
                </Link>
              </div>
            </>
          ) : (
            <Link
              to={content.href}
              onClick={trackClick}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#EB4501] text-white text-[10px] font-black uppercase tracking-wider rounded hover:bg-[#CF4400] transition-colors min-h-[44px]"
            >
              {contentActionLabel}
              <ChevronRight size={12} />
            </Link>
          )}
        </div>

        <div>
          <Link to={content.href} onClick={trackClick} className="hover:text-[#CF4400] transition-colors">
            <h3
              className={cn(
                'font-bold text-[#1a1a2e] leading-snug',
                isFeatured ? 'text-lg line-clamp-3' : isCompact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2',
              )}
            >
              {content.headline}
            </h3>
          </Link>
          {content.description && densityDef.maxDescriptionLines > 0 && (
            <p
              className="text-[11px] text-gray-500 mt-1 line-clamp-2"
              style={{ WebkitLineClamp: densityDef.maxDescriptionLines }}
            >
              {content.description}
            </p>
          )}
        </div>

        {densityDef.showSecondaryActions && product && (
          <div className="flex items-center justify-between pt-1 border-t border-gray-50">
            <button
              type="button"
              onClick={toggleWishlist}
              className={cn('p-2 rounded-full border min-h-[44px] min-w-[44px] bg-white', isSaved ? 'border-[#EB4501] text-[#EB4501]' : 'border-[#E5E7EB] text-[#EB4501]')}
              aria-pressed={isSaved}
              aria-label="Wishlist"
            >
              <Heart
                size={14}
                className={cn('text-[#EB4501]', isSaved && 'fill-[#EB4501]')}
                strokeWidth={2}
                fill={isSaved ? '#EB4501' : 'none'}
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (product) addToCompare(product);
                trackClick();
              }}
              className="p-2 rounded-full border-0 bg-transparent min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
              aria-label="Compare"
            >
              <GitCompare size={14} stroke="url(#choosify-emi-icon-grad)" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full border border-gray-100 text-gray-400 hover:text-[#CF4400] min-h-[44px] min-w-[44px]"
              aria-label="Share"
            >
              <Share2 size={14} />
            </button>
          </div>
        )}

        {densityDef.showPublisherRow && (
          <SpotlightPublisherRow
            publisher={content.publisher}
            compact
            secondary
            linkToProfile={false}
            className="mt-auto opacity-80"
          />
        )}
      </div>
    </article>
  );
}
