/**
 * Webhook payload contracts — external integrations (CTO addition), LE-005.3.2
 */

export type SpotlightWebhookEventType =
  | 'media.processing.complete'
  | 'campaign.published'
  | 'campaign.expired'
  | 'analytics.export.ready'
  | 'ai.optimization.complete';

export interface SpotlightWebhookEnvelope<T extends SpotlightWebhookEventType, P> {
  webhookId: string;
  eventType: T;
  deliveredAt: string;
  signature: string;
  payload: P;
}

export interface SpotlightMediaProcessingCompletePayload {
  mediaId: string;
  campaignId?: string;
  status: 'ready' | 'failed';
  cdnUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export interface SpotlightCampaignLifecycleWebhookPayload {
  campaignId: string;
  campaignSlug: string;
  status: string;
  publishedAt?: string;
  expiredAt?: string;
}

export interface SpotlightAnalyticsExportPayload {
  exportId: string;
  campaignId?: string;
  downloadUrl: string;
  expiresAt: string;
  format: 'csv' | 'json' | 'parquet';
}

export interface SpotlightAiOptimizationPayload {
  campaignId: string;
  optimizationScore?: number;
  recommendations: string[];
  modelVersion: string;
}

export type SpotlightWebhookPayload =
  | SpotlightWebhookEnvelope<'media.processing.complete', SpotlightMediaProcessingCompletePayload>
  | SpotlightWebhookEnvelope<'campaign.published', SpotlightCampaignLifecycleWebhookPayload>
  | SpotlightWebhookEnvelope<'campaign.expired', SpotlightCampaignLifecycleWebhookPayload>
  | SpotlightWebhookEnvelope<'analytics.export.ready', SpotlightAnalyticsExportPayload>
  | SpotlightWebhookEnvelope<'ai.optimization.complete', SpotlightAiOptimizationPayload>;

export interface SpotlightWebhookRegistration {
  webhookId: string;
  url: string;
  events: SpotlightWebhookEventType[];
  secret: string;
  isActive: boolean;
  createdAt: string;
}
