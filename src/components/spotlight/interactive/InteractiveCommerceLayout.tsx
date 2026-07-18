import React from 'react';
import type { SpotlightInteractiveCommerceEvent } from '../../../types/spotlight/interactive/event';
import type { SpotlightLiveSource } from '../../../types/spotlight/interactive/sources';
import type { CatalogProduct } from '../../../types/catalog';
import type { SpotlightLiveTimelineChapter } from '../../../types/spotlight/interactive/timeline';
import type { SpotlightRelatedExperienceBundle } from '../../../types/spotlight/graph/relatedExperience';
import type { SpotlightCollaborationMember } from '../../../types/spotlight/collaboration/engine';
import { LiveExperienceHeader } from './LiveExperienceHeader';
import { MultiSourceHub } from './MultiSourceHub';
import { LiveEmbedPlayer } from './LiveEmbedPlayer';
import { LiveCountdown } from './LiveCountdown';
import { ShoppableOverlay } from './ShoppableOverlay';
import { LiveTimeline } from './LiveTimeline';
import { LiveCollaboratorsStrip } from './LiveCollaboratorsStrip';
import { RelatedContentRail } from './RelatedContentRail';
import { trackInteractiveEvent } from '../../../hooks/useInteractiveCommerce';

interface InteractiveCommerceLayoutProps {
  event: SpotlightInteractiveCommerceEvent;
  activeSource?: SpotlightLiveSource;
  pinnedProducts: CatalogProduct[];
  activeChapter?: SpotlightLiveTimelineChapter;
  related?: SpotlightRelatedExperienceBundle;
  collaborators: SpotlightCollaborationMember[];
  onSelectSource: (id: string) => void;
  onSelectChapter: (chapter: SpotlightLiveTimelineChapter) => void;
}

export function InteractiveCommerceLayout({
  event,
  activeSource,
  pinnedProducts,
  activeChapter,
  related,
  collaborators,
  onSelectSource,
  onSelectChapter,
}: InteractiveCommerceLayoutProps) {
  const isUpcoming = event.status === 'upcoming';
  const showPlayer = activeSource && !isUpcoming;

  React.useEffect(() => {
    if (event.status === 'live') trackInteractiveEvent('live_started', event.eventId);
    if (event.status === 'replay' || event.status === 'ended') trackInteractiveEvent('replay_started', event.eventId);
  }, [event.eventId, event.status]);

  return (
    <div className="max-w-7xl mx-auto">
      <LiveExperienceHeader event={event} />
      <LiveCollaboratorsStrip collaborators={collaborators} />

      {isUpcoming && event.scheduledAt && (
        <div className="mb-6 p-6 border border-dashed border-[#E8500A]/30 rounded-[5px] bg-[#FFF8F4] text-center">
          <LiveCountdown targetDate={event.scheduledAt} timezone={event.timezone} className="justify-center" />
          <button
            type="button"
            onClick={() => trackInteractiveEvent('notify_me_click', event.eventId)}
            className="mt-4 px-4 py-2 bg-[#E8500A] text-white text-xs font-black uppercase rounded"
          >
            Notify Me
          </button>
          {event.calendarPlaceholder && (
            <p className="text-[10px] text-gray-400 mt-2 uppercase">Calendar integration reserved</p>
          )}
        </div>
      )}

      <MultiSourceHub
        sources={event.sources}
        activeSourceId={activeSource?.sourceId ?? event.activeSourceId}
        onSelect={onSelectSource}
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div>
          {showPlayer ? (
            <LiveEmbedPlayer source={activeSource} title={event.title} posterUrl={event.posterUrl} />
          ) : isUpcoming ? (
            <div className="aspect-video bg-gray-100 rounded-[5px] flex items-center justify-center">
              {event.posterUrl ? (
                <img src={event.posterUrl} alt="" className="w-full h-full object-cover rounded-[5px]" />
              ) : (
                <p className="text-sm text-gray-400">Poster preview</p>
              )}
            </div>
          ) : null}

          {event.timeline.length > 0 && (
            <div className="mt-6">
              <LiveTimeline
                chapters={event.timeline}
                activeChapterId={activeChapter?.chapterId}
                onSelect={onSelectChapter}
              />
            </div>
          )}
        </div>

        <ShoppableOverlay
          event={event}
          products={pinnedProducts}
          activeChapter={activeChapter}
        />
      </div>

      <RelatedContentRail related={related} />
    </div>
  );
}

/** Replay uses identical layout — timeline and pins preserved */
export function ReplayExperienceLayout(props: InteractiveCommerceLayoutProps) {
  return <InteractiveCommerceLayout {...props} />;
}
