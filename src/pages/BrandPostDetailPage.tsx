import React, { useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDot,
  ExternalLink,
  FileText,
  Images,
  MapPin,
  Share2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DetailHeroSummaryBar,
  detailHeroSummaryActionPrimaryClass,
  detailHeroSummaryActionSecondaryClass,
} from '../components/DetailHeroSummaryBar';
import { DETAIL_SINGLE_FEED, DETAIL_FEED_GRID_5, WHATS_ON_CARD_GRID } from '../lib/pageLayout';
import { ProductCard } from '../components/ProductCard';
import { BrandPostCard } from '../components/BrandPostCard';
import { BrandPostBannerGallery } from '../components/BrandPostBannerGallery';
import { StickySectionNav } from '../components/StickySectionNav';
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { useRegisterPageFilters } from '../components/FilterEngine';
import { StudioWrap } from '../components/studio/StudioWrap';
import { useGlobalState } from '../context/GlobalStateContext';
import {
  formatBrandPostDateRange,
  getBrandPostBannerImages,
  getBrandPostBySlug,
  getBrandPostsByBrandId,
} from '../lib/brandPosts';
import { resolveEventBadges } from '../utils/eventBadges';
import { PRODUCTS } from '../constants';

export function BrandPostDetailPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { siteConfig } = useGlobalState();
  const post = slug ? getBrandPostBySlug(slug) : undefined;

  const bannerImages = useMemo(
    () => (post ? getBrandPostBannerImages(post) : []),
    [post],
  );

  const relatedPosts = useMemo(
    () => (post ? getBrandPostsByBrandId(post.brandId).filter((p) => p.slug !== post.slug).slice(0, 4) : []),
    [post],
  );

  const linkedProducts = useMemo(() => {
    if (!post?.linkedProductIds?.length) return [];
    return PRODUCTS.filter((p) => post.linkedProductIds!.includes(p.id));
  }, [post]);

  const eventBadges = useMemo(
    () => (post ? resolveEventBadges(post, siteConfig) : []),
    [post, siteConfig],
  );

  const sectionNavItems = useMemo(() => {
    const items = [
      { id: 'event-about', label: 'About', icon: <FileText size={13} /> },
    ];
    if (linkedProducts.length > 0) {
      items.push({ id: 'related-products', label: 'Products', icon: <ShoppingBag size={13} /> });
    }
    if (relatedPosts.length > 0) {
      items.push({ id: 'more-events', label: 'More Events', icon: <Sparkles size={13} /> });
    }
    return items;
  }, [linkedProducts.length, relatedPosts.length]);

  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(sectionNavItems);

  useRegisterPageFilters({
    pageName: post?.title ?? 'Events',
    renderSearch: null,
    quickFilters: [],
    renderFilters: null,
    activeFilterCount: 0,
    onClearAll: null,
    sectionNav: {
      items: sectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Event',
      profileLabel: 'Event detail',
    },
  });

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm font-bold text-[#1A1D4E]">This post could not be found.</p>
        <Link to="/products" className="text-[#E8500A] text-xs font-black uppercase hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  const dateLabel = formatBrandPostDateRange(post.startDate, post.endDate);
  const statusLabel =
    post.status === 'live' ? 'Live Now' : post.status === 'scheduled' ? 'Upcoming' : 'Ended';

  return (
    <div className="bg-[#F4F7F9] min-h-screen pb-16">
      <section
        ref={heroRef}
        className="relative w-full bg-[#000435] border-b border-white/5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,0,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,4,53,0.4),transparent_55%)]" />

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
            <div className="flex flex-wrap items-center justify-end gap-3">
              {eventBadges.map((badge) => (
                <span
                  key={badge.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: badge.color }}
                >
                  {badge.label}
                </span>
              ))}
              {dateLabel && (
                <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80 tracking-tight bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg">
                  <CalendarDays size={14} className="text-[#FF5B00]" />
                  {dateLabel}
                </div>
              )}
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#FF5B00] tracking-tight bg-[#FF5B00]/10 px-3.5 py-2 rounded-lg border border-[#FF5B00]/20">
                <Sparkles size={14} className="text-[#FF5B00]" />
                {statusLabel}
              </div>
            </div>
          </div>

          <BrandPostBannerGallery images={bannerImages} alt={post.title} />

          <div className="max-w-[1080px] mx-auto px-6 pb-8 text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-sans drop-shadow-xl">
              {post.title}
            </h1>

            <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed mb-6 max-w-4xl font-sans">
              {post.excerpt}
            </p>
          </div>

          <DetailHeroSummaryBar
            actionsPlacement="bottom-center"
            items={[
              {
                id: 'brand',
                icon: Building2,
                label: post.brandName,
              },
              {
                id: 'event-type',
                icon: Sparkles,
                label: eventBadges.find((b) => b.mapsTo !== 'sponsored')?.label ?? post.kind,
              },
              {
                id: 'location',
                icon: MapPin,
                wide: true,
                label: post.location || 'Multiple venues',
              },
              {
                id: 'availability',
                icon: CircleDot,
                label: statusLabel,
              },
              {
                id: 'linked-products',
                icon: ShoppingBag,
                label: `${linkedProducts.length || 0} Linked Products`,
              },
              {
                id: 'banners',
                icon: Images,
                label: `${bannerImages.length} Banner${bannerImages.length === 1 ? '' : 's'}`,
              },
              {
                id: 'published',
                icon: CalendarDays,
                label: `Published ${post.publishedAt}`,
              },
              ...(dateLabel
                ? [
                    {
                      id: 'event-dates',
                      icon: CalendarDays,
                      wide: true,
                      label: dateLabel,
                    },
                  ]
                : []),
            ]}
            actions={
              <>
                {post.ctaLabel && post.ctaUrl && (
                  <Link
                    to={post.ctaUrl}
                    className={detailHeroSummaryActionPrimaryClass}
                  >
                    {post.ctaLabel}
                    <ExternalLink size={13} />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => toast.success('Event saved to your dashboard!')}
                  className={detailHeroSummaryActionSecondaryClass}
                >
                  <Bookmark size={13} className="text-[#E8500A]" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Share link copied to clipboard!');
                  }}
                  className={detailHeroSummaryActionSecondaryClass}
                >
                  <Share2 size={13} />
                  Share
                </button>
              </>
            }
          />
        </div>
      </section>

      <StickySectionNav
        sections={sectionNavItems}
        activeId={activeSectionId}
        onNavigate={scrollToSection}
        allLabel="Event"
        allId="all"
        profileLabel="Event sections"
      />

      <main id="all-section" className="bg-[#F4F7F9] py-5 scroll-mt-36">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 w-full">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#E8500A] mb-6"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div className={DETAIL_SINGLE_FEED}>
            <StudioWrap sectionId="event-about" className="scroll-mt-36 w-full">
              <div className="mb-4 text-left">
                <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-0.5">
                  Event Details
                </h2>
                <p className="text-[12px] font-semibold text-[#9AA0AC]">
                  Official brand announcement and event information
                </p>
              </div>

              <article className="bg-white rounded-[5px] border border-[#e8edf2] shadow-sm overflow-hidden w-full">
                <div className="p-6 sm:p-10 space-y-6 text-left">
                  <Link
                    to={`/brands/${post.brandId}`}
                    className="inline-flex items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1A1D4E] text-white flex items-center justify-center text-xs font-black">
                      {post.brandLogo || post.brandName.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">Verified brand partner</p>
                      <p className="text-base font-bold text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors">
                        {post.brandName}
                      </p>
                    </div>
                  </Link>

                  {post.location && (
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                      <MapPin size={15} className="text-[#E8500A]" />
                      {post.location}
                    </div>
                  )}

                  <div className="space-y-5 max-w-4xl">
                    {post.body.map((paragraph, i) => (
                      <p key={i} className="text-sm md:text-[15px] text-gray-600 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="rounded-[5px] bg-[#FFF8F5] border border-[#E8500A]/15 p-5 flex items-start gap-3 max-w-4xl">
                    <Sparkles size={18} className="text-[#E8500A] shrink-0 mt-0.5" />
                    <p className="text-[12px] text-gray-600 leading-relaxed">
                      This is a <strong>sponsored brand awareness post</strong>, not an editorial buying guide.
                      Offers and availability are confirmed directly with {post.brandName}.
                    </p>
                  </div>
                </div>
              </article>
            </StudioWrap>

            {linkedProducts.length > 0 && (
              <StudioWrap sectionId="related-products" className="scroll-mt-36 w-full">
                <div className="mb-4 text-left">
                  <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-0.5">
                    Related Products
                  </h2>
                  <p className="text-[12px] font-semibold text-[#9AA0AC]">
                    Items linked to this event from {post.brandName}
                  </p>
                </div>
                <div className={DETAIL_FEED_GRID_5}>
                  {linkedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} variant="grid" isGuideDetail />
                  ))}
                </div>
              </StudioWrap>
            )}

            {relatedPosts.length > 0 && (
              <StudioWrap sectionId="more-events" className="scroll-mt-36 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 text-left">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-0.5">
                      More from {post.brandName}
                    </h2>
                    <p className="text-[12px] font-semibold text-[#9AA0AC]">
                      Other upcoming events and announcements
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="text-[10px] font-black uppercase text-[#E8500A] hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    Browse products <ChevronRight size={12} />
                  </Link>
                </div>
                <div className={WHATS_ON_CARD_GRID}>
                  {relatedPosts.map((related) => (
                    <BrandPostCard key={related.id} post={related} />
                  ))}
                </div>
              </StudioWrap>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
