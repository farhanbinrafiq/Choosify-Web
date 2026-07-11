/**
 * ES-011 Communication contract — LE-005.3.2
 */

export type SpotlightNotificationType =
  | 'campaign_approved'
  | 'campaign_rejected'
  | 'campaign_scheduled'
  | 'campaign_published'
  | 'campaign_expired'
  | 'campaign_archived'
  | 'campaign_reminder'
  | 'seller_notification'
  | 'admin_notification'
  | 'broadcast';

export type SpotlightNotificationChannel = 'email' | 'push' | 'in_app' | 'sms';

export interface SpotlightNotificationPayload {
  type: SpotlightNotificationType;
  campaignId: string;
  campaignName?: string;
  recipientId: string;
  recipientRole?: 'seller' | 'admin' | 'moderator';
  channels: SpotlightNotificationChannel[];
  title: string;
  body: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface SpotlightBroadcastHook {
  broadcastId: string;
  type: SpotlightNotificationType;
  audience: 'all_sellers' | 'all_admins' | 'segment';
  segmentId?: string;
  payload: Omit<SpotlightNotificationPayload, 'recipientId'>;
  scheduledAt?: string;
}

export interface SpotlightCommunicationServiceContract {
  notify(payload: SpotlightNotificationPayload): Promise<void>;
  scheduleReminder(campaignId: string, remindAt: string, recipientId: string): Promise<void>;
  broadcast(hook: SpotlightBroadcastHook): Promise<{ broadcastId: string }>;
  onCampaignApproved(campaignId: string, sellerId: string): Promise<void>;
  onCampaignRejected(campaignId: string, sellerId: string, reason: string): Promise<void>;
  onCampaignScheduled(campaignId: string, sellerId: string): Promise<void>;
  onCampaignPublished(campaignId: string, sellerId: string): Promise<void>;
  onCampaignExpired(campaignId: string, sellerId: string): Promise<void>;
  onCampaignArchived(campaignId: string, sellerId: string): Promise<void>;
}

/** @deprecated Use SpotlightCommunicationServiceContract */
export interface SpotlightCommunicationRef {
  campaignId: string;
  notificationChannels: SpotlightNotificationChannel[];
  audienceSegmentId?: string;
}
