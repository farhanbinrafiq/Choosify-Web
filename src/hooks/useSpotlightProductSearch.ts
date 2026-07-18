import { useMemo, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import type {
  SpotlightProductSearchFilters,
  SpotlightProductSearchSortKey,
} from '../types/spotlight/merchandising/search';
import { searchCatalogProducts } from '../utils/spotlightProductSearch';

const DEFAULT_FILTERS: SpotlightProductSearchFilters = {};
const PAGE_SIZE = 40;

export function useSpotlightProductSearch() {
  const { allCatalogProducts } = useGlobalState();
  const [filters, setFilters] = useState<SpotlightProductSearchFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SpotlightProductSearchSortKey>('newest');
  const [page, setPage] = useState(1);

  const results = useMemo(
    () => searchCatalogProducts(allCatalogProducts, filters, sortBy),
    [allCatalogProducts, filters, sortBy],
  );

  const pageItems = useMemo(
    () => results.slice(0, page * PAGE_SIZE),
    [results, page],
  );

  const hasMore = pageItems.length < results.length;

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    page,
    setPage,
    loadMore: () => setPage((p) => p + 1),
    results: pageItems,
    total: results.length,
    hasMore,
    allCatalogProducts,
  };
}
