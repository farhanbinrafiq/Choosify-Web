import { brandPath, productPath } from '../../../lib/publicUrls';
import type { CatalogDealsBanner } from '../../types/catalog';

export function resolveDealsBannerHref(
  banner: Pick<CatalogDealsBanner, 'destinationType' | 'destinationRef'> & { href?: string },
): string {
  if (banner.href) return banner.href;
  const ref = String(banner.destinationRef || '').trim();
  if (banner.destinationType === 'product') return ref ? productPath({ id: ref }) : '/deals';
  if (banner.destinationType === 'brand') return ref ? brandPath({ id: ref }) : '/brands';
  if (!ref) return '/deals';
  if (/^https?:\/\//i.test(ref) || ref.startsWith('/')) return ref;
  return `/${ref}`;
}
