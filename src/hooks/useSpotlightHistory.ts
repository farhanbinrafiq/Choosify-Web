import { useCallback, useMemo } from 'react';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import {
  getContinueReading,
  getContinueWatching,
  getRecentlyViewed,
  listHistory,
  pushHistory,
} from '../utils/spotlightUserSignals';

export function useSpotlightHistory(allContent: SpotlightContent[] = []) {
  const history = useMemo(() => listHistory(), []);

  const recordView = useCallback((content: SpotlightContent) => {
    pushHistory({
      contentId: content.contentId,
      kind: content.isLive || content.media?.videoUrl ? 'watch' : 'read',
      href: content.href,
      headline: content.headline,
      progress: 0,
    });
  }, []);

  const recentlyViewed = useMemo(() => {
    const ids = getRecentlyViewed().map((h) => h.contentId);
    return allContent.filter((c) => ids.includes(c.contentId));
  }, [allContent, history]);

  const continueWatching = useMemo(() => {
    const ids = getContinueWatching().map((h) => h.contentId);
    return allContent.filter((c) => ids.includes(c.contentId));
  }, [allContent, history]);

  const continueReading = useMemo(() => {
    const ids = getContinueReading().map((h) => h.contentId);
    return allContent.filter((c) => ids.includes(c.contentId));
  }, [allContent, history]);

  return { history, recordView, recentlyViewed, continueWatching, continueReading };
}
