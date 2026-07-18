import { useEffect, useRef, useState } from 'react';

const DEFAULT_INITIAL = 24;
const DEFAULT_LOAD_MORE = 12;

type UseInfiniteListBatchOptions = {
  initial?: number;
  loadMore?: number;
  /** Reset visible count when this key changes (e.g. search/filter fingerprint). */
  resetKey?: string | number;
};

/**
 * Progressive list reveal — same pattern as SpotlightMixedFeed.
 * Renders `initial` items, then loads `loadMore` more as the sentinel enters view.
 */
export function useInfiniteListBatch<T>(
  items: T[],
  options: UseInfiniteListBatchOptions = {},
) {
  const initial = options.initial ?? DEFAULT_INITIAL;
  const loadMore = options.loadMore ?? DEFAULT_LOAD_MORE;
  const resetKey = options.resetKey ?? items.length;

  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initial, Math.max(items.length, 0) || initial),
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(Math.min(initial, items.length || initial));
  }, [resetKey, initial, items.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + loadMore, items.length));
        }
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length, loadMore, visibleCount]);

  return {
    visibleItems: items.slice(0, visibleCount),
    sentinelRef,
    hasMore: visibleCount < items.length,
    visibleCount,
    totalCount: items.length,
  };
}
