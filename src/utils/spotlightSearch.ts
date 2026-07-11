import type { SpotlightSearchResult, SpotlightSearchSuggestion } from '../types/spotlight/discovery/search';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightCollection } from '../types/spotlight/discovery/collections';
import type { SpotlightSeries } from '../types/spotlight/discovery/series';

const POPULAR_SEARCHES = [
  'Samsung Galaxy',
  'iPhone deals',
  'Live now',
  'Buying guides',
  'Creator reviews',
  'Eid sale',
  'Smart home',
  'Camera comparison',
];

const TRENDING_SEARCHES = ['Tech Festival', 'AI Products', 'Photography Week', 'Travel Deals'];

export function buildSearchSuggestions(recent: string[]): SpotlightSearchSuggestion[] {
  const recentItems: SpotlightSearchSuggestion[] = recent.slice(0, 5).map((q) => ({
    label: q,
    query: q,
    kind: 'recent',
  }));
  const popular: SpotlightSearchSuggestion[] = POPULAR_SEARCHES.map((q) => ({
    label: q,
    query: q,
    kind: 'popular',
  }));
  const trending: SpotlightSearchSuggestion[] = TRENDING_SEARCHES.map((q) => ({
    label: q,
    query: q,
    kind: 'trending',
  }));
  return [...recentItems, ...popular.slice(0, 4), ...trending.slice(0, 3)];
}

function contentToResult(content: SpotlightContent, score: number): SpotlightSearchResult {
  let kind: SpotlightSearchResult['kind'] = 'campaign';
  if (content.contentType === 'live' || content.isLive) kind = 'live';
  else if (content.publisher.publisherType === 'creator') kind = 'creator';
  else if (content.contentType === 'announcement') kind = 'announcement';
  else if (['buying_guide', 'tutorial'].includes(content.contentType)) kind = 'guide';
  else if (['product_review', 'creator_review'].includes(content.contentType)) kind = 'review';
  else if (content.contentType === 'event') kind = 'event';

  return {
    kind,
    entityId: content.sourceId,
    contentId: content.contentId,
    title: content.headline,
    subtitle: content.publisher.name,
    href: content.href,
    score,
    isTrending: (content.popularityScore ?? 0) >= 70,
  };
}

export function searchSpotlightContent(
  query: string,
  allContent: SpotlightContent[],
  collections: SpotlightCollection[],
  series: SpotlightSeries[],
): SpotlightSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SpotlightSearchResult[] = [];

  for (const item of allContent) {
    const hay = `${item.headline} ${item.description ?? ''} ${item.publisher.name} ${item.contentType}`.toLowerCase();
    if (!hay.includes(q)) continue;
    const score = (item.discoveryScore?.overall ?? item.popularityScore ?? 50) + (hay.startsWith(q) ? 20 : 0);
    results.push(contentToResult(item, score));
  }

  for (const col of collections) {
    if (!`${col.name} ${col.description ?? ''} ${col.tags.join(' ')}`.toLowerCase().includes(q)) continue;
    results.push({
      kind: 'collection',
      entityId: col.collectionId,
      title: col.name,
      subtitle: col.kind,
      href: `/spotlight/collections/${col.slug}`,
      score: col.isFeatured ? 80 : 60,
    });
  }

  for (const s of series) {
    if (!`${s.title} ${s.description ?? ''}`.toLowerCase().includes(q)) continue;
    results.push({
      kind: 'series',
      entityId: s.seriesId,
      title: s.title,
      subtitle: `${s.episodes.length} episodes`,
      href: `/spotlight/series/${s.slug}`,
      score: 65,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 24);
}
