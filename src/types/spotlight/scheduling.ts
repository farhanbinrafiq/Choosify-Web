/**
 * Enhanced scheduling rules — extends base schedule for recurring campaigns.
 */

export type SpotlightRecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface SpotlightScheduleRecurrence {
  frequency: SpotlightRecurrenceFrequency;
  /** ISO 8601 interval or cron-like rule string (future) */
  rule?: string;
  /** Max occurrences before auto-stop */
  maxOccurrences?: number;
  /** End recurrence after this date */
  until?: string;
}

/** Blackout dates — campaign paused on these days even if within start/end */
export interface SpotlightScheduleBlackout {
  /** ISO date (YYYY-MM-DD) */
  date: string;
  reason?: string;
}
