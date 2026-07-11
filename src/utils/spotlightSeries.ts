import type { SpotlightSeries } from '../types/spotlight/discovery/series';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';

const NOW = new Date().toISOString();

function buildEpisodes(prefix: string, titles: string[], content: SpotlightContent[]): SpotlightSeries['episodes'] {
  return titles.map((title, i) => {
    const linked = content[i];
    return {
      episodeId: `${prefix}-ep-${i + 1}`,
      seasonNumber: 1,
      episodeNumber: i + 1,
      title,
      contentId: linked?.contentId,
      campaignId: linked?.sourceKind === 'campaign' ? linked.sourceId : undefined,
      guideId: linked?.sourceKind === 'guide' ? linked.sourceId : undefined,
      productIds: linked?.connections.productIds ?? [],
      publishedAt: linked?.publishedAt ?? NOW,
      thumbnailUrl: linked?.media?.thumbnail,
    };
  });
}

export function listSpotlightSeries(allContent: SpotlightContent[]): SpotlightSeries[] {
  const campaigns = allContent.filter((c) => c.sourceKind === 'campaign').slice(0, 6);
  const guides = allContent.filter((c) => ['buying_guide', 'tutorial'].includes(c.contentType)).slice(0, 6);

  return [
    {
      seriesId: 'series-photo',
      slug: 'photography-masterclass',
      title: 'Photography Masterclass',
      description: 'Learn photography from basics to pro.',
      tags: ['photography', 'tutorial'],
      seasons: 1,
      episodes: buildEpisodes('photo', ['Episode 1: Basics', 'Episode 2: Lighting', 'Episode 3: Editing'], guides),
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      seriesId: 'series-samsung-ai',
      slug: 'samsung-ai-series',
      title: 'Samsung AI Series',
      description: 'Explore Samsung AI features across devices.',
      tags: ['samsung', 'ai'],
      seasons: 1,
      episodes: buildEpisodes('samsung', ['Galaxy AI Intro', 'Camera AI', 'Productivity AI'], campaigns),
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      seriesId: 'series-creator-weekly',
      slug: 'creator-weekly-picks',
      title: 'Creator Weekly Picks',
      description: 'Top creator recommendations each week.',
      tags: ['creator'],
      seasons: 1,
      episodes: buildEpisodes('creator', ['Week 1', 'Week 2', 'Week 3'], allContent.filter((c) => c.publisher.publisherType === 'creator').slice(0, 3)),
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      seriesId: 'series-travel',
      slug: 'travel-diaries',
      title: 'Travel Diaries',
      description: 'Destination guides and travel tips.',
      tags: ['travel'],
      seasons: 1,
      episodes: buildEpisodes('travel', ['Bangkok', 'Dubai', 'Singapore'], guides),
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      seriesId: 'series-cooking',
      slug: 'cooking-series',
      title: 'Cooking Series',
      description: 'Recipes and kitchen essentials.',
      tags: ['food'],
      seasons: 1,
      episodes: buildEpisodes('cook', ['Starters', 'Mains', 'Desserts'], guides),
      createdAt: NOW,
      updatedAt: NOW,
    },
  ];
}

export function getSeriesBySlug(slug: string, allContent: SpotlightContent[]): SpotlightSeries | undefined {
  return listSpotlightSeries(allContent).find((s) => s.slug === slug);
}

/** Link campaigns with parent/child relationships into series when available */
export function inferSeriesFromCampaigns(): SpotlightSeries[] {
  const campaigns = listCampaignRecords();
  const parents = campaigns.filter((c) => c.relationships?.childCampaignIds?.length);
  return parents.map((parent) => ({
    seriesId: `series-${parent.campaignId}`,
    slug: `${parent.campaignSlug}-series`,
    title: `${parent.headline} Series`,
    seasons: 1,
    tags: parent.campaignTags ?? [],
    episodes: (parent.relationships?.childCampaignIds ?? []).map((cid, i) => ({
      episodeId: `ep-${cid}`,
      seasonNumber: 1,
      episodeNumber: i + 1,
      title: `Part ${i + 1}`,
      campaignId: cid,
      productIds: [],
    })),
    createdAt: parent.createdAt,
    updatedAt: parent.updatedAt,
  }));
}

export function resolveSeriesEpisodeContent(series: SpotlightSeries, allContent: SpotlightContent[]): SpotlightContent[] {
  const ids = new Set(series.episodes.map((e) => e.contentId).filter(Boolean) as string[]);
  return allContent.filter((c) => ids.has(c.contentId));
}
