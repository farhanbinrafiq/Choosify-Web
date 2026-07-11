import type { SpotlightCalendarDay, SpotlightCalendarEvent, SpotlightCalendarFilter, SpotlightCalendarView } from '../types/spotlight/discovery/calendar';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function contentToCalendarEvent(content: SpotlightContent): SpotlightCalendarEvent | null {
  const startsAt = content.live?.scheduledAt ?? content.publishedAt;
  if (!startsAt) return null;

  let kind: SpotlightCalendarEvent['kind'] = 'campaign';
  if (content.contentType === 'live' || content.isLive) kind = 'live';
  else if (content.contentType === 'event') kind = 'event';
  else if (content.contentType === 'announcement') kind = 'announcement';
  else if (content.contentType === 'new_launch') kind = 'launch';

  return {
    eventId: `cal-${content.contentId}`,
    kind,
    title: content.headline,
    description: content.description,
    startsAt,
    endsAt: content.endsAt,
    timezone: 'Asia/Dhaka',
    contentId: content.contentId,
    campaignId: content.sourceKind === 'campaign' ? content.sourceId : undefined,
    href: content.href,
  };
}

export function buildCalendarEvents(allContent: SpotlightContent[]): SpotlightCalendarEvent[] {
  const fromContent = allContent.map(contentToCalendarEvent).filter(Boolean) as SpotlightCalendarEvent[];

  const fromCampaigns = listCampaignRecords().map((c) => ({
    eventId: `cal-campaign-${c.campaignId}`,
    kind: (c.campaignType === 'livestream' ? 'live' : c.campaignType === 'new_launch' ? 'launch' : 'campaign') as SpotlightCalendarEvent['kind'],
    title: c.headline,
    description: c.shortDescription,
    startsAt: c.schedule.startAt,
    endsAt: c.schedule.endAt,
    timezone: c.schedule.timezone ?? 'Asia/Dhaka',
    campaignId: c.campaignId,
    href: c.campaignType === 'livestream' ? `/spotlight/live/${c.campaignSlug}` : `/spotlight/${c.campaignSlug}`,
  }));

  return [...fromContent, ...fromCampaigns].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

function viewRange(view: SpotlightCalendarView, now = new Date()): { start: Date; end: Date } {
  const today = startOfDay(now);
  switch (view) {
    case 'today':
      return { start: today, end: new Date(today.getTime() + 86_400_000 - 1) };
    case 'tomorrow': {
      const t = new Date(today.getTime() + 86_400_000);
      return { start: t, end: new Date(t.getTime() + 86_400_000 - 1) };
    }
    case 'this_week': {
      const end = new Date(today.getTime() + 7 * 86_400_000);
      return { start: today, end };
    }
    case 'this_month': {
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
      return { start: today, end };
    }
    case 'past': {
      const start = new Date(0);
      return { start, end: new Date(today.getTime() - 1) };
    }
    case 'upcoming':
    default: {
      const end = new Date(today.getTime() + 90 * 86_400_000);
      return { start: today, end };
    }
  }
}

export function filterCalendarEvents(events: SpotlightCalendarEvent[], filter: SpotlightCalendarFilter): SpotlightCalendarEvent[] {
  const { start, end } = viewRange(filter.view);
  return events.filter((e) => {
    const t = new Date(e.startsAt).getTime();
    if (t < start.getTime() || t > end.getTime()) return false;
    if (filter.kinds.length && !filter.kinds.includes(e.kind)) return false;
    return true;
  });
}

export function groupCalendarByDay(events: SpotlightCalendarEvent[]): SpotlightCalendarDay[] {
  const map = new Map<string, SpotlightCalendarEvent[]>();
  for (const e of events) {
    const key = dateKey(new Date(e.startsAt));
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayEvents]) => ({ date, events: dayEvents }));
}
