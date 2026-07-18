import { useMemo } from 'react';
import { useDashboard, type Campaign } from '../../context/DashboardContext';
import { useGlobalState } from '../../context/GlobalStateContext';
import type { HeroSlide } from './types';

/**
 * Review slide — Pexels: “Woman showcasing a dress” by MART PRODUCTION
 * https://www.pexels.com/video/woman-showcasing-a-dress-7679832/
 * Remove or demote once CMS banners include production video creatives.
 */
const REVIEW_VIDEO_SLIDE: HeroSlide = {
  id: 'home-review-video-fashion',
  title: 'Style that moves with you.',
  subtitle: 'Hybrid hero preview — fashion video + still campaigns in one banner.',
  primaryCtaText: 'EXPLORE NOW',
  primaryCtaLink: '/products',
  secondaryCtaText: 'HOW IT WORKS',
  secondaryCtaLink: '/about',
  videoUrl: '/hero/fashion-dress-showcase.mp4',
  image:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
  gradient: 'linear-gradient(135deg, #1a0a2e 0%, #0f0c29 40%, #24243e 100%)',
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'home-editorial-1',
    title: 'Choose, Compare & Decide Wisely.',
    subtitle: "Bangladesh's most trusted product discovery platform.",
    primaryCtaText: 'EXPLORE NOW',
    primaryCtaLink: '/products',
    secondaryCtaText: 'HOW IT WORKS',
    secondaryCtaLink: '/about',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #0f0c29 40%, #24243e 100%)',
  },
  {
    id: 'home-editorial-2',
    title: 'Discover What Matters Today.',
    subtitle: 'Spotlight campaigns, expert guides, and verified deals — curated for you.',
    primaryCtaText: 'VIEW SPOTLIGHT',
    primaryCtaLink: '/spotlight',
    secondaryCtaText: 'BROWSE DEALS',
    secondaryCtaLink: '/deals',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6848?w=1200&q=80',
    gradient: 'linear-gradient(135deg, #0a0a1f 0%, #1A1D4E 50%, #2d1b4e 100%)',
  },
];

function campaignToSlide(c: Campaign): HeroSlide {
  return {
    id: `campaign-${c.id}`,
    title: c.title,
    subtitle: c.tagline,
    primaryCtaText: c.ctaText || 'EXPLORE NOW',
    primaryCtaLink: c.ctaLink || '/products',
    secondaryCtaText: 'HOW IT WORKS',
    secondaryCtaLink: '/about',
    image: c.image,
  };
}

function getActiveCampaigns(campaigns: Campaign[]): Campaign[] {
  const now = new Date();
  return campaigns
    .filter((c) => {
      if (!c.active) return false;
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      return true;
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

export function useHomepageHeroSlides(): HeroSlide[] {
  const { campaigns } = useDashboard();
  const { homepageConfig } = useGlobalState();

  return useMemo(() => {
    const cmsSlides: HeroSlide[] = (homepageConfig?.heroBanners ?? [])
      .filter((b) => b.isActive)
      .sort((a, b) => a.order - b.order)
      .map((b) => ({
        id: `cms-${b.id}`,
        title: b.headline,
        subtitle: b.subtitle,
        primaryCtaText: b.ctaText || 'EXPLORE NOW',
        primaryCtaLink: b.ctaUrl || '/products',
        secondaryCtaText: 'HOW IT WORKS',
        secondaryCtaLink: '/about',
        image: b.backgroundImage,
        videoUrl: b.backgroundVideo,
      }));

    const campaignSlides = getActiveCampaigns(campaigns).map(campaignToSlide);
    const merged = [...cmsSlides, ...campaignSlides];
    const rest = merged.length ? merged : DEFAULT_SLIDES;
    return [REVIEW_VIDEO_SLIDE, ...rest];
  }, [campaigns, homepageConfig]);
}
