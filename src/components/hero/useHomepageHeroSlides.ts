import { useMemo } from 'react';
import type { HeroSlide } from './types';
import { useGlobalState } from '../../context/GlobalStateContext';
import { AD_SLOTS, adHref, sponsoredLabel, useAdSlot } from '../../lib/ads/adSlots';

/**
 * Homepage hero — video-only fallback when CMS has no active banners.
 * Choosify's own hero video (public/hero/home-hero.mp4).
 */
const VIDEO_ONLY_SLIDE: HeroSlide = {
  id: 'home-hero-video-fashion',
  title: 'Style that moves with you.',
  subtitle: "Bangladesh's most trusted product discovery platform.",
  primaryCtaText: 'EXPLORE NOW',
  buttonText: 'Explore now',
  primaryCtaLink: '/products',
  secondaryCtaText: 'HOW IT WORKS',
  secondaryCtaLink: '/about',
  videoUrl: '/hero/home-hero.mp4',
};

export function useHomepageHeroSlides(): HeroSlide[] {
  const { homepageConfig } = useGlobalState();
  const heroAds = useAdSlot(AD_SLOTS.HOME_HERO);
  const editorial = useEditorialHeroSlides(homepageConfig);
  // Booked Ads Studio HOME_HERO ads join AFTER the editorial slides, always labelled "Sponsored".
  return useMemo(() => {
    const sponsored: HeroSlide[] = heroAds
      .filter((ad) => ad.image)
      .map((ad) => {
        const target = adHref(ad);
        return {
          id: `ad-${ad.id}`,
          title: ad.alt,
          primaryCtaText: ad.ctaLabel,
          buttonText: ad.ctaLabel || undefined,
          primaryCtaLink: target?.href,
          externalLink: target?.external,
          image: ad.image,
          alt: ad.alt,
          sponsoredLabel: sponsoredLabel(ad),
          adId: ad.id,
        };
      });
    return sponsored.length ? [...editorial, ...sponsored] : editorial;
  }, [editorial, heroAds]);
}

function useEditorialHeroSlides(homepageConfig: ReturnType<typeof useGlobalState>['homepageConfig']): HeroSlide[] {
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
        const mobile = banner.mobileMediaUrl || undefined;
        return {
          id: banner.id,
          title: banner.headline,
          subtitle: banner.subtitle,
          primaryCtaText: banner.ctaText,
          buttonText: banner.buttonText || undefined,
          primaryCtaLink: banner.ctaUrl || undefined,
          // Links to another website open in a new tab (and must not go through the router).
          externalLink: /^https?:\/\//i.test(banner.ctaUrl || ''),
          alt: banner.alt || '',
          focalX: banner.focalX,
          focalY: banner.focalY,
          ...(isVideo
            ? { videoUrl: resolvedMedia, mobileVideoUrl: mobile, image: banner.posterUrl || undefined }
            : { image: resolvedMedia, mobileImage: mobile }),
        };
      })
      .filter((slide): slide is HeroSlide => slide !== null);

    return slides.length ? slides : [VIDEO_ONLY_SLIDE];
  }, [homepageConfig]);
}
