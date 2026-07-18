import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type { CatalogProduct } from '../types/catalog';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import type {
  SpotlightInteractiveCommerceEvent,
  SpotlightMultiSourceEventHub,
} from '../types/spotlight/interactive/event';
import type { SpotlightLiveSource } from '../types/spotlight/interactive/sources';
import type { SpotlightLiveTimelineChapter } from '../types/spotlight/interactive/timeline';
import type { SpotlightLivePinRecord } from '../types/spotlight/interactive/pinning';
import { formatTimelineTimestamp } from '../types/spotlight/interactive/timeline';
import { enrichCommerceOverlay } from '../types/spotlight/commerce/overlay';
import { EMPTY_SPOTLIGHT_COMMERCE } from '../types/spotlight/experience/commerceOverlay';
import { buildCampaignCollaborationGraph, contributionsToMembers } from './spotlightCollaborationEngine';
import { campaignToSpotlightContent } from './spotlightContentResolver';
import { toEmbedUrl } from './spotlightMediaAdapters';

const DEMO_YOUTUBE = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

function inferDomain(campaign: SpotlightCampaignRecord): SpotlightInteractiveCommerceEvent['domain'] {
  const tags = [...(campaign.campaignTags ?? []), campaign.campaignType].join(' ').toLowerCase();
  if (tags.includes('hotel')) return 'hotel';
  if (tags.includes('restaurant') || tags.includes('food')) return 'restaurant';
  if (tags.includes('travel')) return 'travel';
  if (tags.includes('education') || tags.includes('school')) return 'education';
  if (tags.includes('health')) return 'healthcare';
  if (tags.includes('auto') || tags.includes('vehicle')) return 'automotive';
  if (tags.includes('real estate') || tags.includes('property')) return 'real_estate';
  return 'electronics';
}

function buildDemoTimeline(campaign: SpotlightCampaignRecord): SpotlightLiveTimelineChapter[] {
  const primary = campaign.primaryProductId ?? campaign.linkedProductIds[0];
  const accessory = campaign.linkedProductIds[1];
  const chapters: SpotlightLiveTimelineChapter[] = [
    {
      chapterId: 'ch-intro',
      timestampSeconds: 0,
      timestampLabel: '00:00',
      title: 'Introduction',
      links: [],
    },
    {
      chapterId: 'ch-hero',
      timestampSeconds: 195,
      timestampLabel: '03:15',
      title: 'Hero Product',
      description: campaign.headline,
      links: primary ? [{ kind: 'product', entityId: primary, label: 'Featured product' }] : [],
    },
    {
      chapterId: 'ch-demo',
      timestampSeconds: 510,
      timestampLabel: '08:30',
      title: 'Product Demo',
      links: primary ? [{ kind: 'product', entityId: primary }] : [],
    },
  ];
  if (accessory) {
    chapters.push({
      chapterId: 'ch-accessories',
      timestampSeconds: 860,
      timestampLabel: '14:20',
      title: 'Accessories',
      links: [{ kind: 'product', entityId: accessory }],
    });
  }
  chapters.push(
    {
      chapterId: 'ch-offer',
      timestampSeconds: 1130,
      timestampLabel: '18:50',
      title: 'Limited Offer',
      links: [{ kind: 'offer', entityId: `offer-${campaign.campaignId}`, label: 'Trade-in offer' }],
    },
    {
      chapterId: 'ch-winner',
      timestampSeconds: 1320,
      timestampLabel: '22:00',
      title: 'Winner Announcement',
      links: [{ kind: 'announcement', entityId: campaign.campaignId }],
    },
    {
      chapterId: 'ch-qa',
      timestampSeconds: 1800,
      timestampLabel: '30:00',
      title: 'Q&A',
      links: [],
    },
  );
  return chapters;
}

function buildDemoPins(campaign: SpotlightCampaignRecord): SpotlightLivePinRecord[] {
  const now = new Date().toISOString();
  const pins: SpotlightLivePinRecord[] = [];
  campaign.linkedProductIds.slice(0, 3).forEach((pid, i) => {
    pins.push({
      pinId: `pin-${pid}-${i}`,
      eventId: campaign.campaignId,
      entityKind: 'product',
      entityId: pid,
      label: 'Pinned product',
      timestampSeconds: [195, 510, 860][i],
      pinnedAt: now,
      pinnedByPublisherId: `brand-${campaign.linkedBrandIds[0] ?? 'owner'}`,
      sortOrder: i,
      preservedOnReplay: true,
    });
  });
  return pins;
}

/** Multi-source hub demo — Samsung launch + creator perspectives (CTO) */
function buildMultiSourceHub(campaign: SpotlightCampaignRecord): SpotlightLiveSource[] {
  const sources: SpotlightLiveSource[] = [
    {
      sourceId: `src-yt-${campaign.campaignId}`,
      provider: 'youtube_live',
      label: 'Official YouTube Live',
      embedUrl: DEMO_YOUTUBE,
      posterUrl: undefined,
      status: 'active',
      isPrimary: true,
      contributorPublisherId: `brand-${campaign.linkedBrandIds[0] ?? 'owner'}`,
      contributorRole: 'official_brand',
    },
    {
      sourceId: `src-fb-${campaign.campaignId}`,
      provider: 'facebook_live',
      label: 'Official Facebook Live',
      embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F101555971778629%2F&show_text=false',
      status: 'active',
      contributorPublisherId: `brand-${campaign.linkedBrandIds[0] ?? 'owner'}`,
      contributorRole: 'official_brand',
    },
  ];
  (campaign.linkedCreatorIds ?? ['a', 'b', 'c']).slice(0, 3).forEach((cid, i) => {
    sources.push({
      sourceId: `src-creator-${cid}`,
      provider: 'youtube_live',
      label: ['Creator Reaction', 'Hands-on Review', 'Camera Test'][i] ?? 'Creator Stream',
      embedUrl: DEMO_YOUTUBE,
      status: 'active',
      contributorPublisherId: `creator-${cid}`,
      contributorRole: 'creator',
    });
  });
  sources.push({
    sourceId: `src-media-${campaign.campaignId}`,
    provider: 'embedded_website',
    label: 'Media Coverage',
    embedUrl: DEMO_YOUTUBE,
    status: 'active',
    contributorRole: 'editor',
  });
  return sources;
}

export function campaignToInteractiveEvent(
  campaign: SpotlightCampaignRecord,
  catalog: CatalogProduct[],
  brandLogos: Record<string, string>,
): SpotlightInteractiveCommerceEvent {
  const content = campaignToSpotlightContent(campaign, catalog, brandLogos);
  const collab = buildCampaignCollaborationGraph(campaign, catalog, brandLogos);
  const members = contributionsToMembers(collab.contributions);
  const sources = buildMultiSourceHub(campaign);
  const isLivestream = campaign.campaignType === 'livestream';
  const isLaunch = campaign.campaignType === 'new_launch';
  const now = Date.now();
  const start = new Date(campaign.schedule.startAt).getTime();
  const end = new Date(campaign.schedule.endAt).getTime();

  let status: SpotlightInteractiveCommerceEvent['status'] = 'upcoming';
  if (now >= start && now <= end) status = isLivestream ? 'live' : 'live';
  else if (now > end) status = 'replay';

  const experienceKind = isLivestream
    ? 'brand_live'
    : isLaunch
      ? 'product_launch'
      : status === 'replay'
        ? 'replay'
        : status === 'upcoming'
          ? 'upcoming_live'
          : 'live';

  const timeline = buildDemoTimeline(campaign);
  const pins = buildDemoPins(campaign);

  return {
    eventId: `event-${campaign.campaignId}`,
    contentId: content.contentId,
    slug: campaign.campaignSlug,
    title: campaign.headline,
    description: campaign.shortDescription,
    tags: campaign.campaignTags ?? [],
    experienceKind,
    officialKind: isLivestream ? 'official_brand' : isLaunch ? 'official_event' : undefined,
    domain: inferDomain(campaign),
    status,
    scheduledAt: campaign.schedule.startAt,
    endedAt: campaign.schedule.endAt,
    timezone: 'Asia/Dhaka',
    posterUrl: content.media?.thumbnail,
    sources,
    activeSourceId: sources[0]!.sourceId,
    publisher: content.publisher,
    collaborators: members,
    commerce: enrichCommerceOverlay({
      ...EMPTY_SPOTLIGHT_COMMERCE,
      featuredProductIds: campaign.linkedProductIds,
      bundleIds: campaign.merchandising?.bundles?.map((b) => b.bundleId) ?? [],
      pinnedProductIds: campaign.linkedProductIds.slice(0, 3),
    }),
    timeline,
    pins,
    notifyMeEnabled: status === 'upcoming',
    calendarPlaceholder: status === 'upcoming',
    relatedContentIds: content.connections.spotlightContentIds,
  };
}

export function contentToInteractiveEvent(
  content: SpotlightContent,
  campaign?: SpotlightCampaignRecord,
  catalog: CatalogProduct[] = [],
  brandLogos: Record<string, string> = {},
): SpotlightInteractiveCommerceEvent | undefined {
  if (campaign) return campaignToInteractiveEvent(campaign, catalog, brandLogos);
  if (!content.live?.embedUrl && content.contentType !== 'live') return undefined;

  const embed = content.live?.embedUrl ?? content.media?.videoUrl;
  const sources: SpotlightLiveSource[] = embed
    ? [{
        sourceId: `src-${content.contentId}`,
        provider: content.live?.platform === 'facebook' ? 'facebook_live' : 'youtube_live',
        label: 'Watch',
        embedUrl: embed.includes('embed') ? embed : toEmbedUrl(embed, 'youtube'),
        status: 'active',
        isPrimary: true,
      }]
    : [];

  return {
    eventId: `event-${content.contentId}`,
    contentId: content.contentId,
    slug: content.slug,
    title: content.headline,
    description: content.description,
    tags: content.badges,
    experienceKind: content.isLive ? 'live' : 'replay',
    domain: 'general',
    status: content.isLive ? 'live' : 'replay',
    timezone: 'Asia/Dhaka',
    posterUrl: content.media?.thumbnail,
    sources,
    activeSourceId: sources[0]?.sourceId ?? '',
    publisher: content.publisher,
    collaborators: [],
    commerce: enrichCommerceOverlay(content.commerce),
    timeline: [],
    pins: [],
    notifyMeEnabled: false,
    relatedContentIds: content.connections.spotlightContentIds,
  };
}

export function buildMultiSourceEventHub(event: SpotlightInteractiveCommerceEvent): SpotlightMultiSourceEventHub {
  return { event, perspectives: event.sources };
}

export function getInteractiveEventBySlug(
  slug: string,
  campaigns: SpotlightCampaignRecord[],
  catalog: CatalogProduct[],
  brandLogos: Record<string, string>,
): SpotlightInteractiveCommerceEvent | undefined {
  const campaign = campaigns.find((c) => c.campaignSlug === slug);
  if (campaign) return campaignToInteractiveEvent(campaign, catalog, brandLogos);
  return undefined;
}

export function getChapterAtTimestamp(
  timeline: SpotlightLiveTimelineChapter[],
  seconds: number,
): SpotlightLiveTimelineChapter | undefined {
  const sorted = [...timeline].sort((a, b) => b.timestampSeconds - a.timestampSeconds);
  return sorted.find((ch) => seconds >= ch.timestampSeconds);
}

export { formatTimelineTimestamp };
