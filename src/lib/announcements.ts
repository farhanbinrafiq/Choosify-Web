export const CHOOSIFY_ANNOUNCEMENTS_THREAD_ID = 'thread-choosify-announcements';
export const CHOOSIFY_ANNOUNCEMENTS_TITLE = 'Choosify Announcements';
export const CHOOSIFY_ANNOUNCEMENTS_AVATAR =
  'https://ui-avatars.com/api/?name=Choosify&background=F96500&color=fff&size=128&bold=true';

export const CHOOSIFY_ANNOUNCEMENTS_WELCOME =
  'Welcome to Choosify Announcements. Platform updates, order alerts, and campaign news appear here. This channel is read-only — replies are not supported.';

export function formatAnnouncementBody(message: string, title?: string): string {
  if (title && !message.startsWith(title)) {
    return `${title}\n\n${message}`;
  }
  return message;
}

export function formatCampaignAnnouncement(campaign: {
  title: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  sponsorBadge?: string;
}): string {
  const badge = campaign.sponsorBadge ? `[${campaign.sponsorBadge}] ` : '';
  return `${badge}${campaign.title}\n${campaign.tagline}\n\n${campaign.ctaText}: ${campaign.ctaLink}`;
}
