import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGlobalState } from '../../context/GlobalStateContext';
import type { SponsoredPlacementItem } from '../../types/commerce/sponsoredPlacement';
import {
  resolvedPlacementToSponsoredItem,
  sponsoredItemToCommerceCardModel,
} from '../../utils/sponsoredPlacementAdapter';
import { resolveCommerceCardVariant } from '../content/universalCommerceCardTypes';
import type { ResolvedPlacement } from '../../utils/resolvePlacementContent';
import { PLACEHOLDER_IMAGE } from '../../constants';

const ProductCard = lazy(() =>
  import('../ProductCard').then((m) => ({ default: m.ProductCard })),
);
const BrandCardDesign = lazy(() =>
  import('../BrandCardDesign').then((m) => ({ default: m.BrandCardDesign })),
);
const UniversalCommerceCard = lazy(() =>
  import('../content/UniversalCommerceCard').then((m) => ({ default: m.UniversalCommerceCard })),
);

function SponsoredPublisherStrip({
  item,
  className,
}: {
  item: SponsoredPlacementItem;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 min-w-0 px-1 pb-2', className)}>
      {item.sponsorLogoUrl ? (
        <img
          src={item.sponsorLogoUrl}
          alt=""
          className="w-6 h-6 rounded-full object-cover border border-gray-100 shrink-0"
          loading="lazy"
        />
      ) : (
        <span className="w-6 h-6 rounded-full bg-[#EB4501]/10 text-[#EB4501] text-[9px] font-black flex items-center justify-center shrink-0">
          {item.sponsorName.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[10px] font-bold text-[#1a1a2e] truncate">{item.sponsorName}</span>
          {item.isVerified && (
            <BadgeCheck size={11} className="text-[#EB4501] shrink-0" aria-hidden />
          )}
        </div>
        <p
          className="text-[8px] text-gray-400 uppercase tracking-wide truncate"
          aria-label="Sponsored Content"
        >
          {item.sponsoredLabel}
        </p>
      </div>
      <span
        className="shrink-0 text-[7px] font-bold uppercase tracking-wider text-gray-400 border border-gray-200 rounded px-1 py-0.5"
        aria-hidden
      >
        Sponsored
      </span>
    </div>
  );
}

function SponsoredCompactCard({ item }: { item: SponsoredPlacementItem }) {
  const inner = (
    <div className="group block choosify-dark-surface rounded-[5px] hover:scale-[1.01] transition-all duration-300 flex flex-col h-full min-h-[260px] w-full overflow-hidden text-left">
      <div className="flex-[7] min-h-0 overflow-hidden bg-black/20 relative">
        <img
          src={item.image ?? PLACEHOLDER_IMAGE}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-[3] min-h-0 justify-center min-w-0">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#EB4501] mb-1 flex items-center gap-1">
          🏷️ Sponsored Ad
        </span>
        {item.title && (
          <h3 className="text-xs font-bold uppercase text-white line-clamp-2 mb-1">{item.title}</h3>
        )}
        {item.subtitle && (
          <p className="text-[10px] text-white/50 line-clamp-1 mb-2">{item.subtitle}</p>
        )}
        <div className="mt-auto">
          <span className="block w-full text-center bg-[#EB4501] text-white py-2 rounded-lg text-[10px] font-bold group-hover:brightness-110 transition-[filter]">
            {item.ctaLabel || 'Shop Now'}
          </span>
        </div>
      </div>
    </div>
  );

  if (item.isExternal) {
    return (
      <a href={item.href} target="_blank" rel="sponsored noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }

  return (
    <Link to={item.href} className="block h-full">
      {inner}
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="w-full h-full min-h-[280px] rounded-[5px] bg-gray-50 animate-pulse border border-[#e8edf2]" />
  );
}

const SPOTLIGHT_KINDS = new Set([
  'spotlight',
  'guide',
  'collection',
  'creator_review',
  'service',
  'event',
  'launch',
]);

/**
 * LE-006.3 — Universal sponsored card.
 * Reuses existing Choosify cards; only adds subtle sponsored publisher strip.
 */
export function ChoosifySponsoredCard({
  item,
  className,
}: {
  item: SponsoredPlacementItem;
  className?: string;
}) {
  const { allCatalogProducts, allCatalogBrands } = useGlobalState();

  const product = item.productId
    ? allCatalogProducts.find((p) => String(p.id) === String(item.productId))
    : undefined;

  const brand = item.brandId
    ? allCatalogBrands.find((b) => String(b.id) === String(item.brandId))
    : undefined;

  const renderInner = () => {
    if ((item.kind === 'product' || item.kind === 'deal') && product) {
      return (
        <Suspense fallback={<CardSkeleton />}>
          <ProductCard product={product} variant="grid" />
        </Suspense>
      );
    }

    if (item.kind === 'brand' && brand) {
      return (
        <Suspense fallback={<CardSkeleton />}>
          <BrandCardDesign
            brand={{
              id: brand.id,
              name: brand.name,
              logo: brand.logo ?? item.sponsorLogoUrl ?? PLACEHOLDER_IMAGE,
              description: brand.description,
              rating: brand.ratings ?? 4.5,
              category: brand.category,
            }}
          />
        </Suspense>
      );
    }

    if (SPOTLIGHT_KINDS.has(item.kind)) {
      const model = sponsoredItemToCommerceCardModel(item);
      return (
        <Suspense fallback={<CardSkeleton />}>
          <UniversalCommerceCard
            mode="commerce"
            variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
            model={model}
          />
        </Suspense>
      );
    }

    return <SponsoredCompactCard item={item} />;
  };

  return (
    <div className={cn('w-full h-full flex flex-col min-h-0', className)} aria-label="Sponsored Content">
      <SponsoredPublisherStrip item={item} />
      <div className="flex-1 min-h-0">{renderInner()}</div>
    </div>
  );
}

/** Adapter from legacy ResolvedPlacement */
export function ChoosifySponsoredCardFromResolved({
  placement,
  sponsorName,
  className,
}: {
  placement: ResolvedPlacement;
  sponsorName?: string;
  className?: string;
}) {
  const item = resolvedPlacementToSponsoredItem(placement, sponsorName);
  return <ChoosifySponsoredCard item={item} className={className} />;
}
