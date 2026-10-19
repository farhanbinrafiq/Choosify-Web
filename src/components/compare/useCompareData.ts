/**
 * Real data the Compare page derives from the canonical selection:
 *  - public customer reviews per selected product / brand (operations API)
 *  - organic alternatives from the catalog comparison endpoints
 * Both re-run whenever the selection changes; nothing is cached across a
 * Clear All in a way that could resurface a removed subject.
 */
import { useEffect, useRef, useState } from 'react';
import { operationsApi, type PublicProductReview } from '../../services/operationsApi';
import { comparisonApi, type BrandComparisonCard, type ProductComparisonCard } from '../../services/comparisonApi';
import type { CompareEntityType } from './compareModel';

export type ReviewsByKey = Record<string, PublicProductReview[] | undefined>;

/**
 * Public reviews for the selected subjects. `keys` are product ids (product
 * mode) or brand names (brand mode); other modes have no public reviews.
 */
export function usePublicReviews(type: CompareEntityType, keys: string[]): { byKey: ReviewsByKey; loading: boolean } {
  const cache = useRef<Map<string, PublicProductReview[]>>(new Map());
  const [byKey, setByKey] = useState<ReviewsByKey>({});
  const [loading, setLoading] = useState(false);
  const sig = `${type}|${keys.join('\u0000')}`;

  useEffect(() => {
    let alive = true;
    if (type !== 'product' && type !== 'brand') {
      setByKey({});
      setLoading(false);
      return;
    }
    const missing = keys.filter((k) => !cache.current.has(`${type}:${k}`));
    const publish = () => {
      const next: ReviewsByKey = {};
      for (const k of keys) next[k] = cache.current.get(`${type}:${k}`);
      if (alive) setByKey(next);
    };
    publish();
    if (!missing.length) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void Promise.all(
      missing.map(async (k) => {
        try {
          const rows = type === 'product' ? await operationsApi.listProductReviews(k) : await operationsApi.listBrandReviews(k);
          cache.current.set(`${type}:${k}`, Array.isArray(rows) ? rows : []);
        } catch {
          // An unreachable review service is not "no reviews": leave it unknown.
        }
      }),
    ).then(() => {
      publish();
      if (alive) setLoading(false);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  return { byKey, loading };
}

export type OrganicAlternative =
  | { kind: 'product'; card: ProductComparisonCard }
  | { kind: 'brand'; card: BrandComparisonCard };

/**
 * Organic alternatives from the catalog comparison endpoints, anchored on the
 * first selected product / brand and excluding anything already selected.
 * Creator and guide comparisons have no organic recommendation source.
 */
export function useOrganicAlternatives(type: CompareEntityType, selectedIds: string[]): OrganicAlternative[] {
  const [items, setItems] = useState<OrganicAlternative[]>([]);
  const anchor = selectedIds[0] || '';
  const sig = `${type}|${selectedIds.join(',')}`;

  useEffect(() => {
    let alive = true;
    if (!anchor || (type !== 'product' && type !== 'brand')) {
      setItems([]);
      return;
    }
    const exclude = new Set(selectedIds);
    (async () => {
      try {
        if (type === 'product') {
          const r = await comparisonApi.getProductComparison(anchor);
          const list = (r?.candidates ?? []).filter((c) => !exclude.has(String(c.id))).slice(0, 4);
          if (alive) setItems(list.map((card) => ({ kind: 'product' as const, card })));
        } else {
          const r = await comparisonApi.getBrandComparison(anchor);
          const list = (r?.candidates ?? []).filter((c) => !exclude.has(String(c.id))).slice(0, 4);
          if (alive) setItems(list.map((card) => ({ kind: 'brand' as const, card })));
        }
      } catch {
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  return items;
}
