import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ShoppingBag, Scale, Heart, User, ChevronRight } from 'lucide-react';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import { SpotlightContentMedia } from './SpotlightContentMedia';
import { SpotlightCommerceStrip } from './SpotlightCommerceStrip';
import { SpotlightPublisherRow } from './SpotlightPublisherRow';
import { resolveContentHeroDefinition } from '../../../lib/spotlight/feed/contentRendererRegistry';
import { publisherProfileHref } from '../../../lib/spotlight/content/publisherRegistry';
import { cn } from '../../../lib/utils';
import type { CatalogProduct } from '../../../types/catalog';

export interface SpotlightContentRendererProps {
  content: SpotlightContent;
  products: CatalogProduct[];
  typeLabel: string;
  onWishlist?: () => void;
  className?: string;
}

/**
 * Universal Spotlight Content Page renderer — type-adaptive hero + commerce-first body.
 * All content types share ONE page architecture (Guide Details generalized).
 */
export function SpotlightContentRenderer({
  content,
  products,
  typeLabel,
  onWishlist,
  className,
}: SpotlightContentRendererProps) {
  const primary = products[0];
  const primaryUrl = primary ? `/products/${primary.slug || primary.id}` : undefined;
  const hero = resolveContentHeroDefinition(content.contentType, content.media, content.isLive);
  const profileHref = publisherProfileHref(content.publisher);
  const hasService = content.connections.serviceIds.length > 0 || content.commerce.featuredServiceIds.length > 0;

  return (
    <div className={cn('space-y-6', className)} data-content-renderer="spotlight_universal">
      {/* Hero media — adapts by content type */}
      <section aria-label={hero.label} className="relative">
        {content.live?.embedUrl && hero.variant === 'live_player' ? (
          <div
            className="relative w-full overflow-hidden rounded-[5px] border border-[#e8edf2] bg-black"
            style={{ aspectRatio: hero.aspectRatio.replace(' / ', '/'), maxHeight: hero.maxHeight }}
          >
            <iframe
              src={content.live.embedUrl}
              title={content.headline}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          <div className="relative">
            <SpotlightContentMedia
              content={content}
              naturalOrientation
              priority
              className="w-full"
            />
            {hero.showPlayOverlay && content.media?.videoUrl && (
              <a
                href={content.media.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-[5px]"
                aria-label={`Play ${content.headline}`}
              >
                <span className="w-14 h-14 rounded-full bg-[#E8500A] text-white flex items-center justify-center shadow-lg">
                  <Play size={24} fill="currentColor" />
                </span>
              </a>
            )}
          </div>
        )}
        <p className="sr-only">{hero.label}</p>
      </section>

      {/* Brand card */}
      {content.publisher.publisherType === 'brand' && (
        <section className="flex items-center gap-3 p-4 bg-white border border-[#e8edf2] rounded-[5px]">
          {content.publisher.logoUrl && (
            <img
              src={content.publisher.logoUrl}
              alt=""
              className="w-12 h-12 rounded object-cover border border-gray-100"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brand</p>
            <p className="text-sm font-bold text-[#1a1a2e] truncate">{content.publisher.name}</p>
          </div>
          {profileHref && (
            <Link
              to={profileHref}
              className="text-[10px] font-black uppercase tracking-widest text-[#E8500A] hover:underline shrink-0"
            >
              View Brand
            </Link>
          )}
        </section>
      )}

      {/* Featured product / service — commerce first */}
      {(primary || hasService) && (
        <section className="text-left bg-[#fafbfc] border border-[#e8edf2] rounded-[5px] p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#E8500A] mb-3">
            {primary ? 'Featured Product' : 'Featured Service'}
          </p>
          {primary ? (
            <SpotlightCommerceStrip
              product={primary}
              extraProductCount={content.extraProductCount}
              brandName={content.publisher.publisherType === 'brand' ? content.publisher.name : undefined}
            />
          ) : (
            <p className="text-sm text-gray-600">Explore linked services from this Spotlight experience.</p>
          )}
        </section>
      )}

      {/* Primary commerce CTAs */}
      <div className="flex flex-wrap gap-2">
        {primaryUrl && (
          <>
            <Link
              to={`${primaryUrl}#buy`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#E8500A] text-white text-[10px] font-black uppercase tracking-wider rounded hover:bg-[#CF4400] min-h-[44px]"
            >
              <ShoppingBag size={12} /> Shop Now
            </Link>
            <Link
              to={primaryUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#e8edf2] text-[10px] font-bold uppercase tracking-wide text-[#1a1a2e] rounded hover:border-[#E8500A]/40 min-h-[44px]"
            >
              Product Details
            </Link>
          </>
        )}
        <Link
          to="/compare"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#e8edf2] text-[10px] font-bold uppercase tracking-wide text-[#1a1a2e] rounded hover:border-[#E8500A]/40 min-h-[44px]"
        >
          <Scale size={12} /> Compare
        </Link>
        {onWishlist && (
          <button
            type="button"
            onClick={onWishlist}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#e8edf2] bg-white hover:border-[#E8500A]/30 cursor-pointer min-h-[44px]"
          >
            <Heart size={12} /> Wishlist
          </button>
        )}
      </div>

      {/* Description */}
      {content.description && (
        <p className="text-sm text-gray-500 leading-relaxed">{content.description}</p>
      )}

      {/* Creator — demoted, small */}
      <SpotlightPublisherRow
        publisher={content.publisher}
        compact
        secondary
        linkToProfile={Boolean(profileHref)}
        className="opacity-75"
      />
      {profileHref && content.publisher.publisherType === 'creator' && (
        <Link
          to={profileHref}
          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E8500A]"
        >
          <User size={12} /> Creator profile (secondary)
          <ChevronRight size={12} />
        </Link>
      )}

      {/* Sponsored badge */}
      {content.isSponsored && (
        <p className="text-[10px] font-bold uppercase text-amber-600">Sponsored</p>
      )}

      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{typeLabel}</p>
    </div>
  );
}
