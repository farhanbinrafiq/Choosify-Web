import React from 'react';
import { Link } from 'react-router-dom';
import type { SpotlightCalendarDay, SpotlightCalendarEventKind, SpotlightCalendarView } from '../../../types/spotlight/discovery/calendar';
import { cn } from '../../../lib/utils';

const VIEW_OPTIONS: { value: SpotlightCalendarView; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

const KIND_OPTIONS: { value: SpotlightCalendarEventKind; label: string }[] = [
  { value: 'launch', label: 'Launches' },
  { value: 'event', label: 'Events' },
  { value: 'live', label: 'Lives' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'campaign', label: 'Campaigns' },
  { value: 'winner_announcement', label: 'Winners' },
];

interface SpotlightCalendarViewProps {
  days: SpotlightCalendarDay[];
  view: SpotlightCalendarView;
  kinds: SpotlightCalendarEventKind[];
  onViewChange: (view: SpotlightCalendarView) => void;
  onKindsChange: (kinds: SpotlightCalendarEventKind[]) => void;
}

export function SpotlightCalendarPanel({
  days,
  view,
  kinds,
  onViewChange,
  onKindsChange,
}: SpotlightCalendarViewProps) {
  const toggleKind = (kind: SpotlightCalendarEventKind) => {
    onKindsChange(kinds.includes(kind) ? kinds.filter((k) => k !== kind) : [...kinds, kind]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Calendar view">
        {VIEW_OPTIONS.map((v) => (
          <button
            key={v.value}
            type="button"
            role="tab"
            aria-selected={view === v.value}
            onClick={() => onViewChange(v.value)}
            className={cn(
              'px-3 py-2 min-h-[44px] text-[10px] font-bold uppercase rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]',
              view === v.value ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-[#e8edf2]',
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Calendar filters">
        {KIND_OPTIONS.map((k) => (
          <button
            key={k.value}
            type="button"
            onClick={() => toggleKind(k.value)}
            className={cn(
              'px-3 py-1.5 text-[10px] font-bold uppercase rounded-full border',
              kinds.includes(k.value) ? 'bg-[#EB4501]/10 text-[#EB4501] border-[#EB4501]/30' : 'text-gray-400 border-[#e8edf2]',
            )}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {days.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">No events in this period.</p>
        ) : (
          days.map((day) => (
            <div key={day.date}>
              <h3 className="text-xs font-black uppercase text-gray-400 mb-3">
                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <ul className="space-y-2">
                {day.events.map((e) => (
                  <li key={e.eventId}>
                    {e.href ? (
                      <Link
                        to={e.href}
                        className="flex items-start gap-3 p-3 border border-[#e8edf2] rounded-[5px] hover:border-[#EB4501]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]"
                      >
                        <EventTime startsAt={e.startsAt} />
                        <EventBody kind={e.kind} title={e.title} description={e.description} />
                      </Link>
                    ) : (
                      <div className="flex items-start gap-3 p-3 border border-[#e8edf2] rounded-[5px]">
                        <EventTime startsAt={e.startsAt} />
                        <EventBody kind={e.kind} title={e.title} description={e.description} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EventTime({ startsAt }: { startsAt: string }) {
  return (
    <time dateTime={startsAt} className="shrink-0 text-[10px] font-bold text-[#EB4501] w-14">
      {new Date(startsAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
    </time>
  );
}

function EventBody({ kind, title, description }: { kind: string; title: string; description?: string }) {
  return (
    <div className="text-left min-w-0">
      <span className="text-[9px] font-black uppercase text-gray-400">{kind.replace('_', ' ')}</span>
      <p className="text-sm font-semibold text-[#1a1a2e]">{title}</p>
      {description && <p className="text-[11px] text-gray-500 line-clamp-1">{description}</p>}
    </div>
  );
}
