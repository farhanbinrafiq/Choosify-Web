import { useCallback, useMemo, useState } from 'react';
import { SPOTLIGHT_SEARCH_RECENT_KEY } from '../types/spotlight/discovery/search';
import { buildSearchSuggestions, searchSpotlightContent } from '../utils/spotlightSearch';
import { listSpotlightCollections } from '../utils/spotlightCollections';
import { listSpotlightSeries } from '../utils/spotlightSeries';
import { useSpotlightExperience } from './useSpotlightExperience';

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(SPOTLIGHT_SEARCH_RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSpotlightSearch() {
  const { allContent } = useSpotlightExperience();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(loadRecent);

  const collections = useMemo(() => listSpotlightCollections(allContent), [allContent]);
  const series = useMemo(() => listSpotlightSeries(allContent), [allContent]);

  const results = useMemo(
    () => searchSpotlightContent(query, allContent, collections, series),
    [query, allContent, collections, series],
  );

  const suggestions = useMemo(() => buildSearchSuggestions(recent), [recent]);

  const submitSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    setQuery(trimmed);
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 8);
    setRecent(next);
    try {
      localStorage.setItem(SPOTLIGHT_SEARCH_RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [recent]);

  return { query, setQuery, submitSearch, results, suggestions, recent };
}
