/**
 * Universal Spotlight Content Registry — LE-005 Phase 5.2
 * Single source of truth for content types, routes, and metadata.
 */
import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';

export interface SpotlightContentTypeDefinition {
  id: SpotlightContentType | SpotlightContentAlias;
  label: string;
  group: 'commerce' | 'editorial' | 'live' | 'community' | 'future';
  /** Maps legacy guide.type or campaign hints */
  legacyHints?: string[];
  filterable: boolean;
  tabId?: string;
}

/** Extended aliases mapped to canonical SpotlightContentType at resolve time */
export type SpotlightContentAlias =
  | 'video'
  | 'reel'
  | 'blog'
  | 'story'
  | 'collection_entry'
  | 'series_episode'
  | 'article'
  | 'educational';

export const SPOTLIGHT_CONTENT_TYPE_REGISTRY: SpotlightContentTypeDefinition[] = [
  { id: 'campaign', label: 'Campaigns', group: 'commerce', filterable: true, tabId: 'campaigns' },
  { id: 'live', label: 'Live', group: 'live', filterable: true, tabId: 'live' },
  { id: 'livestream_replay', label: 'Live Replay', group: 'live', filterable: true, tabId: 'live' },
  { id: 'creator_review', label: 'Reviews', group: 'community', legacyHints: ['review'], filterable: true, tabId: 'reviews' },
  { id: 'product_review', label: 'Product Reviews', group: 'community', filterable: true, tabId: 'reviews' },
  { id: 'buying_guide', label: 'Guides', group: 'editorial', legacyHints: ['buying'], filterable: true, tabId: 'guides' },
  { id: 'tutorial', label: 'Tutorials', group: 'editorial', filterable: true, tabId: 'guides' },
  { id: 'recommendation', label: 'Recommendations', group: 'editorial', filterable: true, tabId: 'recommendations' },
  { id: 'video', label: 'Videos', group: 'editorial', legacyHints: ['video'], filterable: true, tabId: 'videos' },
  { id: 'reel', label: 'Reels', group: 'editorial', legacyHints: ['reels', 'shorts'], filterable: true, tabId: 'reels' },
  { id: 'blog', label: 'Blogs', group: 'editorial', legacyHints: ['blog', 'article'], filterable: true, tabId: 'blogs' },
  { id: 'editorial', label: 'Articles', group: 'editorial', filterable: true, tabId: 'blogs' },
  { id: 'announcement', label: 'Announcements', group: 'editorial', filterable: true, tabId: 'announcements' },
  { id: 'new_launch', label: 'Launches', group: 'commerce', filterable: true, tabId: 'launches' },
  { id: 'promotion', label: 'Promotions', group: 'commerce', filterable: true, tabId: 'campaigns' },
  { id: 'event', label: 'Events', group: 'editorial', filterable: true, tabId: 'announcements' },
  { id: 'brand_story', label: 'Brand Stories', group: 'editorial', filterable: true, tabId: 'campaigns' },
  { id: 'story', label: 'Stories', group: 'editorial', filterable: true, tabId: 'stories' },
  { id: 'collection_entry', label: 'Collections', group: 'editorial', filterable: false, tabId: 'collections' },
  { id: 'series_episode', label: 'Series', group: 'editorial', filterable: false, tabId: 'series' },
  { id: 'article', label: 'Educational', group: 'editorial', filterable: true, tabId: 'guides' },
  { id: 'educational', label: 'Educational', group: 'editorial', filterable: true, tabId: 'guides' },
  { id: 'comparison', label: 'Comparisons', group: 'editorial', filterable: true, tabId: 'guides' },
  { id: 'tips', label: 'Tips', group: 'editorial', filterable: true, tabId: 'guides' },
  { id: 'whats_on', label: "What's On", group: 'editorial', filterable: true, tabId: 'announcements' },
  { id: 'community_pick', label: 'Community Picks', group: 'community', filterable: true, tabId: 'featured' },
  { id: 'ai_content', label: 'AI Content', group: 'future', filterable: false },
  { id: 'podcast', label: 'Podcasts', group: 'future', filterable: false },
  { id: 'webinar', label: 'Webinars', group: 'future', filterable: false },
];

/** Map legacy guide.type to canonical content type */
export function resolveLegacyGuideContentType(
  guideType: string | undefined,
  category: string,
  tags: string[],
): SpotlightContentType {
  const t = (guideType ?? '').toLowerCase();
  const cat = category.toLowerCase();
  if (tags.some((x) => x.includes('comparison')) || cat.includes('comparison')) return 'comparison';
  if (tags.some((x) => x.includes('tutorial')) || cat.includes('tutorial')) return 'tutorial';
  if (tags.some((x) => x.includes('tip')) || cat.includes('tip')) return 'tips';
  // All catalog guide formats use the Guide Detail (buying_guide) shell
  if (
    t === 'video' ||
    t === 'reels' ||
    t === 'shorts' ||
    t === 'blog' ||
    t === 'article' ||
    cat.includes('buying') ||
    tags.some((x) => x.includes('buying') || x.includes('guide') || x.includes('review'))
  ) {
    return 'buying_guide';
  }
  return 'buying_guide';
}

export function contentTypesForTab(tabId: string): SpotlightContentType[] {
  const aliasMap: Record<string, SpotlightContentType[]> = {
    featured: [],
    campaigns: ['campaign', 'promotion', 'brand_story'],
    live: ['live', 'livestream_replay'],
    reviews: ['creator_review', 'product_review'],
    guides: ['buying_guide', 'tutorial', 'tips', 'comparison'],
    recommendations: ['recommendation'],
    videos: ['product_review', 'recommendation', 'creator_review'],
    reels: ['recommendation', 'creator_review'],
    blogs: ['editorial', 'brand_story'],
    announcements: ['announcement', 'event', 'whats_on'],
    launches: ['new_launch'],
    following: [],
    saved: [],
  };
  if (aliasMap[tabId]) return aliasMap[tabId];
  return SPOTLIGHT_CONTENT_TYPE_REGISTRY
    .filter((d) => d.tabId === tabId && !isAlias(d.id))
    .map((d) => d.id as SpotlightContentType);
}

function isAlias(id: SpotlightContentType | SpotlightContentAlias): id is SpotlightContentAlias {
  return ['video', 'reel', 'blog', 'story', 'collection_entry', 'series_episode', 'article', 'educational'].includes(id);
}

export function getContentTypeDefinition(id: SpotlightContentType): SpotlightContentTypeDefinition | undefined {
  return SPOTLIGHT_CONTENT_TYPE_REGISTRY.find((d) => d.id === id);
}
