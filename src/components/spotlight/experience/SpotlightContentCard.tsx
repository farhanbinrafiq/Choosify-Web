import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { cn } from '../../../lib/utils';

const SEASONAL_STYLES: Record<string, string> = {
  eid: 'ring-1 ring-emerald-200/60',
  ramadan: 'ring-1 ring-purple-200/60',
  christmas: 'ring-1 ring-red-200/60',
  new_year: 'ring-1 ring-amber-200/60',
  summer_sale: 'ring-1 ring-sky-200/60',
  back_to_school: 'ring-1 ring-indigo-200/60',
};

interface SpotlightContentCardProps {
  content: SpotlightContent;
  impressionCallbacks?: SpotlightImpressionCallbacks;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

export function SpotlightContentCard({
  content,
  impressionCallbacks,
  className,
  variant = 'default',
}: SpotlightContentCardProps) {
  const navigate = useNavigate();
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
  const isSaved = product ? savedProducts.some((p) => p.id === product.id) : false;
  const productUrl = product ? `/products/${product.slug || product.id}` : undefined;
  const typeLabel = SPOTLIGHT_CONTENT_TYPE_META[content.contentType]?.label ?? 'Spotlight';

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

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  return (
    <article
      ref={ref}
      className={cn(
        'flex flex-col h-full bg-white border border-[#e8edf2] rounded-[5px] overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left',
        content.seasonalTheme && content.seasonalTheme !== 'none' ? SEASONAL_STYLES[content.seasonalTheme] : '',
        isHero && 'md:flex-row md:items-stretch',
        className,
      )}
      data-seasonal={content.seasonalTheme !== 'none' ? content.seasonalTheme : undefined}
      aria-label={content.headline}
    >
      <div className={cn('relative', isHero ? 'md:w-1/2 shrink-0' : 'w-full')}>
        <SpotlightContentMedia
          content={content}
          onPreviewStart={trackPreviewStart}
          onPreviewComplete={trackPreviewComplete}
          priority={isHero}
        />
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#E8500A] text-white">
            {typeLabel}
          </span>
          {content.isSponsored && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
              Sponsored
            </span>
          )}
          {(content.isLive || content.contentType === 'live') && (
            <SpotlightLiveBadge status={content.live?.status === 'upcoming' ? 'upcoming' : 'live'} />
          )}
        </div>
      </div>

      <div className={cn('flex flex-col flex-1 gap-3', isCompact ? 'p-3' : 'p-4', isHero && 'md:justify-center')}>
        <SpotlightPublisherRow publisher={content.publisher} compact={isCompact} />

        <div>
          <h3 className={cn('font-bold text-[#1a1a2e] leading-snug', isHero ? 'text-lg line-clamp-3' : 'text-sm line-clamp-2')}>
            {content.headline}
          </h3>
          {content.description && !isCompact && (
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{content.description}</p>
          )}
        </div>

        {product && (
          <div className="border-t border-gray-50 pt-3 space-y-1">
            <p className="text-[11px] font-semibold text-gray-600 line-clamp-1">{product.title}</p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-black text-[#E8500A]">৳{product.price.toLocaleString()}</span>
              {(content.extraProductCount ?? 0) > 0 && (
                <span className="text-[10px] font-bold text-gray-400 uppercase">+{content.extraProductCount} Products</span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-[9px] text-gray-400 uppercase tracking-wide">
          <time dateTime={content.publishedAt}>
            {new Date(content.publishedAt).toLocaleDateString()}
          </time>
          {(content.popularityScore ?? 0) > 0 && (
            <span>· {content.popularityScore} popularity</span>
          )}
          {content.aiScore != null && (
            <span className="text-[#E8500A]/70">· AI {Math.round(content.aiScore)}</span>
          )}
        </div>

        <div className={cn('mt-auto flex flex-col gap-2', isCompact && 'gap-1.5')}>
          <Link
            to={content.href}
            onClick={trackClick}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#E8500A] text-white text-[10px] font-black uppercase tracking-wider rounded hover:bg-[#CF4400] transition-colors"
          >
            {content.ctaLabel}
            <ChevronRight size={12} />
          </Link>

          {!isCompact && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {productUrl && (
                  <Link
                    to={productUrl}
                    onClick={trackClick}
                    className="inline-flex items-center justify-center gap-1 px-2 py-1.5 border border-[#e8edf2] text-[9px] font-bold uppercase tracking-wide text-[#1a1a2e] rounded hover:border-[#E8500A]/40"
                  >
                    Product Details
                  </Link>
                )}
                {productUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackClick();
                      navigate(`${productUrl}#buy`);
                    }}
                    className="inline-flex items-center justify-center gap-1 px-2 py-1.5 border border-[#E8500A]/30 text-[9px] font-bold uppercase tracking-wide text-[#E8500A] rounded hover:bg-[#E8500A]/5"
                  >
                    <ShoppingBag size={11} />
                    Shop Now
                  </button>
                )}
              </div>

              {product && (
                <div className="flex items-center justify-between pt-1">
                  <button type="button" onClick={toggleWishlist} className={cn('p-2 rounded-full border', isSaved ? 'border-[#E8500A] text-[#E8500A]' : 'border-gray-100 text-gray-400')} aria-pressed={isSaved} aria-label="Wishlist">
                    <Heart size={14} className={isSaved ? 'fill-current' : ''} />
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); if (product) addToCompare(product); trackClick(); }} className="p-2 rounded-full border border-gray-100 text-gray-400 hover:text-navy" aria-label="Compare">
                    <GitCompare size={14} />
                  </button>
                  <button type="button" onClick={handleShare} className="p-2 rounded-full border border-gray-100 text-gray-400 hover:text-[#E8500A]" aria-label="Share">
                    <Share2 size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
