import { UniversalCommerceCard } from './UniversalCommerceCard';
import { resolveCommerceCardVariant } from './universalCommerceCardTypes';
import type { UniversalContentCardProps } from './universalContentCardTypes';

/**
 * @deprecated Prefer UniversalCommerceCard — kept for backward-compatible imports.
 * Delegates to the Recommendation-card design system.
 */
export function UniversalContentCard(props: UniversalContentCardProps) {
  const variant = resolveCommerceCardVariant(props.model.layoutVariant, props.model.aspectRatio);
  return <UniversalCommerceCard {...props} variant={variant} model={props.model} />;
}
