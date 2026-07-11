import React, { useMemo, useState } from 'react';
import type { SpotlightCalendarEventKind, SpotlightCalendarView } from '../types/spotlight/discovery/calendar';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { SpotlightDiscoveryNav, SpotlightCalendarPanel } from '../components/spotlight/discovery';
import { buildCalendarEvents, filterCalendarEvents, groupCalendarByDay } from '../utils/spotlightCalendar';

export function SpotlightCalendarPage() {
  const { calendarEvents } = useSpotlightExperience();
  const [view, setView] = useState<SpotlightCalendarView>('this_week');
  const [kinds, setKinds] = useState<SpotlightCalendarEventKind[]>([]);

  const days = useMemo(() => {
    const events = filterCalendarEvents(calendarEvents.length ? calendarEvents : buildCalendarEvents([]), {
      view,
      kinds,
    });
    return groupCalendarByDay(events);
  }, [calendarEvents, view, kinds]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-4 text-left">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Spotlight Calendar</h1>
        <p className="text-sm text-gray-500 mt-2">Launches, events, lives, and announcements at a glance.</p>
      </header>

      <SpotlightDiscoveryNav />

      <SpotlightCalendarPanel
        days={days}
        view={view}
        kinds={kinds}
        onViewChange={setView}
        onKindsChange={setKinds}
      />
    </div>
  );
}
