import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type { SpotlightContentTimeline, SpotlightTimelineEvent } from '../types/spotlight/graph/timeline';

export function buildCampaignTimeline(campaign: SpotlightCampaignRecord): SpotlightContentTimeline {
  const events: SpotlightTimelineEvent[] = [
    {
      eventId: `tl-publish-${campaign.campaignId}`,
      type: 'content_published',
      title: 'Campaign Published',
      timestamp: campaign.createdAt,
      publisherId: campaign.brandName ? `brand-${campaign.linkedBrandIds[0]}` : undefined,
      publisherName: campaign.brandName,
    },
    {
      eventId: `tl-start-${campaign.campaignId}`,
      type: 'campaign_started',
      title: 'Campaign Started',
      timestamp: campaign.schedule.startAt,
    },
  ];

  if (campaign.campaignType === 'new_launch') {
    events.push({
      eventId: `tl-launch-${campaign.campaignId}`,
      type: 'launch_announced',
      title: 'Launch Announced',
      description: campaign.headline,
      timestamp: campaign.createdAt,
    });
  }

  if (campaign.campaignType === 'livestream') {
    events.push({
      eventId: `tl-live-sched-${campaign.campaignId}`,
      type: 'live_scheduled',
      title: 'Live Scheduled',
      timestamp: campaign.schedule.startAt,
    });
  }

  (campaign.linkedCreatorIds ?? []).forEach((creatorId, i) => {
    events.push({
      eventId: `tl-collab-${creatorId}`,
      type: i === 0 ? 'collaboration_accepted' : 'collaboration_invited',
      title: i === 0 ? 'Creator Collaboration Accepted' : 'Creator Invited',
      publisherId: `creator-${creatorId}`,
      timestamp: campaign.updatedAt,
    });
  });

  if (campaign.linkedProductIds[0]) {
    events.push({
      eventId: `tl-product-${campaign.campaignId}`,
      type: 'product_revealed',
      title: 'Featured Product Linked',
      productIds: [campaign.linkedProductIds[0]],
      timestamp: campaign.schedule.startAt,
    });
  }

  events.push({
    eventId: `tl-end-${campaign.campaignId}`,
    type: 'campaign_ended',
    title: 'Campaign Ends',
    timestamp: campaign.schedule.endAt,
  });

  return {
    contentId: `campaign-${campaign.campaignId}`,
    campaignId: campaign.campaignId,
    events: events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    updatedAt: campaign.updatedAt,
  };
}
