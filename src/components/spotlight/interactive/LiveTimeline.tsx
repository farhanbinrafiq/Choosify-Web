import React from 'react';
import type { SpotlightLiveTimelineChapter } from '../../../types/spotlight/interactive/timeline';
import { cn } from '../../../lib/utils';

interface LiveTimelineProps {
  chapters: SpotlightLiveTimelineChapter[];
  activeChapterId?: string;
  onSelect: (chapter: SpotlightLiveTimelineChapter) => void;
}

/** Synchronized Commerce Timeline (CTO) */
export function LiveTimeline({ chapters, activeChapterId, onSelect }: LiveTimelineProps) {
  if (!chapters.length) return null;

  return (
    <nav className="text-left" aria-label="Live timeline chapters">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Timeline</p>
      <ol className="space-y-1">
        {chapters.map((chapter) => (
          <li key={chapter.chapterId}>
            <button
              type="button"
              onClick={() => onSelect(chapter)}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-[5px] border text-left transition-colors',
                activeChapterId === chapter.chapterId
                  ? 'border-[#E8500A] bg-[#FFF8F4]'
                  : 'border-[#e8edf2] bg-white hover:border-[#E8500A]/30',
              )}
            >
              <span className="text-[11px] font-black tabular-nums text-[#E8500A] shrink-0 w-12">
                {chapter.timestampLabel}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1a1a2e]">{chapter.title}</p>
                {chapter.description && <p className="text-[11px] text-gray-500 line-clamp-1">{chapter.description}</p>}
                {chapter.links.length > 0 && (
                  <p className="text-[9px] text-gray-400 mt-1 uppercase">
                    {chapter.links.map((l) => l.kind).join(' · ')}
                  </p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
