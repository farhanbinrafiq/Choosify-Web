/**
 * Spotlight Calendar — launches, events, lives, announcements.
 */

export type SpotlightCalendarView = 'today' | 'tomorrow' | 'this_week' | 'this_month' | 'upcoming' | 'past';

export type SpotlightCalendarEventKind =
  | 'launch'
  | 'event'
  | 'live'
  | 'announcement'
  | 'campaign'
  | 'winner_announcement';

export interface SpotlightCalendarEvent {
  eventId: string;
  kind: SpotlightCalendarEventKind;
  title: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  timezone: string;
  contentId?: string;
  campaignId?: string;
  href?: string;
  isAllDay?: boolean;
}

export interface SpotlightCalendarDay {
  date: string;
  events: SpotlightCalendarEvent[];
}

export interface SpotlightCalendarFilter {
  kinds: SpotlightCalendarEventKind[];
  view: SpotlightCalendarView;
}
