import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCalendarEvents } from '../../services/marketingCmsStorage';
import { cn } from '../../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-200',
  scheduled: 'bg-blue-200',
  published: 'bg-green-200',
  active: 'bg-green-200',
  expired: 'bg-red-200',
  paused: 'bg-yellow-200',
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function MarketingCalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const events = useMemo(() => listCalendarEvents(), []);
  const totalDays = daysInMonth(year, month);
  const startDay = startWeekday(year, month);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, typeof events>();
    events.forEach((evt) => {
      const d = new Date(evt.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(evt);
      }
    });
    return map;
  }, [events, year, month]);

  const monthLabel = new Date(year, month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="flex-grow p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">Content Calendar</h1>
        <p className="text-xs text-gray-500">Visual schedule for content and sponsored campaigns (mock)</p>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="px-3 py-1 text-sm border rounded">←</button>
        <h2 className="font-bold text-navy">{monthLabel}</h2>
        <button type="button" onClick={nextMonth} className="px-3 py-1 text-sm border rounded">→</button>
      </div>

      <div className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 text-[10px] font-bold uppercase text-gray-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="p-2 text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => (
            <div
              key={idx}
              className={cn(
                'min-h-[80px] border-t border-r border-[#e8edf2] p-1.5',
                day === null && 'bg-gray-50',
              )}
            >
              {day != null && (
                <>
                  <span className="text-xs font-semibold text-gray-500">{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {(eventsByDay.get(day) ?? []).slice(0, 3).map((evt) => (
                      <Link
                        key={evt.eventId}
                        to={evt.kind === 'content' ? `/marketing/content/${evt.refId}` : `/marketing/sponsored/${evt.refId}`}
                        className={cn(
                          'block text-[8px] font-bold truncate px-1 py-0.5 rounded',
                          STATUS_COLORS[evt.status] ?? 'bg-gray-100',
                        )}
                        title={evt.title}
                      >
                        {evt.title}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <span key={status} className="flex items-center gap-1">
            <span className={cn('w-3 h-3 rounded', color)} />
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}
