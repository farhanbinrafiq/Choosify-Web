/**
 * Section-driven Spotlight Content Page renderer — LE-005 UX-08
 * CMS `pageSections` controls visibility; contentType templates are defaults only.
 */

import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import type {
  SpotlightPageSectionConfig,
  SpotlightPageSectionId,
} from '../../../types/spotlight/experience/pageSections';
import { SPOTLIGHT_PAGE_SHELL_ORDER } from '../../../types/spotlight/experience/pageSections';

function cfg(id: SpotlightPageSectionId, visible = true, order?: number): SpotlightPageSectionConfig {
  return { id, visible, order };
}

/** Default CMS templates — editors may override per content record */
const CONTENT_TYPE_SECTION_TEMPLATES: Partial<
  Record<SpotlightContentType, SpotlightPageSectionConfig[]>
> = {
  live: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('live_status'),
    cfg('schedule'),
    cfg('description'),
    cfg('media_gallery'),
    cfg('associated_products'),
    cfg('associated_services'),
    cfg('brand_profile_card'),
    cfg('creator_profile_card'),
    cfg('related_spotlight'),
  ],
  livestream_replay: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('live_status'),
    cfg('description'),
    cfg('media_gallery'),
    cfg('associated_products'),
    cfg('associated_services'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
  ],
  buying_guide: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('media_gallery'),
    cfg('winner'),
    cfg('why_it_won'),
    cfg('pros'),
    cfg('cons'),
    cfg('verdict'),
    cfg('takeaways'),
    cfg('top_picks'),
    cfg('top_3'),
    cfg('products_reviewed'),
    cfg('creator_profile_card'),
    cfg('associated_products'),
    cfg('related_spotlight'),
  ],
  product_review: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('media_gallery'),
    cfg('winner'),
    cfg('why_it_won'),
    cfg('pros'),
    cfg('cons'),
    cfg('verdict'),
    cfg('takeaways'),
    cfg('top_picks'),
    cfg('top_3'),
    cfg('products_reviewed'),
    cfg('creator_profile_card'),
    cfg('associated_products'),
    cfg('related_spotlight'),
  ],
  creator_review: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('media_gallery'),
    cfg('winner'),
    cfg('why_it_won'),
    cfg('pros'),
    cfg('cons'),
    cfg('verdict'),
    cfg('takeaways'),
    cfg('top_3'),
    cfg('products_reviewed'),
    cfg('associated_products'),
    cfg('creator_profile_card'),
    cfg('related_spotlight'),
  ],
  recommendation: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('media_gallery'),
    cfg('winner'),
    cfg('why_it_won'),
    cfg('pros'),
    cfg('cons'),
    cfg('verdict'),
    cfg('takeaways'),
    cfg('top_3'),
    cfg('products_reviewed'),
    cfg('associated_products'),
    cfg('creator_profile_card'),
    cfg('related_spotlight'),
  ],
  editorial: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('media_gallery'),
    cfg('winner'),
    cfg('why_it_won'),
    cfg('pros'),
    cfg('cons'),
    cfg('verdict'),
    cfg('takeaways'),
    cfg('top_3'),
    cfg('products_reviewed'),
    cfg('associated_products'),
    cfg('creator_profile_card'),
    cfg('related_spotlight'),
  ],
  comparison: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('comparison_table'),
    cfg('products_reviewed'),
    cfg('winner'),
    cfg('pros'),
    cfg('cons'),
    cfg('verdict'),
    cfg('takeaways'),
    cfg('creator_profile_card'),
    cfg('related_spotlight'),
  ],
  campaign: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('associated_products'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
    cfg('related_products'),
  ],
  promotion: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('pricing'),
    cfg('associated_products'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
  ],
  new_launch: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('media_gallery'),
    cfg('associated_products'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
    cfg('related_products'),
  ],
  brand_story: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('media_gallery'),
    cfg('associated_products'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
  ],
  community_pick: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('media_gallery'),
    cfg('associated_products'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
  ],
  whats_on: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('pricing'),
    cfg('associated_products'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
  ],
  announcement: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('announcements'),
    cfg('associated_products'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
  ],
  event: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('schedule'),
    cfg('timeline'),
    cfg('description'),
    cfg('associated_products'),
    cfg('associated_services'),
    cfg('brand_profile_card'),
    cfg('related_spotlight'),
  ],
  tutorial: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('media_gallery'),
    cfg('description'),
    cfg('associated_products'),
    cfg('creator_profile_card'),
    cfg('related_spotlight'),
  ],
  tips: [
    cfg('hero_media'),
    cfg('content_summary'),
    cfg('description'),
    cfg('associated_products'),
    cfg('creator_profile_card'),
    cfg('related_spotlight'),
  ],
};

const GUIDE_NAV_TO_SECTION: Record<string, SpotlightPageSectionId> = {
  winner: 'winner',
  'why-won': 'why_it_won',
  'quick-verdict': 'verdict',
  takeaways: 'takeaways',
  'top-3': 'top_3',
  'all-products': 'associated_products',
  'review-context': 'products_reviewed',
  'reviewer-profile': 'creator_profile_card',
};

export function mapGuideNavIdToSection(navId: string): SpotlightPageSectionId | undefined {
  return GUIDE_NAV_TO_SECTION[navId];
}

const BRAND_PUBLISHER_TYPES = new Set([
  'brand',
  'retailer',
  'verified_seller',
  'official_distributor',
  'marketplace_admin',
  'business',
]);

const CREATOR_PUBLISHER_TYPES = new Set(['creator', 'influencer', 'editorial_team']);

const SERVICE_PUBLISHER_TYPES = new Set([
  'service_provider',
  'hotel',
  'restaurant',
  'travel_agency',
  'education',
  'healthcare',
]);

/** True when the content owner is a brand-side publisher (not a creator). */
export function isBrandOwnedContent(content: SpotlightContent): boolean {
  return BRAND_PUBLISHER_TYPES.has(content.publisher.publisherType);
}

/** Brand mini card — publisher is brand-side OR explicit brand connection */
export function shouldShowBrandProfileCard(content: SpotlightContent): boolean {
  if (isBrandOwnedContent(content)) return true;
  return content.connections.brandIds.length > 0;
}

/** Creator mini card — publisher is creator-side OR explicit creator connection */
export function shouldShowCreatorProfileCard(content: SpotlightContent): boolean {
  if (isBrandOwnedContent(content)) return false;
  if (CREATOR_PUBLISHER_TYPES.has(content.publisher.publisherType)) return true;
  return content.connections.creatorIds.length > 0;
}

/** Service-forward content (hotels, travel, etc.) */
export function isServiceForwardContent(content: SpotlightContent): boolean {
  return (
    SERVICE_PUBLISHER_TYPES.has(content.publisher.publisherType) ||
    content.connections.serviceIds.length > 0 ||
    content.commerce.featuredServiceIds.length > 0
  );
}

export function defaultSectionsForContentType(
  contentType: SpotlightContentType,
): SpotlightPageSectionConfig[] {
  return (
    CONTENT_TYPE_SECTION_TEMPLATES[contentType] ?? [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('description'),
      cfg('associated_products'),
      cfg('creator_profile_card'),
      cfg('related_spotlight'),
    ]
  );
}

export function sectionHasData(content: SpotlightContent, sectionId: SpotlightPageSectionId): boolean {
  switch (sectionId) {
    case 'hero_media':
      return Boolean(content.media?.thumbnail || content.media?.videoUrl || content.live?.embedUrl);
    case 'content_summary':
      return Boolean(content.headline);
    case 'description':
      return Boolean(content.description?.trim());
    case 'live_status':
      return content.isLive || content.contentType === 'live' || content.contentType === 'livestream_replay';
    case 'schedule':
    case 'timeline':
      return Boolean(content.publishedAt || content.endsAt || content.live?.scheduledAt);
    case 'countdown':
      return Boolean(content.endsAt && new Date(content.endsAt).getTime() > Date.now());
    case 'media_gallery':
    case 'image_gallery':
    case 'video_gallery':
      return Boolean(content.media?.imageUrls?.length && content.media.imageUrls.length > 1);
    case 'associated_products':
    case 'top_picks':
    case 'top_3':
    case 'top_5':
    case 'items_mentioned':
    case 'products_reviewed':
    case 'related_products':
      return content.connections.productIds.length > 0 || content.commerce.featuredProductIds.length > 0;
    case 'brands_mentioned':
    case 'related_brands':
      return content.connections.brandIds.length > 0;
    case 'how_review_was_made':
      return (
        content.contentType === 'product_review' ||
        content.contentType === 'creator_review' ||
        content.sourceKind === 'guide'
      );
    case 'what_is_discussed':
      return content.connections.productIds.length > 0 || content.commerce.featuredProductIds.length > 0;
    case 'associated_services':
    case 'related_services':
      return content.connections.serviceIds.length > 0 || content.commerce.featuredServiceIds.length > 0;
    case 'brand_profile_card':
      return shouldShowBrandProfileCard(content);
    case 'creator_profile_card':
      return shouldShowCreatorProfileCard(content);
    case 'comparison_table':
      return content.contentType === 'comparison';
    case 'tags':
      return content.badges.length > 0;
    case 'share':
      return true;
    case 'related_spotlight':
      return true;
    case 'announcements':
      return content.contentType === 'announcement';
    case 'winner':
    case 'why_it_won':
    case 'verdict':
    case 'takeaways':
    case 'pros':
    case 'cons':
    case 'specifications':
      return (
        content.sourceKind === 'guide' ||
        ['buying_guide', 'comparison', 'product_review', 'creator_review', 'tutorial', 'tips', 'recommendation', 'editorial'].includes(
          content.contentType,
        )
      );
    case 'pricing':
      return (
        isServiceForwardContent(content) ||
        ['promotion', 'whats_on', 'campaign'].includes(content.contentType) ||
        Boolean(content.endsAt)
      );
    case 'download_attachments':
      return ['buying_guide', 'comparison', 'product_review', 'creator_review', 'tutorial', 'tips'].includes(
        content.contentType,
      );
    default:
      return true;
  }
}

/** Resolve ordered visible section IDs for rendering */
export function resolvePageSectionManifest(content: SpotlightContent): SpotlightPageSectionId[] {
  // Catalog guides (blog, video, reels, shorts) always use the Guide Detail shell
  // from Choosify.dc.html — same cards for every guide format.
  let source = content.pageSections?.length
    ? content.pageSections
    : content.sourceKind === 'guide'
      ? defaultSectionsForContentType('buying_guide')
      : defaultSectionsForContentType(content.contentType);

  // Brand-owned content: swap creator profile slot → brand profile (same Guide Details shell).
  if (isBrandOwnedContent(content)) {
    const hasBrand = source.some((e) => e.id === 'brand_profile_card');
    source = source.flatMap((entry) => {
      if (entry.id === 'creator_profile_card') {
        return hasBrand ? [] : [{ ...entry, id: 'brand_profile_card' as const }];
      }
      return [entry];
    });
    if (!source.some((e) => e.id === 'brand_profile_card') && shouldShowBrandProfileCard(content)) {
      source = [...source, cfg('brand_profile_card')];
    }
  }

  const visible = source.filter((entry) => entry.visible && sectionHasData(content, entry.id));

  const orderIndex = (id: SpotlightPageSectionId) => {
    const explicit = visible.find((v) => v.id === id)?.order;
    if (explicit !== undefined) return explicit;
    return SPOTLIGHT_PAGE_SHELL_ORDER.indexOf(id);
  };

  return [...visible]
    .sort((a, b) => orderIndex(a.id) - orderIndex(b.id))
    .map((entry) => entry.id);
}

export function isPageSectionVisible(
  manifest: SpotlightPageSectionId[] | undefined,
  sectionId: SpotlightPageSectionId,
): boolean {
  if (!manifest || manifest.length === 0) return true;
  return manifest.includes(sectionId);
}

export function isGuideNavSectionVisible(
  manifest: SpotlightPageSectionId[] | undefined,
  navId: string,
): boolean {
  if (navId === 'reviewer-profile') {
    return (
      isPageSectionVisible(manifest, 'creator_profile_card') ||
      isPageSectionVisible(manifest, 'brand_profile_card')
    );
  }
  const mapped = mapGuideNavIdToSection(navId);
  if (!mapped) return true;
  return isPageSectionVisible(manifest, mapped);
}
