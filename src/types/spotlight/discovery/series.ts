/**
 * Spotlight Series — episodic content architecture.
 * Series → Episodes → Campaigns → Products
 */

export interface SpotlightSeriesEpisode {
  episodeId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description?: string;
  /** Linked campaign or guide content */
  contentId?: string;
  campaignId?: string;
  guideId?: string;
  productIds: string[];
  durationSeconds?: number;
  publishedAt?: string;
  thumbnailUrl?: string;
}

export interface SpotlightSeries {
  seriesId: string;
  slug: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  publisherId?: string;
  creatorId?: string;
  brandId?: string;
  tags: string[];
  seasons: number;
  episodes: SpotlightSeriesEpisode[];
  /** Continue watching — last watched episode for user (future) */
  continueFromEpisodeId?: string;
  createdAt: string;
  updatedAt: string;
}
