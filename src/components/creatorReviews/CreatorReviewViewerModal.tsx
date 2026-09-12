import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { resolveCreatorReviewMedia } from '../../lib/videoEmbed';

export interface CreatorReviewViewerMedia {
  videoUrl: string;
  title: string;
  creatorHandle?: string;
}

interface Props {
  media: CreatorReviewViewerMedia | null;
  onClose: () => void;
}

/**
 * The single, shared Choosify media viewer for Creator Reviews. Every
 * review card (Product Details, Brand Details) opens the SAME instance of
 * this modal rather than embedding its own iframe inline — there is never
 * more than one third-party embed mounted in the tree at once, so playing
 * a second review always tears down the first (no overlapping audio), and
 * closing this modal always unmounts the iframe (no audio after close).
 */
export function CreatorReviewViewerModal({ media, onClose }: Props) {
  useEffect(() => {
    if (!media) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [media, onClose]);

  if (!media) return null;

  const resolved = resolveCreatorReviewMedia(media.videoUrl);
  const isPortrait = resolved.orientation === 'portrait';

  return (
    <AnimatePresence>
      <motion.div
        key={media.videoUrl}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={media.title}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="flex flex-col items-center gap-3 max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={cn(
              'relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10',
              isPortrait
                ? 'h-[min(75vh,600px)] max-h-[75vh] w-auto aspect-[9/16]'
                : 'w-[min(880px,90vw)] max-w-full aspect-video',
            )}
          >
            {resolved.canEmbed ? (
              <iframe
                src={resolved.embedUrl}
                title={media.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                <p className="text-sm font-semibold text-white/80">
                  Preview not available for {resolved.platformLabel} here.
                </p>
                <a
                  href={resolved.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#1A1A2E] text-[12px] font-bold"
                >
                  Open on {resolved.platformLabel} <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 w-full max-w-[520px] text-white">
            <div className="min-w-0">
              <p className="text-[13px] font-bold truncate">{media.title}</p>
              {media.creatorHandle && (
                <p className="text-[11.5px] text-white/60 truncate">{media.creatorHandle}</p>
              )}
            </div>
            <a
              href={resolved.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#1A1A2E] text-[11.5px] font-bold whitespace-nowrap hover:brightness-95"
            >
              Watch on {resolved.platformLabel} <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CreatorReviewViewerModal;
