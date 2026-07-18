/**
 * Upcoming events — schedule display (no notification implementation)
 */

export interface SpotlightUpcomingEventSchedule {
  eventId: string;
  date: string;
  time: string;
  timezone: string;
  reminderPlaceholder: boolean;
  notifyMePlaceholder: boolean;
  calendarPlaceholder: boolean;
  countdownEnabled: boolean;
}

export interface SpotlightUpcomingEventDisplay extends SpotlightUpcomingEventSchedule {
  title: string;
  publisherName: string;
  posterUrl?: string;
  slug: string;
}
