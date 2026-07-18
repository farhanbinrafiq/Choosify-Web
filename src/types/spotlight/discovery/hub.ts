/**
 * Unified Discovery Hub (CTO) — every campaign becomes a hub.
 */

import type { SpotlightHubSectionId } from './navigation';

export interface SpotlightHubSection {
  id: SpotlightHubSectionId;
  title: string;
  contentIds: string[];
  href?: string;
}

export interface SpotlightHub {
  hubId: string;
  slug: string;
  title: string;
  publisherId: string;
  sections: SpotlightHubSection[];
  /** Campaign journey stage */
  journeyStage?: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}
