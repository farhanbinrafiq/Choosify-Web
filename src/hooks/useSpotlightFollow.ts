import { useCallback, useState } from 'react';
import type { SpotlightFollowRecord } from '../types/spotlight/discovery/follow';
import { isFollowing, listFollows, toggleFollow } from '../utils/spotlightUserSignals';

export function useSpotlightFollow() {
  const [follows, setFollows] = useState<SpotlightFollowRecord[]>(listFollows);

  const follow = useCallback((record: Omit<SpotlightFollowRecord, 'followedAt'>) => {
    toggleFollow(record);
    setFollows(listFollows());
  }, []);

  const checkFollowing = useCallback(
    (targetKind: SpotlightFollowRecord['targetKind'], targetId: string) =>
      isFollowing(targetKind, targetId) || follows.some((f) => f.targetKind === targetKind && f.targetId === targetId),
    [follows],
  );

  return { follows, follow, isFollowing: checkFollowing };
}
