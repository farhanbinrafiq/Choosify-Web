import React from 'react';
import type { SpotlightInteractiveCommerceEvent } from '../../../types/spotlight/interactive/event';
import { LIVE_EXPERIENCE_LABELS, OFFICIAL_LIVE_BADGE_LABELS } from '../../../types/spotlight/interactive/experience';
import { SpotlightLiveBadge } from '../experience/SpotlightLiveBadge';
import { SpotlightPublisherRow } from '../experience/SpotlightPublisherRow';
import { resolvePrimaryInteractiveCtaLabel } from '../../../types/spotlight/interactive/cta';

interface LiveExperienceHeaderProps {
  event: SpotlightInteractiveCommerceEvent;
}

export function LiveExperienceHeader({ event }: LiveExperienceHeaderProps) {
  const statusBadge =
    event.status === 'live'
      ? 'live'
      : event.status === 'upcoming'
        ? 'upcoming'
        : event.status === 'replay' || event.status === 'ended'
          ? 'replay'
          : 'live';

  return (
    <header className="text-left mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <SpotlightLiveBadge status={statusBadge} />
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#EB4501]/10 text-[#EB4501] border border-[#EB4501]/20">
          {LIVE_EXPERIENCE_LABELS[event.experienceKind]}
        </span>
        {event.officialKind && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-navy/10 text-navy border border-navy/20">
            {OFFICIAL_LIVE_BADGE_LABELS[event.officialKind]}
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-gray-100 text-gray-500">
          {event.domain.replace('_', ' ')}
        </span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">{event.title}</h1>
      {event.description && <p className="text-sm text-gray-500 mt-2">{event.description}</p>}
      <div className="mt-3">
        <SpotlightPublisherRow publisher={event.publisher} />
      </div>
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {event.tags.slice(0, 6).map((tag) => (
            <span key={tag} className="text-[9px] uppercase tracking-wide text-gray-400 border border-gray-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-[10px] font-bold uppercase text-[#EB4501] mt-3">{resolvePrimaryInteractiveCtaLabel(event)}</p>
    </header>
  );
}
