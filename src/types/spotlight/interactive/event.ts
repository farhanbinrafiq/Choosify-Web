/**
 * Multi-Source Event Hub (CTO) — one event, multiple perspectives
 */

import type { SpotlightLiveSource } from './sources';
import type { SpotlightLiveExperienceKind, SpotlightOfficialLiveKind } from './experience';
import type { SpotlightCollaborationMember } from '../collaboration/engine';
import type { SpotlightLiveTimelineChapter } from './timeline';
import type { SpotlightLivePinRecord } from './pinning';
import type { SpotlightCommerceOverlayV2 } from '../commerce/overlay';
import type { SpotlightPublisher } from '../experience/publisher';
import type { SpotlightInteractiveCommerceDomain } from './experience';

export interface SpotlightInteractiveCommerceEvent {
  eventId: string;
  contentId: string;
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  experienceKind: SpotlightLiveExperienceKind;
  officialKind?: SpotlightOfficialLiveKind;
  domain: SpotlightInteractiveCommerceDomain;
  status: 'live' | 'upcoming' | 'replay' | 'ended' | 'cancelled';
  scheduledAt?: string;
  endedAt?: string;
  timezone: string;
  posterUrl?: string;
  /** Active embed sources — user picks perspective */
  sources: SpotlightLiveSource[];
  activeSourceId: string;
  publisher: SpotlightPublisher;
  collaborators: SpotlightCollaborationMember[];
  commerce: SpotlightCommerceOverlayV2;
  timeline: SpotlightLiveTimelineChapter[];
  pins: SpotlightLivePinRecord[];
  /** Viewer count — future */
  viewerCount?: number;
  notifyMeEnabled: boolean;
  calendarPlaceholder?: boolean;
  relatedContentIds: string[];
}

export interface SpotlightMultiSourceEventHub {
  event: SpotlightInteractiveCommerceEvent;
  /** All perspectives in one campaign ecosystem */
  perspectives: SpotlightLiveSource[];
}
