import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import {
  comparisonApi,
  type ProductComparisonResult,
  type BrandComparisonResult,
  type BrandComparisonCard,
} from '../services/comparisonApi';
import { BrandCardDesign } from './BrandCardDesign';

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400?text=Choosify';

function fallbackSubtitle(result: ProductComparisonResult): string {
  const { filter } = result;
  switch (filter.fallbackTier) {
    case 'primary':
      return `Similar products in ${filter.categoryName} within ${filter.priceTolerancePercent}% of this price`;
    case 'category-25':
      return `Widened to ${filter.categoryName} within 25% of this price to find enough matches`;
    case 'parent-20':
      return `Widened to the parent category within 20% of this price`;
    case 'closest-price':
      return `Showing the closest-priced products in ${filter.categoryName}`;
    default:
      return `No comparable products found in ${filter.categoryName} right now`;
  }
}

function brandFallbackSubtitle(result: BrandComparisonResult): string {
  const { filter } = result;
  switch (filter.fallbackTier) {
    case 'primary':
      return `Brands in ${filter.category} within ${filter.ratingTolerance.toFixed(1)} rating points`;
    case 'tier-0.5':
      return `Widened to within 0.5 rating points to find enough matches`;
    case 'parent-category':
      return `Showing the closest-rated marketplace brands`;
    default:
      return `No comparable brands found right now`;
  }
}

export function ProductQuickComparison({ productId }: { productId: string }) {
  const [result, setResult] = useState<ProductComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    comparisonApi
      .getProductComparison(productId)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) return null;
  if (!result || result.candidates.length === 0) return null;

  const cards = [result.current, ...result.candidates];

  return (
    <section className="w-full bg-choosify-feed border-t border-[#E8EDF2] py-10" data-testid="product-quick-comparison">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-lg font-extrabold text-[#1A1A2E] mb-1">Quick Comparison</h3>
        <p className="text-[12px] text-[#9AA0AC] mb-5">{fallbackSubtitle(result)}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`rounded-xl border p-3 flex flex-col gap-2 ${
                card.isCurrent ? 'border-[#EB4501] bg-[#FFF6F2] ring-1 ring-[#EB4501]/30' : 'border-[#E8EDF2] bg-white'
              }`}
              data-testid={card.isCurrent ? 'comparison-current-card' : 'comparison-candidate-card'}
            >
              {card.isCurrent && (
                <span className="self-start text-[9px] font-black uppercase tracking-wide bg-[#EB4501] text-white px-2 py-0.5 rounded-full">
                  Viewing Now
                </span>
              )}
              <img
                src={card.image || PLACEHOLDER_IMAGE}
                alt={card.title}
                className="w-full aspect-square object-cover rounded-lg bg-[#F4F7F9]"
              />
              <div className="text-[12px] font-bold text-[#1A1A2E] leading-tight line-clamp-2">{card.title}</div>
              <div className="text-[10px] text-[#9AA0AC]">{card.brandName}</div>
              <div className="flex items-center gap-1 text-[10px] text-[#1A1A2E]">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {card.rating ? card.rating.toFixed(1) : '—'}
                <span className="text-[#9AA0AC]">({card.reviewCount})</span>
              </div>
              <div className="text-[13px] font-black text-[#EB4501]">৳{card.price.toLocaleString()}</div>
              {card.isCurrent ? (
                <button
                  disabled
                  className="mt-1 text-[10px] font-black uppercase text-center py-2 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
                >
                  Viewing
                </button>
              ) : (
                <Link
                  to={`/products/${card.slug || card.id}`}
                  className="mt-1 text-[10px] font-black uppercase text-center py-2 rounded-lg bg-[#1A1A2E] text-white hover:bg-slate-800"
                >
                  View Product
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Maps the real comparison DTO onto the canonical Brand Card's prop shape — no fabricated fields. */
function toBrandCardDesignBrand(card: BrandComparisonCard) {
  return {
    id: card.slug || card.id,
    name: card.name,
    logo: card.logo,
    category: card.category,
    bestFor: card.category,
    rating: card.overallRating,
    coverImage: card.coverImage,
    minPrice: card.minPrice,
    maxPrice: card.maxPrice,
  };
}

export function BrandQuickComparison({ brandId }: { brandId: string }) {
  const [result, setResult] = useState<BrandComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    comparisonApi
      .getBrandComparison(brandId)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [brandId]);

  if (loading) return null;
  if (!result || result.candidates.length === 0) return null;

  const cards = [result.current, ...result.candidates];

  return (
    <section className="w-full bg-choosify-feed border-t border-[#E8EDF2] py-10" data-testid="brand-quick-comparison">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-lg font-extrabold text-[#1A1A2E] mb-1">Quick Comparison</h3>
        <p className="text-[12px] text-[#9AA0AC] mb-5">{brandFallbackSubtitle(result)}</p>
        <div className="choosify-brand-grid w-full">
          {cards.map((card) => (
            <div key={card.id} data-testid={card.isCurrent ? 'comparison-current-card' : 'comparison-candidate-card'}>
              <BrandCardDesign brand={toBrandCardDesignBrand(card)} isCurrentInComparison={card.isCurrent} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
