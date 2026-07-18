import type { EmiPageContext } from '../../types/emi';
import { resolveEmiPageId } from './pageRegistry';
import { assistantForPage } from './assistantRegistry';

export function buildPageContext(pathname: string, partial: Partial<EmiPageContext> = {}): EmiPageContext {
  const pageId = partial.pageId ?? resolveEmiPageId(pathname);
  return {
    pageId,
    pathname,
    title: partial.title ?? (typeof document !== 'undefined' ? document.title : undefined),
    entityId: partial.entityId,
    entityLabel: partial.entityLabel,
    productIds: partial.productIds,
    brandIds: partial.brandIds,
    contentId: partial.contentId,
    compareIds: partial.compareIds,
    query: partial.query,
    metadata: partial.metadata,
  };
}

export function resolveAssistantId(context: EmiPageContext) {
  return assistantForPage(context.pageId)?.id ?? 'discovery';
}

/** Commerce context slice for recommendations */
export interface EmiCommerceContext {
  productTitle?: string;
  price?: number;
  rating?: number;
  brand?: string;
  category?: string;
  inStock?: boolean;
  compareLabels?: string;
  spotlightHeadline?: string;
  spotlightDescription?: string;
  linkedProductCount?: number;
  opportunityTitle?: string;
  coachingMessage?: string;
  estimatedImpact?: number;
}

export function extractCommerceContext(context: EmiPageContext): EmiCommerceContext {
  const m = context.metadata ?? {};
  return {
    productTitle: context.entityLabel,
    price: typeof m.price === 'number' ? m.price : undefined,
    rating: typeof m.rating === 'number' ? m.rating : undefined,
    brand: typeof m.brand === 'string' ? m.brand : undefined,
    category: typeof m.category === 'string' ? m.category : undefined,
    inStock: typeof m.inStock === 'boolean' ? m.inStock : undefined,
    compareLabels: typeof m.compareLabels === 'string' ? m.compareLabels : undefined,
    spotlightHeadline: typeof m.headline === 'string' ? m.headline : context.entityLabel,
    spotlightDescription: typeof m.description === 'string' ? m.description : undefined,
    linkedProductCount: context.productIds?.length,
    opportunityTitle: typeof m.opportunityTitle === 'string' ? m.opportunityTitle : undefined,
    coachingMessage: typeof m.coachingMessage === 'string' ? m.coachingMessage : undefined,
    estimatedImpact: typeof m.estimatedImpact === 'number' ? m.estimatedImpact : undefined,
  };
}
