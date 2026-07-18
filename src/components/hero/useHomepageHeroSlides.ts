import { useMemo } from 'react';
import type { HeroSlide } from './types';

/**
 * Homepage hero — video-only for now.
 * Pexels: “Woman showcasing a dress” by MART PRODUCTION
 * https://www.pexels.com/video/woman-showcasing-a-dress-7679832/
 * Photo/CMS/campaign slides can be re-enabled later via hybrid HeroSlide fields.
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
  return useMemo(() => [VIDEO_ONLY_SLIDE], []);
}
