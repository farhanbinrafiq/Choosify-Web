import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { getVideoEmbedUrl, isDirectVideoFile } from '../lib/videoEmbed';

type VideoLightboxProps = {
  video: { url: string; title: string; isVertical?: boolean } | null;
  onClose: () => void;
};

export function VideoLightbox({ video, onClose }: VideoLightboxProps) {
  const pushedHistoryRef = useRef(false);
  const closingFromPopstateRef = useRef(false);

  const dismiss = useCallback(() => {
    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      closingFromPopstateRef.current = true;
      if (window.history.state?.choosifyVideo) {
        window.history.back();
      }
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!video) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (!pushedHistoryRef.current) {
      window.history.pushState({ choosifyVideo: true }, '');
      pushedHistoryRef.current = true;
    }

    const onPopState = () => {
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
        closingFromPopstateRef.current = true;
        onClose();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
      if (pushedHistoryRef.current && !closingFromPopstateRef.current) {
        pushedHistoryRef.current = false;
      }
      closingFromPopstateRef.current = false;
    };
  }, [video, onClose, dismiss]);

  const embedUrl = video ? getVideoEmbedUrl(video.url) : '';
  const useNativeVideo = video ? isDirectVideoFile(video.url) : false;
  const fallbackVideo =
    'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-virtual-reality-glasses-4384-large.mp4';

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label={video.title || 'Video playback'}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer border-0"
            aria-label="Close video"
            onClick={dismiss}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={cn(
              'relative z-10 w-full bg-slate-950 rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col',
              video.isVertical ? 'max-w-[360px] aspect-[9/16]' : 'max-w-4xl aspect-video',
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/85 via-black/45 to-transparent z-20 flex items-start justify-between gap-3 text-white">
              <div className="flex flex-col text-left min-w-0 pr-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E8500A] mb-0.5">
                  {video.isVertical ? 'Short / Reel Playback' : 'Video Playback'}
                </span>
                <h3 className="text-xs md:text-sm font-extrabold tracking-tight truncate italic">
                  {video.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/15 hover:border-white/25 transition-all text-white shrink-0 cursor-pointer"
                aria-label="Close video"
              >
                <X size={18} />
              </button>
            </div>

            <div className="w-full h-full relative flex items-center justify-center bg-[#050615]">
              {embedUrl && !useNativeVideo ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <video
                  src={useNativeVideo && video.url !== '#' ? video.url : fallbackVideo}
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  playsInline
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
