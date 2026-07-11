/**
 * Replay experience — identical commerce/timeline/pins to live
 */

import type { SpotlightInteractiveCommerceEvent } from './event';

export interface SpotlightReplayExperience {
  event: SpotlightInteractiveCommerceEvent;
  replaySourceId: string;
  /** Timeline + pins copied from live session */
  timelinePreserved: boolean;
  pinsPreserved: boolean;
  offersPreserved: boolean;
  relatedContentPreserved: boolean;
}

export function buildReplayFromEvent(event: SpotlightInteractiveCommerceEvent): SpotlightReplayExperience {
  const replaySource =
    event.sources.find((s) => s.status === 'replay_only' || s.provider === 'youtube_live') ??
    event.sources[0];
  return {
    event: { ...event, status: 'replay', experienceKind: 'replay' },
    replaySourceId: replaySource?.sourceId ?? event.activeSourceId,
    timelinePreserved: true,
    pinsPreserved: true,
    offersPreserved: true,
    relatedContentPreserved: true,
  };
}
