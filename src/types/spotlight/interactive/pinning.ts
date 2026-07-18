/**
 * Live product pinning — dynamic during live, preserved on replay
 */

export type SpotlightLivePinEntityKind =
  | 'product'
  | 'service'
  | 'bundle'
  | 'coupon'
  | 'offer'
  | 'announcement'
  | 'guide'
  | 'comparison';

export interface SpotlightLivePinRecord {
  pinId: string;
  eventId: string;
  entityKind: SpotlightLivePinEntityKind;
  entityId: string;
  label: string;
  /** Synchronized timestamp (CTO) */
  timestampSeconds?: number;
  pinnedAt: string;
  pinnedByPublisherId: string;
  sortOrder: number;
  /** Replay preserves all pins */
  preservedOnReplay: boolean;
}

export interface SpotlightLivePinningState {
  eventId: string;
  activePins: SpotlightLivePinRecord[];
  history: SpotlightLivePinRecord[];
}
