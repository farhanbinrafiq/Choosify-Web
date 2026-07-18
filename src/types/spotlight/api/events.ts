/**
 * Event bus contracts — async processing (CTO addition), LE-005.3.2
 */

export type SpotlightEventType =
  | 'CampaignCreated'
  | 'CampaignUpdated'
  | 'CampaignSubmitted'
  | 'CampaignApproved'
  | 'CampaignRejected'
  | 'CampaignScheduled'
  | 'CampaignPublished'
  | 'CampaignPaused'
  | 'CampaignExpired'
  | 'CampaignArchived'
  | 'CampaignRestored'
  | 'CampaignDuplicated'
  | 'CampaignViewed'
  | 'CampaignClicked'
  | 'CampaignPurchased'
  | 'CampaignMediaProcessed'
  | 'CampaignHealthUpdated';

export interface SpotlightEventEnvelope<T extends SpotlightEventType, P> {
  eventId: string;
  eventType: T;
  occurredAt: string;
  source: 'choosify-web' | 'choosify-admin' | 'choosify-api' | 'worker';
  correlationId?: string;
  payload: P;
}

export interface SpotlightCampaignEventPayload {
  campaignId: string;
  campaignSlug?: string;
  actorId?: string;
  status?: string;
}

export interface SpotlightEngagementEventPayload {
  campaignId: string;
  sessionId?: string;
  userId?: string;
  productId?: string;
  surface?: string;
  revenue?: number;
  currency?: string;
}

export type SpotlightCampaignCreatedEvent = SpotlightEventEnvelope<
  'CampaignCreated',
  SpotlightCampaignEventPayload
>;

export type SpotlightCampaignPublishedEvent = SpotlightEventEnvelope<
  'CampaignPublished',
  SpotlightCampaignEventPayload
>;

export type SpotlightCampaignViewedEvent = SpotlightEventEnvelope<
  'CampaignViewed',
  SpotlightEngagementEventPayload
>;

export type SpotlightCampaignClickedEvent = SpotlightEventEnvelope<
  'CampaignClicked',
  SpotlightEngagementEventPayload
>;

export type SpotlightCampaignPurchasedEvent = SpotlightEventEnvelope<
  'CampaignPurchased',
  SpotlightEngagementEventPayload
>;

export type SpotlightDomainEvent =
  | SpotlightCampaignCreatedEvent
  | SpotlightCampaignPublishedEvent
  | SpotlightCampaignViewedEvent
  | SpotlightCampaignClickedEvent
  | SpotlightCampaignPurchasedEvent
  | SpotlightEventEnvelope<SpotlightEventType, Record<string, unknown>>;

/** Future event publisher contract */
export interface SpotlightEventPublisher {
  publish(event: SpotlightDomainEvent): Promise<void>;
}

export interface SpotlightEventSubscriber {
  subscribe(
    eventTypes: SpotlightEventType[],
    handler: (event: SpotlightDomainEvent) => Promise<void>,
  ): () => void;
}
