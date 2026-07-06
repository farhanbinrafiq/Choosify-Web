import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboard, Campaign } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { cn } from '../lib/utils';
import { getNavItemByPath } from '../lib/navigation';
export type PageHeroBannerKey =
  | 'home'
  | 'products'
  | 'categories'
  | 'brands'
  | 'guides'
  | 'deals'
  | 'whats-on'
  | 'creators'
  | 'search'
  | 'brand-deals'
  | 'compare';

export type HeroBannerSlide = {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
  sponsorBadge?: string;
  gradient?: string;
};

const PAGE_DEFAULT_SLIDES: Record<PageHeroBannerKey, HeroBannerSlide[]> = {
  home: [
    {
      id: 'home-default-1',
      title: 'Buy ORIGINAL. Shop Verified.',
      subtitle: "Bangladesh's premium brand discovery — authentic outlets only.",
      ctaText: 'Explore Products',
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    },
    {
      id: 'home-default-2',
      title: 'Hot Deals This Week',
      subtitle: 'Flash offers from verified brands — limited time only.',
      ctaText: 'View Deals',
      ctaLink: '/deals',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
      sponsorBadge: 'Sponsored',
    },
  ],
  products: [
    {
      id: 'products-default',
      title: 'Discover Verified Products',
      subtitle: 'Compare verified retail listings with confidence.',
      ctaText: 'Browse Catalog',
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&q=80',
    },
  ],
  categories: [
    {
      id: 'categories-default',
      title: 'Explore Every Category',
      subtitle: 'Fashion, tech, lifestyle and more — all verified outlets.',
      ctaText: 'Browse Categories',
      ctaLink: '/categories',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80',
    },
  ],
  brands: [
    {
      id: 'brands-default',
      title: 'Verified Brand Directory',
      subtitle: 'Shop directly from authentic Bangladeshi and global brands.',
      ctaText: 'View Brands',
      ctaLink: '/brands',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6a6879d31?w=1920&q=80',
    },
  ],
  guides: [
    {
      id: 'guides-default',
      title: 'Expert Buying Guides',
      subtitle: 'YouTube reviews, reels, and blogs to help you choose wisely.',
      ctaText: 'Read Guides',
      ctaLink: '/guides',
      image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6848?w=1920&q=80',
    },
  ],
  deals: [
    {
      id: 'deals-default',
      title: 'Flash Deals & Offers',
      subtitle: 'Limited-time discounts from verified sellers.',
      ctaText: 'Grab Deals',
      ctaLink: '/deals',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672f72a96?w=1920&q=80',
      sponsorBadge: 'Hot',
    },
  ],
  'whats-on': [
    {
      id: 'whats-on-default',
      title: 'Events on Choosify',
      subtitle: 'Launches, festivals, and brand events happening now.',
      ctaText: 'See Events',
      ctaLink: '/whats-on',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    },
  ],
  creators: [
    {
      id: 'creators-default',
      title: 'Trusted Creators & Reviewers',
      subtitle: 'Follow experts who verify products before you buy.',
      ctaText: 'Meet Creators',
      ctaLink: '/creators',
      image: 'https://images.unsplash.com/photo-1611162616305-c69b3037c814?w=1920&q=80',
    },
  ],
  search: [
    {
      id: 'search-default',
      title: 'Search Everything on Choosify',
      subtitle: 'Products, brands, creators, categories — one omni search.',
      ctaText: 'Browse Products',
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1557821552-17105176675c?w=1920&q=80',
    },
  ],
  'brand-deals': [
    {
      id: 'brand-deals-default',
      title: 'Partner Brand Deals',
      subtitle: 'Exclusive offers from verified brand partners.',
      ctaText: 'View Partner Deals',
      ctaLink: '/brand-deals',
      image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1920&q=80',
      sponsorBadge: 'Partner',
    },
  ],
  compare: [
    {
      id: 'compare-default',
      title: 'Compare Before You Buy',
      subtitle: 'Side-by-side specs, prices, and verified reviews.',
      ctaText: 'Start Comparing',
      ctaLink: '/compare',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
    },
  ],
};

function campaignToSlide(c: Campaign): HeroBannerSlide {
  return {
    id: `campaign-${c.id}`,
    title: c.title,
    subtitle: c.tagline,
    ctaText: c.ctaText || 'Explore',
    ctaLink: c.ctaLink,
    image: c.image,
    sponsorBadge: c.sponsorBadge,
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

function isExternalBannerLink(link: string): boolean {
  const trimmed = link.trim();
  return /^https?:\/\//i.test(trimmed) || trimmed.startsWith('//');
}

function normalizeBannerLink(link: string): string {
  const trimmed = link.trim();
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return trimmed;
}

const PAGE_KEY_TO_PATH: Record<PageHeroBannerKey, string> = {
  home: '/',
  products: '/products',
  categories: '/categories',
  brands: '/brands',
  guides: '/guides',
  deals: '/deals',
  'whats-on': '/whats-on',
  creators: '/creators',
  search: '/search',
  'brand-deals': '/brand-deals',
  compare: '/compare',
};

function getCompactHeroTitle(pageKey: PageHeroBannerKey): string {
  const navItem = getNavItemByPath(PAGE_KEY_TO_PATH[pageKey]);
  if (navItem) return navItem.heroTitle;
  return PAGE_DEFAULT_SLIDES[pageKey]?.[0]?.title ?? 'Choosify';
}

interface PageHeroBannerProps {
  pageKey: PageHeroBannerKey;
  className?: string;
  /** Hide when CMS disables home hero */
  hidden?: boolean;
}

export function PageHeroBanner({ pageKey, className, hidden = false }: PageHeroBannerProps) {
  const { campaigns } = useDashboard();
  const { homepageConfig } = useGlobalState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const slides = useMemo<HeroBannerSlide[]>(() => {
    const activeCampaigns = getActiveCampaigns(campaigns).map(campaignToSlide);

    const cmsSlides: HeroBannerSlide[] =
      pageKey === 'home'
        ? (homepageConfig?.heroBanners ?? [])
            .filter((b) => b.isActive)
            .sort((a, b) => a.order - b.order)
            .map((b) => ({
              id: `cms-${b.id}`,
              title: b.headline,
              subtitle: b.subtitle,
              ctaText: b.ctaText,
              ctaLink: b.ctaUrl,
              image: b.backgroundImage,
            }))
        : [];

    const merged = [...cmsSlides, ...activeCampaigns];
    if (merged.length > 0) return merged;
    return PAGE_DEFAULT_SLIDES[pageKey] ?? PAGE_DEFAULT_SLIDES.home;
  }, [campaigns, homepageConfig, pageKey]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [pageKey, slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || !autoplay) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }
    autoplayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [slides.length, autoplay]);

  if (hidden) return null;

  if (pageKey !== 'home') {
    const compactTitle = getCompactHeroTitle(pageKey);
    const compactSubtitle = PAGE_DEFAULT_SLIDES[pageKey]?.[0]?.subtitle;

    return (
      <section
        className={cn(
          'relative w-full border-b border-black/10 select-none choosify-dark-gradient',
          className,
        )}
        aria-label={`${compactTitle} page header`}
      >
        <div className="relative w-full h-[112px] sm:h-[128px] md:h-[140px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#000435]/92 via-[#1A1D4E]/85 to-[#3A1E22]/75" />
          <div className="relative z-10 h-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-center items-start text-left">
            <h1 className="font-space font-black text-white text-xl sm:text-2xl md:text-[1.65rem] uppercase tracking-tight leading-none">
              {compactTitle}
            </h1>
            {compactSubtitle ? (
              <p className="mt-1.5 text-[10px] sm:text-xs text-white/65 max-w-xl leading-relaxed line-clamp-1">
                {compactSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) return null;

  const current = slides[currentIndex];

  const goPrev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const slideLink = current.ctaLink?.trim();
  const slideLinkIsExternal = slideLink ? isExternalBannerLink(slideLink) : false;

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full border-b border-black/10 select-none',
        className,
      )}
      aria-label="Campaign banner"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] overflow-hidden bg-[#0a0a1f]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            {current.image ? (
              <img
                src={current.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="absolute inset-0 hero-gradient"
                style={
                  current.gradient
                    ? { background: current.gradient }
                    : undefined
                }
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#000435]/85 via-[#000435]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/40 via-transparent to-transparent" />

            {slideLink && slideLinkIsExternal && (
              <a
                href={normalizeBannerLink(slideLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-[5] cursor-pointer"
                aria-label={`Open ${current.title}`}
              />
            )}
            {slideLink && !slideLinkIsExternal && (
              <Link
                to={slideLink.startsWith('/') ? slideLink : `/${slideLink}`}
                className="absolute inset-0 z-[5] cursor-pointer"
                aria-label={`Go to ${current.title}`}
              />
            )}

            <div className="relative z-10 h-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 flex flex-col justify-center items-start text-left pointer-events-none">
              {current.sponsorBadge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8500A]/20 text-[#FF8A50] text-[9px] font-bold uppercase tracking-wider border border-[#E8500A]/30 mb-2">
                  <Sparkles className="w-3 h-3" />
                  {current.sponsorBadge}
                </span>
              )}
              <h2 className="font-space font-black text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight leading-tight max-w-xl md:max-w-2xl">
                {current.title.split(' ').map((word, i) =>
                  i % 3 === 2 ? (
                    <span key={i} className="text-[#FF6B00]">
                      {i > 0 ? ' ' : ''}
                      {word}
                    </span>
                  ) : (
                    <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
                  ),
                )}
              </h2>
              {current.subtitle && (
                <p className="mt-2 text-xs sm:text-sm text-white/75 max-w-lg leading-relaxed">
                  {current.subtitle}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#FF6B00] border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#FF6B00] border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setAutoplay(false);
                    setCurrentIndex(idx);
                  }}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    idx === currentIndex
                      ? 'w-8 bg-[#FF6B00]'
                      : 'w-2 bg-white/40 hover:bg-white/70',
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
