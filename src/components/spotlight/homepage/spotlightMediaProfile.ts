import type { MediaDisplayProfile } from '../../media/types/displayProfile';
import { getDisplayProfile } from '../../media/types/displayProfile';

/** Homepage carousel profile — no forced autoplay; hover/tap preview only (LE-005.5) */
export function getHomepageSpotlightMediaProfile(): MediaDisplayProfile {
  const base = getDisplayProfile('homepage_carousel');
  return {
    ...base,
    autoplay: false,
    lazyVideo: true,
    muted: true,
    loop: true,
    showControls: false,
  };
}
