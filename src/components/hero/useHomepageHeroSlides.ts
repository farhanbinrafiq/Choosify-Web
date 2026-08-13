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

    return active.map((banner): HeroSlide => {
      const isVideo = banner.mediaType === 'video';
      const mediaUrl = banner.mediaUrl || banner.backgroundVideo || banner.backgroundImage;
      return {
        id: banner.id,
        title: banner.headline,
        subtitle: banner.subtitle,
        primaryCtaText: banner.ctaText,
        primaryCtaLink: banner.ctaUrl,
        ...(isVideo
          ? { videoUrl: mediaUrl || banner.backgroundImage }
          : { image: banner.mediaUrl || banner.backgroundImage }),
      };
    });
  }, [homepageConfig]);
}
