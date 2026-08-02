import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
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
import { SponsoredCardChrome } from './SponsoredCardChrome';

const ProductCard = lazy(() =>
  import('../ProductCard').then((m) => ({ default: m.ProductCard })),
);
const BrandCardDesign = lazy(() =>
  import('../BrandCardDesign').then((m) => ({ default: m.BrandCardDesign })),
);
const UniversalCommerceCard = lazy(() =>
  import('../content/UniversalCommerceCard').then((m) => ({ default: m.UniversalCommerceCard })),
);

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
        <SponsoredCardChrome
          brandName={item.sponsorName}
          logoUrl={item.sponsorLogoUrl}
          size="md"
        />
      </div>
      <div className="p-3 flex flex-col flex-[3] min-h-0 justify-center min-w-0">
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
 * Reuses existing Choosify cards; adds shared logo + PROMOTED chrome on the media.
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

  const needsOuterChrome =
    ((item.kind === 'product' || item.kind === 'deal') && Boolean(product)) ||
    (item.kind === 'brand' && Boolean(brand));

  return (
    <div
      className={cn('w-full h-full flex flex-col min-h-0 relative', className)}
      aria-label="Promoted Content"
    >
      <div className="flex-1 min-h-0 relative">
        {renderInner()}
        {needsOuterChrome ? (
          <SponsoredCardChrome
            brandName={item.sponsorName}
            logoUrl={item.sponsorLogoUrl ?? brand?.logo ?? product?.image}
            size="md"
          />
        ) : null}
      </div>
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
