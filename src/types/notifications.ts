export type NotificationType =
  | 'announcement'
  | 'campaign'
  | 'order'
  | 'product'
  | 'brand'
  | 'creator'
  | 'event'
  | 'system';

export type NotificationAudience =
  | 'all_users'
  | 'customers'
  | 'sellers'
  | 'creators'
  | 'admins'
  | `followers_of_brand:${string}`
  | `user:${string}`;

export type NotificationStatus = 'draft' | 'queued' | 'sent' | 'failed';

export type NotificationChannel = 'web' | 'email' | 'whatsapp' | 'sms' | 'push';

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  audience: NotificationAudience;
  createdBy: string;
  createdAt: string;
  sendWeb: boolean;
  sendEmail: boolean;
  sendWhatsapp: boolean;
  sendSms: boolean;
  sendPush: boolean;
  status: NotificationStatus;
}

export interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  readAt?: string;
  createdAt: string;
  emailSent?: boolean;
  whatsappSent?: boolean;
  smsSent?: boolean;
  pushSent?: boolean;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  audience: NotificationAudience;
  sendWeb?: boolean;
  sendEmail?: boolean;
  sendWhatsapp?: boolean;
  sendSms?: boolean;
  sendPush?: boolean;
}
