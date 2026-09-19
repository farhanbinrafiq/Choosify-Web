import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { resolveCreatorReviewMedia, type CreatorReviewPlatform } from '../../lib/videoEmbed';
import { FacebookSdkEmbed, InstagramSdkEmbed } from './MetaSdkEmbed';

/**
 * Presentation-only box sizing per platform's actual embed shape -- not
 * every provider is a bare 16:9/9:16 video:
 *  - YouTube (both shapes) and Facebook video are pure video, no extra
 *    platform chrome, so a plain landscape/portrait video box fits.
 *  - Instagram posts are native square/4:5/portrait, never 16:9.
 *  - Instagram Reels / Facebook Reels are portrait video but with modest
 *    caption/action-bar chrome layered on top -- a touch roomier than a
 *    bare video box.
 *  - TikTok's frame always renders caption/like/follow chrome below the
 *    video itself; assuming it's "just a 9:16 video" clips that chrome, so
 *    it gets independently-constrained width/height instead of one strict
 *    aspect ratio.
 * All values are relative (min()/vh/vw), never a bare fixed pixel height.
 */
function getViewerBoxClassName(platform: CreatorReviewPlatform): string {
  switch (platform) {
    case 'youtube_shorts':
      return 'h-[min(75vh,600px)] max-h-[75vh] w-auto aspect-[9/16]';
    case 'instagram_post':
      return 'w-[min(480px,90vw)] max-h-[85vh] aspect-square';
    case 'instagram_reel':
      return 'h-[min(80vh,640px)] max-h-[80vh] w-auto aspect-[3/5]';
    case 'facebook_reel':
      // True Reel aspect (Facebook's own generated embed is 267x476, ~9:16),
      // isolated from Instagram Reel's box so this doesn't drift the two
      // platforms together again.
      return 'h-[min(80vh,640px)] max-h-[80vh] w-auto aspect-[9/16]';
    case 'tiktok':
      return 'w-[min(380px,92vw)] h-[min(85vh,720px)]';
    case 'youtube':
    case 'facebook_video':
    case 'unknown':
    default:
      return 'w-[min(880px,90vw)] max-w-full aspect-video';
  }
}

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
              getViewerBoxClassName(resolved.platform),
            )}
          >
            {resolved.canEmbed ? (
              resolved.platform === 'facebook_reel' || resolved.platform === 'facebook_video' ? (
                // Facebook's plugins/video.php iframe returns "Video
                // unavailable" for this content in real-browser testing even
                // with a canonicalized href and official-style attributes --
                // Meta's own current reference implementation
                // (facebook/meta-embeds-for-wordpress) does not use that
                // iframe either. This renders the same official XFBML
                // container that architecture uses instead. Isolated from
                // the other platforms' iframe below so YouTube/TikTok's
                // existing behavior can't drift.
                <>
                  <FacebookSdkEmbed href={resolved.canonicalUrl} />
                  {/* Facebook's player renders inside a cross-origin iframe
                      Choosify cannot inspect -- if Facebook itself refuses
                      inline playback for this content (a real, observed
                      failure mode independent of this implementation), the
                      only signal is inside that iframe. Rather than trying
                      to detect it, this gives the user a working escape
                      hatch that's visible immediately, not just discoverable
                      in the info bar below the modal. */}
                  <a
                    href={resolved.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/85 text-white text-[11px] font-bold backdrop-blur-sm transition-colors"
                  >
                    Watch on Facebook <ExternalLink size={11} />
                  </a>
                </>
              ) : resolved.platform === 'instagram_reel' || resolved.platform === 'instagram_post' ? (
                // Same rationale as Facebook above, using Instagram's
                // official blockquote + embed.js mechanism.
                <InstagramSdkEmbed permalink={resolved.canonicalUrl} />
              ) : (
                <iframe
                  src={resolved.embedUrl}
                  title={media.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                <p className="text-sm font-semibold text-white/80">This video can&rsquo;t be played here.</p>
                <a
                  href={resolved.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#1A1A2E] text-[12px] font-bold"
                >
                  Watch on {resolved.platformLabel} <ExternalLink size={12} />
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
