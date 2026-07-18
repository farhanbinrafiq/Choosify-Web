import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SpotlightStoryGroup } from '../../../types/spotlight/discovery/story';
import { cn } from '../../../lib/utils';

interface SpotlightStoryViewerProps {
  groups: SpotlightStoryGroup[];
  initialGroupIndex?: number;
  onClose?: () => void;
}

/** Architecture-only story mode — full screen, tap/swipe navigation, progress bars */
export function SpotlightStoryViewer({ groups, initialGroupIndex = 0, onClose }: SpotlightStoryViewerProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const group = groups[groupIndex];
  const slide = group?.slides[slideIndex];
  const duration = slide?.durationMs ?? 5000;

  const next = useCallback(() => {
    if (!group) return;
    if (slideIndex < group.slides.length - 1) {
      setSlideIndex((i) => i + 1);
      setProgress(0);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex((i) => i + 1);
      setSlideIndex(0);
      setProgress(0);
    } else {
      onClose?.();
    }
  }, [group, groupIndex, groups.length, onClose, slideIndex]);

  const prev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex((i) => i - 1);
      setProgress(0);
    } else if (groupIndex > 0) {
      setGroupIndex((i) => i - 1);
      setSlideIndex(Math.max(0, (groups[groupIndex - 1]?.slides.length ?? 1) - 1));
      setProgress(0);
    }
  }, [groupIndex, groups, slideIndex]);

  useEffect(() => {
    if (!slide) return;
    const step = 50;
    const timer = setInterval(() => {
      setProgress((p) => {
        const nextP = p + (step / duration) * 100;
        if (nextP >= 100) {
          clearInterval(timer);
          next();
          return 0;
        }
        return nextP;
      });
    }, step);
    return () => clearInterval(timer);
  }, [slide, duration, next]);

  if (!group || !slide) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-white flex flex-col motion-reduce:transition-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Story from ${group.publisherName}`}
    >
      <div className="flex gap-1 px-2 pt-3 safe-area-top">
        {group.slides.map((s, i) => (
          <div key={s.slideId} className="flex-1 h-0.5 bg-white/30 rounded overflow-hidden">
            <div
              className={cn('h-full bg-white transition-all motion-reduce:transition-none', i < slideIndex && 'w-full', i === slideIndex && 'w-auto')}
              style={i === slideIndex ? { width: `${progress}%` } : i < slideIndex ? { width: '100%' } : { width: 0 }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 min-w-0">
          {group.publisherAvatar && (
            <img src={group.publisherAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          )}
          <span className="text-sm font-bold truncate">{group.publisherName}</span>
        </div>
        <button type="button" onClick={onClose} className="p-2 min-h-[44px] min-w-[44px]" aria-label="Close story">
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4">
        <button type="button" className="absolute left-0 inset-y-0 w-1/3 z-10" aria-label="Previous" onClick={prev} />
        <button type="button" className="absolute right-0 inset-y-0 w-1/3 z-10" aria-label="Next" onClick={next} />

        <div className="max-w-lg w-full text-center space-y-4">
          {slide.mediaUrl && slide.kind !== 'product' && (
            <img src={slide.mediaUrl} alt="" className="max-h-[50vh] mx-auto rounded-lg object-contain" />
          )}
          {slide.headline && <h2 className="text-xl font-bold">{slide.headline}</h2>}
          {slide.description && <p className="text-sm text-white/70">{slide.description}</p>}
          {slide.href && slide.ctaLabel && (
            <Link
              to={slide.href}
              className="inline-flex px-6 py-3 min-h-[44px] bg-[#E8500A] text-white text-xs font-black uppercase rounded"
            >
              {slide.ctaLabel}
            </Link>
          )}
        </div>
      </div>

      <div className="flex justify-between px-4 pb-6 safe-area-bottom">
        <button type="button" onClick={prev} className="p-3 min-h-[44px]" aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <button type="button" onClick={next} className="p-3 min-h-[44px]" aria-label="Next slide">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

interface SpotlightStoryRailProps {
  groups: SpotlightStoryGroup[];
  onOpen: (index: number) => void;
}

export function SpotlightStoryRail({ groups, onOpen }: SpotlightStoryRailProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2" aria-label="Stories">
      {groups.map((g, i) => (
        <button
          key={g.storyGroupId}
          type="button"
          onClick={() => onOpen(i)}
          className="shrink-0 flex flex-col items-center gap-1 min-w-[72px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8500A] rounded-lg p-1"
          aria-label={`Open story from ${g.publisherName}`}
        >
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#E8500A] to-amber-400">
            {g.publisherAvatar ? (
              <img src={g.publisherAvatar} alt="" className="w-full h-full rounded-full object-cover border-2 border-white" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 border-2 border-white" />
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-600 truncate max-w-[72px]">{g.publisherName}</span>
        </button>
      ))}
    </div>
  );
}
