import type { SpotlightHub } from '../types/spotlight/discovery/hub';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightCampaignJourneyStep } from '../types/spotlight/discovery/journey';
import { CAMPAIGN_JOURNEY_LABELS, CAMPAIGN_JOURNEY_ORDER } from '../types/spotlight/discovery/journey';

export function buildSpotlightHub(content: SpotlightContent, allContent: SpotlightContent[]): SpotlightHub {
  const slug = content.slug;
  const related = allContent.filter((c) => {
    if (c.contentId === content.contentId) return false;
    const sharedProducts = c.connections.productIds.some((id) => content.connections.productIds.includes(id));
    const samePublisher = c.publisher.publisherId === content.publisher.publisherId;
    return sharedProducts || samePublisher;
  });

  const guides = related.filter((c) => ['buying_guide', 'tutorial', 'tips'].includes(c.contentType));
  const reviews = related.filter((c) => ['product_review', 'creator_review'].includes(c.contentType));
  const live = related.filter((c) => c.isLive || c.contentType === 'live');
  const recommendations = related.filter((c) => c.contentType === 'recommendation');
  const campaigns = related.filter((c) => ['campaign', 'promotion', 'new_launch'].includes(c.contentType));
  const announcements = related.filter((c) => c.contentType === 'announcement');
  const events = related.filter((c) => c.contentType === 'event');
  const creatorContent = related.filter((c) => c.publisher.publisherType === 'creator');

  const sections = [
    { id: 'overview' as const, title: 'Overview', contentIds: [content.contentId], href: `/spotlight/${slug}` },
    { id: 'live' as const, title: 'Live', contentIds: live.map((c) => c.contentId), href: undefined },
    { id: 'replay' as const, title: 'Replay', contentIds: live.filter((c) => c.live?.status === 'replay' || c.live?.status === 'ended').map((c) => c.contentId) },
    { id: 'products' as const, title: 'Products', contentIds: [], href: content.connections.productIds[0] ? `/products/${content.connections.productIds[0]}` : undefined },
    { id: 'guides' as const, title: 'Guides', contentIds: guides.map((c) => c.contentId) },
    { id: 'reviews' as const, title: 'Reviews', contentIds: reviews.map((c) => c.contentId) },
    { id: 'creator_content' as const, title: 'Creator Content', contentIds: creatorContent.map((c) => c.contentId) },
    { id: 'recommendations' as const, title: 'Recommendations', contentIds: recommendations.map((c) => c.contentId) },
    { id: 'related_campaigns' as const, title: 'Related Campaigns', contentIds: campaigns.map((c) => c.contentId) },
    { id: 'announcements' as const, title: 'Announcements', contentIds: announcements.map((c) => c.contentId) },
    { id: 'events' as const, title: 'Events', contentIds: events.map((c) => c.contentId) },
  ].filter((s) => s.id === 'overview' || s.contentIds.length > 0 || s.href);

  return {
    hubId: `hub-${content.contentId}`,
    slug,
    title: content.headline,
    publisherId: content.publisher.publisherId,
    sections,
    breadcrumbs: [
      { label: 'Spotlight', href: '/spotlight' },
      { label: content.publisher.name, href: content.publisher.profileHref },
      { label: content.headline },
    ],
  };
}

export function inferCampaignJourney(content: SpotlightContent): SpotlightCampaignJourneyStep[] {
  const now = Date.now();
  const start = new Date(content.publishedAt).getTime();
  const end = content.endsAt ? new Date(content.endsAt).getTime() : start + 7 * 86_400_000;
  const isLive = content.isLive || content.live?.status === 'live';
  const isReplay = content.live?.status === 'replay' || content.live?.status === 'ended' || now > end;
  const isUpcoming = content.live?.status === 'upcoming' || now < start;

  const activeStage = isReplay
    ? 'replay'
    : isLive
      ? 'live'
      : isUpcoming
        ? 'coming_soon'
        : content.contentType === 'announcement'
          ? 'announcement'
          : content.contentType === 'new_launch'
            ? 'launch'
            : 'offer';

  const activeIdx = CAMPAIGN_JOURNEY_ORDER.indexOf(activeStage);

  return CAMPAIGN_JOURNEY_ORDER.map((stage, i) => ({
    stage,
    label: CAMPAIGN_JOURNEY_LABELS[stage],
    contentId: stage === activeStage ? content.contentId : undefined,
    href: content.href,
    isActive: stage === activeStage,
    isComplete: i < activeIdx,
  }));
}
