import React, { useMemo } from 'react';
import type { CatalogProduct } from '../../types/catalog';
import { useEmiAssistant } from '../../hooks/useEmiAssistant';
import { EmiContextPanel } from './EmiContextPanel';
import { EmiShoppingCoach } from './EmiShoppingCoach';
import { emiShoppingMemory } from '../../lib/emi/emiMemory';
import { openEmiPanel } from '../../lib/emi';

interface EmiProductAssistantProps {
  product: CatalogProduct;
  inStock?: boolean;
}

export function EmiProductAssistant({ product, inStock }: EmiProductAssistantProps) {
  const contextPartial = useMemo(
    () => ({
      pageId: 'product' as const,
      entityId: String(product.id),
      entityLabel: product.title,
      productIds: [String(product.id)],
      metadata: {
        price: product.price,
        rating: (product as { rating?: number }).rating ?? 4.5,
        brand: product.brandName ?? product.brandId,
        category: product.categoryName,
        inStock: inStock ?? product.stock > 0,
      },
    }),
    [product, inStock],
  );

  const { recommendations, coachOptions } = useEmiAssistant(contextPartial);

  React.useEffect(() => {
    emiShoppingMemory.recordProductView(String(product.id));
  }, [product.id]);

  return (
    <div className="space-y-4">
      <EmiContextPanel
        title="Explain this product"
        subtitle="Specs, reviews, and shopping advice"
        recommendations={recommendations}
      />
      <EmiShoppingCoach options={coachOptions} />
      <button
        type="button"
        onClick={() => openEmiPanel(`Tell me more about ${product.title} and alternatives`)}
        className="text-[10px] font-bold uppercase text-[#E8500A] hover:underline"
      >
        Ask Emi in chat →
      </button>
    </div>
  );
}
