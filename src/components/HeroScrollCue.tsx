import React, { useEffect, useState, type RefObject } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export type HeroScrollCueProps = {
  anchorRef: RefObject<HTMLElement | null>;
  scrollTargetId?: string;
  className?: string;
  resetKey?: string | number;
};

export function HeroScrollCue({
  anchorRef,
  scrollTargetId,
  className,
  resetKey,
}: HeroScrollCueProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [resetKey]);

  useEffect(() => {
    const onScroll = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      setVisible(window.scrollY < anchor.offsetHeight * 0.45);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [anchorRef, resetKey]);

  const scrollToContent = () => {
    if (scrollTargetId) {
      const target = document.getElementById(scrollTargetId);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        return;
      }
    }

    const anchor = anchorRef.current;
    if (!anchor) return;
    window.scrollTo({
      top: anchor.getBoundingClientRect().bottom + window.scrollY,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          onClick={scrollToContent}
          className={cn(
            'absolute left-1/2 bottom-3 sm:bottom-4 z-20 -translate-x-1/2',
            'flex flex-col items-center gap-0.5 px-3.5 py-2 rounded-full shadow-md',
            'bg-white/95 hover:bg-[#E8500A] border border-[#e8edf2] hover:border-[#FF6B00]',
            'text-[#1a1a2e] hover:text-white backdrop-blur-sm cursor-pointer',
            'transition-colors duration-200 group pointer-events-auto',
            className,
          )}
          aria-label="Scroll down to browse contents"
        >
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.22em] leading-none whitespace-nowrap group-hover:text-white">
            Browse contents
          </span>
          <span className="choosify-hero-scroll-cue flex flex-col items-center text-[#E8500A] group-hover:text-white">
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Reserve space below hero so the scroll cue does not overlap the next section. */
export const HERO_SCROLL_CUE_PADDING = 'pb-12 sm:pb-14 overflow-visible';
