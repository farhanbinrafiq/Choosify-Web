/**
 * Story Mode — Instagram-like full-screen stories (architecture only).
 */

export type SpotlightStorySlideKind =
  | 'image'
  | 'video'
  | 'product'
  | 'offer'
  | 'guide'
  | 'recommendation'
  | 'cta'
  | 'replay'
  | 'live';

export interface SpotlightStorySlide {
  slideId: string;
  kind: SpotlightStorySlideKind;
  durationMs: number;
  mediaUrl?: string;
  thumbnailUrl?: string;
  headline?: string;
  description?: string;
  entityId?: string;
  href?: string;
  ctaLabel?: string;
}

export interface SpotlightStoryGroup {
  storyGroupId: string;
  publisherId: string;
  publisherName: string;
  publisherAvatar?: string;
  isVerified?: boolean;
  slides: SpotlightStorySlide[];
  /** Progress indicator — viewed slide IDs (future) */
  viewedSlideIds?: string[];
  publishedAt: string;
  expiresAt?: string;
}

export interface SpotlightStoryNavigationContract {
  /** Tap left/right, swipe, progress bars */
  onNext(): void;
  onPrevious(): void;
  onClose(): void;
  onSlideComplete(slideId: string): void;
}
