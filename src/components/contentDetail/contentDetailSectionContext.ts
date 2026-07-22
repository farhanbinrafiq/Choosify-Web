import type { SpotlightContent } from '../../types/spotlight/experience/content';

/** Shared render context for optional Content Detail sections */
export interface ContentDetailSectionContext {
  content: SpotlightContent | null;
  category?: string | null;
  /** Products linked to this content (already resolved) */
  products: any[];
  /** Optional load-more for large catalogs */
  onLoadMoreProducts?: () => void;
  hasMoreProducts?: boolean;
}
