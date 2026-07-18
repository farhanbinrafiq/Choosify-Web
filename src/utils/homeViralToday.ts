import type { CatalogProduct } from '../types/catalog';
import type { HomepageSpotlightCardModel } from '../types/spotlight/homepage';
import { resolvePreviewImage } from '../components/media/types/mediaModel';
import { catalogGuideHref } from '../lib/spotlight/content';
import { PLACEHOLDER_IMAGE } from '../constants';

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
  kind: 'youtube' | 'reel';
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
};

function guideHref(guide: ViralGuideInput): string {
  return catalogGuideHref(guide);
}

function guideToViral(guide: ViralGuideInput): ViralTodayItem {
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
    kind: isReel ? 'reel' : 'youtube',
  };
}

function campaignToViral(card: HomepageSpotlightCardModel): ViralTodayItem {
  const t = card.campaign.campaignType;
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
    kind: isReel ? 'reel' : 'youtube',
  };
}

/**
 * Prefer live Spotlight homepage campaigns; fall back to catalog guides
 * so Viral Today always has content on Home (Choosify.dc.html).
 */
export function buildHomeViralTodayItems(
  campaignCards: HomepageSpotlightCardModel[],
  guides: ViralGuideInput[],
  _products?: CatalogProduct[],
): ViralTodayItem[] {
  if (campaignCards.length > 0) {
    return campaignCards.map(campaignToViral);
  }

  const videos = guides.filter((g) => g.type === 'video');
  const reels = guides.filter((g) => g.type === 'reels' || g.type === 'shorts');
  const blogs = guides.filter((g) => !g.type || g.type === 'article');

  const items: ViralTodayItem[] = [];
  for (const g of videos.slice(0, 4)) items.push(guideToViral(g));
  for (const g of reels.slice(0, 6)) items.push(guideToViral(g));

  if (items.filter((i) => i.kind === 'youtube').length < 2) {
    for (const g of blogs.slice(0, 4)) {
      if (items.length >= 10) break;
      items.push({ ...guideToViral(g), kind: 'youtube', duration: undefined });
    }
  }
  if (items.filter((i) => i.kind === 'reel').length < 2) {
    for (const g of [...videos, ...blogs].slice(0, 6)) {
      if (items.filter((i) => i.kind === 'reel').length >= 6) break;
      if (items.some((i) => i.id === String(g.id) && i.kind === 'reel')) continue;
      items.push({ ...guideToViral(g), kind: 'reel' });
    }
  }

  return items;
}
