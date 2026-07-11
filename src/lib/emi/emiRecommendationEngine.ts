import type { CatalogProduct } from '../../types/catalog';
import type { EmiActionResult, EmiCoachOption, EmiPageContext, EmiRecommendation } from '../../types/emi';
import { confidenceFromScore } from './confidenceRegistry';
import { extractCommerceContext } from './emiContextEngine';
import { actionDefinition, type EmiUnifiedActionDefinition } from './actionRegistry';
import type { EmiActionId } from '../../types/emi';

export interface EmiRecommendationInput {
  context: EmiPageContext;
  products?: CatalogProduct[];
}

function productRecommendations(ctx: ReturnType<typeof extractCommerceContext>, products: CatalogProduct[]): EmiRecommendation[] {
  const recs: EmiRecommendation[] = [];
  const title = ctx.productTitle ?? 'this product';
  const price = ctx.price;
  const rating = ctx.rating ?? 4;

  recs.push({
    id: 'product-summary',
    kind: 'summary',
    title: 'Product at a glance',
    body: `${title}${price ? ` is priced at ৳${price.toLocaleString()}` : ''}${ctx.brand ? ` from ${ctx.brand}` : ''}. Choosify buyers rate it ${rating}/5 — check specs and reviews before you decide.`,
    confidence: confidenceFromScore(75),
    confidenceScore: 75,
    why: 'Based on catalog listing, price, and rating on Choosify.',
    dataConsidered: ['Product title', 'Price', 'Rating', 'Brand'],
  });

  recs.push({
    id: 'product-buying-tip',
    kind: 'buying_tip',
    title: 'Buying tip',
    body: ctx.inStock === false
      ? 'This item is currently out of stock. Add to wishlist or compare alternatives while you wait.'
      : 'Compare similar products on Choosify before checkout — bundles and add-ons may offer better value.',
    confidence: 'medium',
    confidenceScore: 65,
    why: 'Stock status and compare workflow on Choosify.',
    dataConsidered: ['Inventory status'],
  });

  if (products.length > 1) {
    const alt = products[1];
    recs.push({
      id: 'product-alternative',
      kind: 'alternative',
      title: 'Alternative to consider',
      body: `${alt.title} (৳${alt.price.toLocaleString()}) is a similar option in the same category.`,
      confidence: 'medium',
      confidenceScore: 60,
      why: 'Same category catalog match.',
      dataConsidered: ['Category', 'Price range'],
      relatedProductIds: [String(alt.id)],
    });
  }

  return recs;
}

function compareRecommendations(ctx: ReturnType<typeof extractCommerceContext>): EmiRecommendation[] {
  const labels = ctx.compareLabels?.split(',').map((s) => s.trim()).filter(Boolean) ?? ['Option A', 'Option B'];
  return [
    {
      id: 'compare-diff',
      kind: 'expert_advice',
      title: 'Major differences',
      body: `Emi sees ${labels.length} items in your compare set. Focus on price, warranty, and verified reviews — the biggest gaps usually appear in build quality and after-sales support.`,
      confidence: 'medium',
      confidenceScore: 70,
      why: 'Compare matrix fields and Choosify trust signals.',
      dataConsidered: ['Compare selection', 'Trust scores'],
    },
    {
      id: 'compare-recommendation',
      kind: 'recommendation',
      title: 'Who should buy which',
      body: `${labels[0]} suits buyers prioritizing premium build and longevity. ${labels[1] ?? 'The alternative'} is stronger for budget-conscious shoppers who still want verified listings.`,
      confidence: 'medium',
      confidenceScore: 62,
      why: 'Heuristic fit based on compare mode and item labels.',
      dataConsidered: labels,
    },
  ];
}

function spotlightRecommendations(ctx: ReturnType<typeof extractCommerceContext>): EmiRecommendation[] {
  return [
    {
      id: 'spotlight-summary',
      kind: 'summary',
      title: 'Key takeaways',
      body: ctx.spotlightDescription
        ? `${ctx.spotlightHeadline}: ${ctx.spotlightDescription.slice(0, 160)}${ctx.spotlightDescription.length > 160 ? '…' : ''}`
        : `${ctx.spotlightHeadline ?? 'This Spotlight experience'} helps you discover products through curated content on Choosify.`,
      confidence: 'high',
      confidenceScore: 82,
      why: 'Spotlight headline, description, and linked products.',
      dataConsidered: ['Headline', 'Description', 'Linked products'],
    },
    {
      id: 'spotlight-shopping',
      kind: 'buying_tip',
      title: 'Shopping advice',
      body: ctx.linkedProductCount
        ? `${ctx.linkedProductCount} product${ctx.linkedProductCount > 1 ? 's are' : ' is'} linked — start with the featured item, then compare alternatives before buying.`
        : 'Link products to make this Spotlight fully shoppable and get personalized compare suggestions.',
      confidence: ctx.linkedProductCount ? 'high' : 'low',
      confidenceScore: ctx.linkedProductCount ? 78 : 40,
      why: 'Commerce overlay on Spotlight content.',
      dataConsidered: ['Featured products'],
    },
  ];
}

function opportunityRecommendations(ctx: ReturnType<typeof extractCommerceContext>): EmiRecommendation[] {
  return [
    {
      id: 'opp-explain',
      kind: 'expert_advice',
      title: ctx.opportunityTitle ?? 'Why this matters',
      body: ctx.coachingMessage ?? 'Completing this improvement helps shoppers discover and trust your Spotlight experience.',
      confidence: 'high',
      confidenceScore: 85,
      why: 'Publisher Success Coach message and audit rule.',
      dataConsidered: ['Opportunity severity', 'Estimated impact'],
      estimatedImpact: ctx.estimatedImpact ? `+${ctx.estimatedImpact}% engagement` : undefined,
      suggestedAction: 'Apply suggested fix in Publisher Studio',
    },
  ];
}

function searchRecommendations(query?: string): EmiRecommendation[] {
  if (!query) {
    return [{
      id: 'search-hint',
      kind: 'did_you_know',
      title: 'Try asking Emi',
      body: 'Search conversationally — e.g. "best phones under 30000" or "gaming laptop for students". Emi suggests categories, brands, and Spotlight guides.',
      confidence: 'placeholder',
      confidenceScore: 50,
      why: 'Choosify search and catalog structure.',
      dataConsidered: ['Popular searches'],
    }];
  }
  return [{
    id: 'search-context',
    kind: 'recommendation',
    title: `Results for "${query}"`,
    body: 'Emi can narrow by budget, brand, or use case. Use Compare to evaluate your top picks side-by-side.',
    confidence: 'medium',
    confidenceScore: 68,
    why: 'Active search query and catalog filters.',
    dataConsidered: ['Search query'],
  }];
}

export function buildEmiRecommendations(input: EmiRecommendationInput): EmiRecommendation[] {
  const ctx = extractCommerceContext(input.context);
  const products = input.products ?? [];

  switch (input.context.pageId) {
    case 'product':
    case 'brand':
      return productRecommendations(ctx, products);
    case 'compare':
      return compareRecommendations(ctx);
    case 'spotlight_content':
    case 'spotlight':
    case 'collection':
    case 'series':
      return spotlightRecommendations(ctx);
    case 'opportunity_center':
      return opportunityRecommendations(ctx);
    case 'search':
      return searchRecommendations(input.context.query);
    default:
      return [{
        id: 'discovery-default',
        kind: 'did_you_know',
        title: 'Emi is here to help',
        body: 'Browse products and Spotlight with contextual tips — Emi explains, compares, and recommends without leaving your workflow.',
        confidence: 'placeholder',
        confidenceScore: 45,
        why: 'Page context on Choosify.',
        dataConsidered: ['Current page'],
      }];
  }
}

export function buildEmiCoachOptions(ctx: ReturnType<typeof extractCommerceContext>, products: CatalogProduct[]): EmiCoachOption[] {
  const primary = products[0];
  if (!primary) return [];
  return [
    { id: 'best-value', label: 'Best value', reasoning: `${primary.title} balances price (৳${primary.price.toLocaleString()}) with Choosify ratings for everyday buyers.`, confidence: 'medium', productId: String(primary.id) },
    { id: 'best-budget', label: 'Best budget', reasoning: products.length > 1 ? `${products[products.length - 1].title} is the most affordable comparable option.` : 'Filter by price on Choosify to find budget alternatives.', confidence: 'low', productId: products.length > 1 ? String(products[products.length - 1].id) : undefined },
    { id: 'best-premium', label: 'Best premium', reasoning: 'Premium picks typically have higher ratings, longer warranty, and verified brand pages on Choosify.', confidence: 'low' },
  ];
}

export function buildEmiActionSuggestion(actionId: EmiActionId, context: EmiPageContext): EmiActionResult {
  const def = actionDefinition(actionId);
  const ctx = extractCommerceContext(context);
  const label = def?.label ?? actionId;
  const headline = ctx.spotlightHeadline ?? ctx.productTitle ?? context.entityLabel ?? 'your content';

  const suggestions: Partial<Record<EmiActionId, string>> = {
    optimize_headline: `Try: "${headline} — Shop Verified Deals on Choosify" (clearer commerce intent, under 60 chars).`,
    generate_summary: `Draft: Discover ${headline} with linked products, verified reviews, and compare tools on Choosify.`,
    improve_seo: `Meta title: ${headline} | Choosify Spotlight. Meta description: Shop ${headline} with buyer guides and trusted seller listings.`,
    generate_seo: `Schema type: Product. Meta title under 60 chars. Include primary keyword and brand.`,
    suggest_tags: 'Suggested tags: shopping, deals, compare, verified, bangladesh',
    suggest_products: 'Link 2–4 catalog products that match this content theme for higher conversion.',
    suggest_cta: 'Primary CTA: "Shop Now". Secondary: "Compare Products".',
    translate: 'Architecture ready — connect locale provider in Phase 6.1 for BN/EN pairs.',
    rewrite: `Sharpen the description to lead with buyer benefit, then product proof points.`,
  };

  return {
    actionId,
    label,
    suggestion: suggestions[actionId] ?? `Emi suggestion for ${label} on "${headline}". Connect AI provider to generate live output.`,
    confidence: 'placeholder',
    why: 'Based on draft metadata, opportunity audit, and Choosify publisher patterns.',
    applyHint: 'Review and apply manually in Publisher Studio — auto-apply reserved for future release.',
  };
}