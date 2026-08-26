import { useMemo } from 'react';
import type { HeroSlide } from './types';
import { useGlobalState } from '../../context/GlobalStateContext';

/**
 * Homepage hero — video-only fallback when CMS has no active banners.
 * Pexels: “Woman showcasing a dress” by MART PRODUCTION
 * https://www.pexels.com/video/woman-showcasing-a-dress-7679832/
 */
const VIDEO_ONLY_SLIDE: HeroSlide = {
  id: 'home-hero-video-fashion',
  title: 'Style that moves with you.',
  subtitle: "Bangladesh's most trusted product discovery platform.",
  primaryCtaText: 'EXPLORE NOW',
  primaryCtaLink: '/products',
  secondaryCtaText: 'HOW IT WORKS',
  secondaryCtaLink: '/about',
  videoUrl: '/hero/fashion-dress-showcase.mp4',
};

export function useHomepageHeroSlides(): HeroSlide[] {
  const { homepageConfig } = useGlobalState();

  return useMemo(() => {
    const active = (homepageConfig?.heroBanners ?? [])
      .filter((banner) => banner.isActive)
      .sort((a, b) => a.order - b.order);

    if (!active.length) return [VIDEO_ONLY_SLIDE];

    // A banner marked active in the CMS but never given a real image/video
    // (e.g. created but not yet finished) previously still rendered a slide
    // with an empty media src -- a visibly broken image on the homepage.
    // Skip those rather than render a blank slide; fall back to the video
    // slide if nothing usable remains.
    const slides = active
      .map((banner): HeroSlide | null => {
        const isVideo = banner.mediaType === 'video';
        const mediaUrl = banner.mediaUrl || banner.backgroundVideo || banner.backgroundImage;
        const resolvedMedia = isVideo ? mediaUrl || banner.backgroundImage : banner.mediaUrl || banner.backgroundImage;
        if (!resolvedMedia) return null;
        return {
          id: banner.id,
          title: banner.headline,
          subtitle: banner.subtitle,
          primaryCtaText: banner.ctaText,
          primaryCtaLink: banner.ctaUrl,
          ...(isVideo ? { videoUrl: resolvedMedia } : { image: resolvedMedia }),
        };
      })
      .filter((slide): slide is HeroSlide => slide !== null);

    return slides.length ? slides : [VIDEO_ONLY_SLIDE];
  }, [homepageConfig]);
}
