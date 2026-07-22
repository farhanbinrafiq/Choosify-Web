import type { CatalogProduct } from '../types/catalog';
import type { HomepageSpotlightCardModel } from '../types/spotlight/homepage';
import { resolvePreviewImage } from '../components/media/types/mediaModel';
import { catalogGuideHref } from '../lib/spotlight/content';
import { PLACEHOLDER_IMAGE } from '../constants';
import {
  classifyContentPriority,
  isPreviouslyLive,
  prioritizeContent,
  type ContentPriorityInput,
} from './contentPriority';

/** Lightweight Viral Today tile — Choosify.dc.html Home */
export interface ViralTodayItem {
  id: string;
  href: string;
  title: string;
  image: string;
  channel: string;
  duration?: string;
  views?: string;
  time?: string;
  likes?: string;
  productCount: number;
  kind: 'youtube' | 'reel' | 'live';
  /** Priority tier for UI badges (optional) */
  priorityTier?: 'active_live' | 'live_grace' | 'fresh' | 'standard';
  /** Ended livestream past 24h grace — YouTube size + "Previously LIVE" badge */
  previouslyLive?: boolean;
}

/** Guides may come from CMS/catalog with partial fields */
type ViralGuideInput = {
  id: string | number;
  slug?: string;
  title: string;
  author?: string;
  image?: string;
  duration?: string;
  views?: string;
  readTime?: string;
  shares?: string;
  type?: string;
  productIds?: Array<string | number>;
  publishedAt?: string;
  status?: string;
};

type ViralCandidate = {
  key: string;
  item: ViralTodayItem;
  priority: ContentPriorityInput;
};

function guideHref(guide: ViralGuideInput): string {
  return catalogGuideHref(guide);
}

function guideToViral(guide: ViralGuideInput, kind?: ViralTodayItem['kind']): ViralTodayItem {
  const isReel = guide.type === 'reels' || guide.type === 'shorts';
  return {
    id: String(guide.id),
    href: guideHref(guide),
    title: guide.title,
    image: guide.image || PLACEHOLDER_IMAGE,
    channel: guide.author || 'Choosify',
    duration: guide.duration,
    views: guide.views,
    time: guide.readTime,
    likes: guide.shares,
    productCount: guide.productIds?.length ?? 0,
    kind: kind ?? (isReel ? 'reel' : 'youtube'),
  };
}

function campaignToViral(card: HomepageSpotlightCardModel, kind?: ViralTodayItem['kind']): ViralTodayItem {
  const t = card.campaign.campaignType;
  const isLive = t === 'livestream';
  const isReel = t === 'creator_review' || t === 'single_product';
  const url = card.campaign.cta?.url;
  const href = url
    ? url.startsWith('/')
      ? url
      : `/${url}`
    : `/spotlight/${card.campaign.campaignId}`;
  const image =
    (card.media ? resolvePreviewImage(card.media) : undefined) ||
    card.primaryProduct?.image ||
    card.brandLogoUrl ||
    PLACEHOLDER_IMAGE;

  return {
    id: card.campaign.campaignId,
    href,
    title: card.campaign.headline ?? card.campaign.campaignName ?? 'Spotlight',
    image,
    channel: card.campaign.brandName ?? card.primaryProduct?.brandName ?? 'Choosify',
    productCount: (card.primaryProduct ? 1 : 0) + (card.extraProductCount || 0),
    kind: kind ?? (isLive ? 'live' : isReel ? 'reel' : 'youtube'),
  };
}

function campaignPriorityInput(card: HomepageSpotlightCardModel): ContentPriorityInput {
  const c = card.campaign;
  const isLiveType = c.campaignType === 'livestream';
  return {
    id: c.campaignId,
    publishedAt: c.schedule?.startAt || c.createdAt,
    endsAt: c.schedule?.endAt,
    contentType: isLiveType ? 'live' : c.campaignType,
    isLive: isLiveType,
    live: isLiveType
      ? {
          scheduledAt: c.schedule?.startAt,
          endedAt: c.schedule?.endAt,
        }
      : null,
  };
}

function guidePriorityInput(guide: ViralGuideInput): ContentPriorityInput {
  return {
    id: String(guide.id),
    publishedAt: guide.publishedAt,
    contentType: guide.type,
    isLive: false,
    live: null,
  };
}

/**
 * Prefer live Spotlight homepage campaigns; fall back to catalog guides
 * so Viral Today always has content on Home (Choosify.dc.html).
 *
 * Ranking (shared with Discover via contentPriority.ts):
 * 1. Active LIVE first
 * 2. LIVE ended within 24h (grace)
 * 3. Regular content published within 24h
 * 4. Older content fills remaining lane slots
 */
export function buildHomeViralTodayItems(
  campaignCards: HomepageSpotlightCardModel[],
  guides: ViralGuideInput[],
  _products?: CatalogProduct[],
  nowMs: number = Date.now(),
): ViralTodayItem[] {
  const candidates: ViralCandidate[] = [];

  for (const card of campaignCards) {
    const priority = campaignPriorityInput(card);
    const tier = classifyContentPriority(priority, nowMs);
    const kind: ViralTodayItem['kind'] =
      tier === 'active_live' || tier === 'live_grace' || card.campaign.campaignType === 'livestream'
        ? 'live'
        : card.campaign.campaignType === 'creator_review' || card.campaign.campaignType === 'single_product'
          ? 'reel'
          : 'youtube';
    candidates.push({
      key: `campaign-${card.campaign.campaignId}`,
      item: { ...campaignToViral(card, kind), priorityTier: tier },
      priority,
    });
  }

  const seen = new Set(candidates.map((c) => c.key));
  for (const guide of guides) {
    if (guide.status === 'draft' || guide.status === 'archived') continue;
    const key = `guide-${guide.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const priority = guidePriorityInput(guide);
    const tier = classifyContentPriority(priority, nowMs);
    candidates.push({
      key,
      item: { ...guideToViral(guide), priorityTier: tier },
      priority,
    });
  }

  if (!candidates.length) return [];

  const ranked = prioritizeContent(candidates, (c) => c.priority, nowMs).map((r) => ({
    ...r.item.item,
    priorityTier: r.tier,
    previouslyLive: isPreviouslyLive(r.item.priority, nowMs),
  }));

  // Featured LIVE: active + 24h grace (large cards). Past-grace livestreams join YouTube lane.
  const featuredLive = ranked.filter(
    (i) => i.priorityTier === 'active_live' || i.priorityTier === 'live_grace',
  );
  const youtube = ranked.filter(
    (i) =>
      (i.kind === 'youtube' || i.previouslyLive || i.kind === 'live') &&
      i.priorityTier !== 'active_live' &&
      i.priorityTier !== 'live_grace',
  );
  const reels = ranked.filter(
    (i) =>
      i.kind === 'reel' &&
      i.priorityTier !== 'active_live' &&
      i.priorityTier !== 'live_grace',
  );

  const items: ViralTodayItem[] = [];

  for (const item of featuredLive.slice(0, 2)) {
    items.push({ ...item, kind: 'live', previouslyLive: false });
  }

  for (const item of youtube.slice(0, 4)) {
    items.push({
      ...item,
      kind: 'youtube',
      previouslyLive: Boolean(item.previouslyLive || item.kind === 'live'),
    });
  }
  for (const item of reels.slice(0, 6)) {
    items.push(item);
  }

  // Pad lanes from remaining ranked content (option A: fill with older)
  if (items.filter((i) => i.kind === 'youtube').length < 2) {
    for (const item of ranked) {
      if (items.filter((i) => i.kind === 'youtube').length >= 4) break;
      if (items.some((i) => i.id === item.id)) continue;
      items.push({
        ...item,
        kind: 'youtube',
        duration: item.kind === 'reel' ? undefined : item.duration,
        previouslyLive: item.previouslyLive,
      });
    }
  }
  if (items.filter((i) => i.kind === 'reel').length < 2) {
    for (const item of ranked) {
      if (items.filter((i) => i.kind === 'reel').length >= 6) break;
      if (items.some((i) => i.id === item.id && i.kind === 'reel')) continue;
      items.push({ ...item, kind: 'reel' });
    }
  }

  return items;
}
