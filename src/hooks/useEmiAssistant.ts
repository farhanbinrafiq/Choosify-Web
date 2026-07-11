import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { EmiPageContext } from '../types/emi';
import { buildPageContext, resolveAssistantId } from '../lib/emi/emiContextEngine';
import { buildEmiRecommendations, buildEmiCoachOptions } from '../lib/emi/emiRecommendationEngine';
import { extractCommerceContext } from '../lib/emi/emiContextEngine';
import { useGlobalState } from '../context/GlobalStateContext';
import type { CatalogProduct } from '../types/catalog';

export function useEmiAssistant(partialContext: Partial<EmiPageContext> = {}) {
  const location = useLocation();
  const { allCatalogProducts } = useGlobalState();

  const context = useMemo(
    () => buildPageContext(location.pathname, partialContext),
    [location.pathname, partialContext],
  );

  const relatedProducts = useMemo((): CatalogProduct[] => {
    if (partialContext.productIds?.length) {
      return partialContext.productIds
        .map((id) => allCatalogProducts.find((p) => String(p.id) === String(id)))
        .filter(Boolean) as CatalogProduct[];
    }
    if (context.pageId === 'product' && context.entityId) {
      const p = allCatalogProducts.find((x) => String(x.id) === context.entityId || x.slug === context.entityId);
      if (!p) return [];
      return [
        p,
        ...allCatalogProducts.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 3),
      ];
    }
    return allCatalogProducts.slice(0, 4);
  }, [allCatalogProducts, context.entityId, context.pageId, partialContext.productIds]);

  const recommendations = useMemo(
    () => buildEmiRecommendations({ context, products: relatedProducts }),
    [context, relatedProducts],
  );

  const coachOptions = useMemo(
    () => buildEmiCoachOptions(extractCommerceContext(context), relatedProducts),
    [context, relatedProducts],
  );

  const assistantId = useMemo(() => resolveAssistantId(context), [context]);

  return {
    assistantId,
    context,
    recommendations,
    coachOptions,
    relatedProducts,
    isLoading: false,
  };
}
