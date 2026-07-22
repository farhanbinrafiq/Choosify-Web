/**
 * Shared content prioritization for Homepage "Viral Today" and Discover.
 * Computed at request/render time from timestamps — no cron or curated list.
 */

import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightLiveConfig, SpotlightLiveStatus } from '../types/spotlight/experience/live';

export const CONTENT_PRIORITY_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ContentPriorityTier = 'active_live' | 'live_grace' | 'fresh' | 'standard';

export interface ContentPriorityInput {
  id: string;
  publishedAt?: string | null;
  endsAt?: string | null;
  contentType?: string | null;
  isLive?: boolean;
  live?: Pick<SpotlightLiveConfig, 'scheduledAt' | 'endedAt'> & {
    status?: SpotlightLiveStatus;
  } | null;
}

export interface ContentPriorityResult<T> {
  item: T;
  tier: ContentPriorityTier;
  /** Higher = more important within / across tiers */
  rankScore: number;
  publishedMs: number | null;
  endedMs: number | null;
}

export function parseTimestampMs(value?: string | null): number | null {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

export function isWithinWindow(
  timestampMs: number | null,
  nowMs: number,
  windowMs: number = CONTENT_PRIORITY_WINDOW_MS,
): boolean {
  if (timestampMs == null) return false;
  return timestampMs <= nowMs && nowMs - timestampMs <= windowMs;
}

/**
 * Resolve live status from explicit status + schedule window.
 * Does NOT treat `isLive` alone as active (upcoming campaigns also set it).
 */
export function resolveLiveStatus(
  input: ContentPriorityInput,
  nowMs: number = Date.now(),
): SpotlightLiveStatus | null {
  const explicit = input.live?.status;
  const startMs =
    parseTimestampMs(input.live?.scheduledAt) ??
    parseTimestampMs(input.publishedAt);
  const endMs =
    parseTimestampMs(input.live?.endedAt) ??
    parseTimestampMs(input.endsAt);

  const isLiveTyped =
    input.contentType === 'live' ||
    input.contentType === 'livestream_replay' ||
    Boolean(input.live) ||
    Boolean(input.isLive);

  if (!isLiveTyped && !explicit) return null;

  // Prefer schedule window when both start/end exist
  if (startMs != null && endMs != null) {
    if (nowMs < startMs) return 'upcoming';
    if (nowMs <= endMs) return 'live';
    return explicit === 'replay' ? 'replay' : 'ended';
  }

  if (explicit === 'live') return 'live';
  if (explicit === 'upcoming') return 'upcoming';
  if (explicit === 'replay') return 'replay';
  if (explicit === 'ended') return 'ended';

  // Open-ended live-typed content with a start time that has passed
  if (
    input.contentType === 'live' &&
    endMs == null &&
    startMs != null &&
    nowMs >= startMs
  ) {
    return 'live';
  }

  return input.isLive ? 'upcoming' : null;
}

export function classifyContentPriority(
  input: ContentPriorityInput,
  nowMs: number = Date.now(),
): ContentPriorityTier {
  const liveStatus = resolveLiveStatus(input, nowMs);
  const endMs =
    parseTimestampMs(input.live?.endedAt) ??
    parseTimestampMs(input.endsAt);
  const publishedMs = parseTimestampMs(input.publishedAt);

  if (liveStatus === 'live') return 'active_live';

  if (
    (liveStatus === 'ended' || liveStatus === 'replay') &&
    isWithinWindow(endMs, nowMs)
  ) {
    return 'live_grace';
  }

  // Freshness only for non-live / non-upcoming content
  if (liveStatus !== 'upcoming' && isWithinWindow(publishedMs, nowMs)) {
    return 'fresh';
  }

  return 'standard';
}

function tierRank(tier: ContentPriorityTier): number {
  switch (tier) {
    case 'active_live':
      return 4;
    case 'live_grace':
      return 3;
    case 'fresh':
      return 2;
    default:
      return 1;
  }
}

export function scoreContentPriority(
  input: ContentPriorityInput,
  nowMs: number = Date.now(),
): Omit<ContentPriorityResult<ContentPriorityInput>, 'item'> {
  const tier = classifyContentPriority(input, nowMs);
  const publishedMs = parseTimestampMs(input.publishedAt);
  const endedMs =
    parseTimestampMs(input.live?.endedAt) ??
    parseTimestampMs(input.endsAt);

  let secondary = 0;
  if (tier === 'active_live') {
    // Prefer streams that started most recently / are still running
    secondary = publishedMs ?? endedMs ?? 0;
  } else if (tier === 'live_grace') {
    // Most recently ended first
    secondary = endedMs ?? 0;
  } else if (tier === 'fresh') {
    secondary = publishedMs ?? 0;
  } else {
    secondary = publishedMs ?? 0;
  }

  return {
    tier,
    rankScore: tierRank(tier) * 1_000_000_000_000 + secondary,
    publishedMs,
    endedMs,
  };
}

/**
 * Stable sort: active LIVE → LIVE grace (24h) → fresh (24h, newest first) → original order.
 * Older content fills remaining slots after prioritized items (option A).
 */
export function prioritizeContent<T>(
  items: T[],
  toInput: (item: T) => ContentPriorityInput,
  nowMs: number = Date.now(),
): ContentPriorityResult<T>[] {
  return items
    .map((item, index) => {
      const scored = scoreContentPriority(toInput(item), nowMs);
      return { item, ...scored, index };
    })
    .sort((a, b) => {
      if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
      return a.index - b.index;
    })
    .map(({ index: _index, ...rest }) => rest);
}

export function spotlightContentToPriorityInput(
  content: SpotlightContent,
): ContentPriorityInput {
  return {
    id: content.contentId,
    publishedAt: content.publishedAt,
    endsAt: content.endsAt,
    contentType: content.contentType,
    isLive: content.isLive,
    live: content.live
      ? {
          status: content.live.status,
          scheduledAt: content.live.scheduledAt,
          endedAt: content.live.endedAt,
        }
      : null,
  };
}

/** True while stream is active OR within the 24h post-end grace window. */
export function isLiveFeaturedSize(
  input: ContentPriorityInput,
  nowMs: number = Date.now(),
): boolean {
  const tier = classifyContentPriority(input, nowMs);
  return tier === 'active_live' || tier === 'live_grace';
}

function isLiveTypedContent(input: ContentPriorityInput): boolean {
  return (
    input.contentType === 'live' ||
    input.contentType === 'livestream_replay' ||
    Boolean(input.live) ||
    Boolean(input.isLive)
  );
}

/**
 * Livestream that has ended and is past the 24h grace window —
 * render at regular YouTube size with a "Previously LIVE" badge.
 */
export function isPreviouslyLive(
  input: ContentPriorityInput,
  nowMs: number = Date.now(),
): boolean {
  if (!isLiveTypedContent(input)) return false;
  if (isLiveFeaturedSize(input, nowMs)) return false;
  const liveStatus = resolveLiveStatus(input, nowMs);
  return liveStatus === 'ended' || liveStatus === 'replay' || input.contentType === 'livestream_replay';
}

export function prioritizeSpotlightContent(
  items: SpotlightContent[],
  nowMs: number = Date.now(),
): SpotlightContent[] {
  return prioritizeContent(items, spotlightContentToPriorityInput, nowMs).map((r) => r.item);
}

export function hasActiveLiveContent(
  items: Array<ContentPriorityInput | SpotlightContent>,
  nowMs: number = Date.now(),
): boolean {
  return items.some((item) => {
    const input =
      'contentId' in item
        ? spotlightContentToPriorityInput(item as SpotlightContent)
        : (item as ContentPriorityInput);
    return classifyContentPriority(input, nowMs) === 'active_live';
  });
}
