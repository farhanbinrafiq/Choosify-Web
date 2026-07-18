import React from 'react';
import type { SpotlightContentTimeline } from '../../../types/spotlight/graph/timeline';
import { TIMELINE_EVENT_LABELS } from '../../../types/spotlight/graph/timeline';

interface PublisherTimelineProps {
  timeline: SpotlightContentTimeline;
}

export function PublisherTimeline({ timeline }: PublisherTimelineProps) {
  if (!timeline.events.length) return null;
  return (
    <ol className="relative border-l-2 border-[#e8edf2] ml-3 pl-4 space-y-4 text-left">
      {timeline.events.map((event) => (
        <li key={event.eventId} className="relative">
          <span className="absolute -left-[1.35rem] top-1 w-3 h-3 rounded-full bg-[#E8500A] border-2 border-white" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8500A]">
            {TIMELINE_EVENT_LABELS[event.type]}
          </p>
          <p className="text-sm font-semibold text-[#1a1a2e]">{event.title}</p>
          {event.description && <p className="text-xs text-gray-500">{event.description}</p>}
          <time className="text-[10px] text-gray-400" dateTime={event.timestamp}>
            {new Date(event.timestamp).toLocaleString()}
          </time>
        </li>
      ))}
    </ol>
  );
}
