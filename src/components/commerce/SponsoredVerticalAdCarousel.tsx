import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { ResolvedPlacement } from '../../utils/resolvePlacementContent';
import { AdSlotCarousel } from './AdSlotCarousel';
import { SponsoredPlacementCard, type SponsoredPlacementVariant } from '../SponsoredPlacementCard';

/** Fallback vertical ads when CMS returns fewer than 2 portrait placements */
export const DEMO_VERTICAL_SPONSORED_PLACEMENTS: ResolvedPlacement[] = [
  {
    id: 'vert-demo-1',
    placementId: 'vert-demo-1',
    title: 'Promote your brand here',
    subtitle: 'Reach 2M+ shoppers',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=750&fit=crop',
    href: '/advertise',
    ctaLabel: 'Advertise Here',
    isExternal: false,
    entityType: 'brand',
  },
  {
    id: 'vert-demo-2',
    placementId: 'vert-demo-2',
    title: 'Featured deal spotlight',
    subtitle: 'Limited-time offer',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=750&fit=crop',
    href: '/deals',
    ctaLabel: 'View Deals',
    isExternal: false,
    entityType: 'deal',
  },
  {
    id: 'vert-demo-3',
    placementId: 'vert-demo-3',
    title: 'Launch your product',
    subtitle: 'Sponsored placement',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=750&fit=crop',
    href: '/advertise',
    ctaLabel: 'Get Started',
    isExternal: false,
    entityType: 'product',
  },
];

/** Dashed “advertise here” portrait unit — matches prior DealsVerticalSponsoredCard size */
export function VerticalAdvertisePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#FFF6EF] rounded-[10px] overflow-hidden border-[1.5px] border-dashed border-[#EB4501] relative flex flex-col min-h-[320px]',
        className,
      )}
    >
      <div className="absolute top-2 left-2 bg-[#1A1A2E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm z-[1]">
        SPONSORED
      </div>
      <div className="h-[160px] bg-gradient-to-br from-[#EB4501] to-[#2323FF] flex items-end justify-center pb-3">
        <span className="text-white text-[12px] font-extrabold text-center px-3">
          PROMOTE YOUR DEAL
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-bold text-[#9AA0AC] tracking-wide mb-1">ADVERTISEMENT</div>
        <div className="text-[13px] font-semibold text-[#1A1A2E] mb-3 leading-snug">
          Reach 2M+ shoppers with a featured deal slot
        </div>
        <Link
          to="/advertise"
          className="mt-auto w-full bg-[#EB4501] text-white text-center border-none py-2.5 rounded-md text-[11.5px] font-extrabold hover:brightness-110 no-underline"
        >
          ADVERTISE HERE →
        </Link>
      </div>
    </div>
  );
}

/**
 * Portrait / vertical sponsored carousel — same card size, slides sideways (autoplay +
 * swipe), with a brand-logo pagination row underneath.
 */
export function SponsoredVerticalAdCarousel({
  placements,
  variant = 'portrait',
  description,
  className,
  autoplay = true,
  autoplayMs = 5000,
  withDemoFallback = true,
  includeAdvertisePlaceholder = false,
}: {
  placements?: ResolvedPlacement[];
  variant?: SponsoredPlacementVariant;
  description?: string;
  className?: string;
  autoplay?: boolean;
  autoplayMs?: number;
  withDemoFallback?: boolean;
  /** Prepend the dashed advertise-here unit as first slide */
  includeAdvertisePlaceholder?: boolean;
}) {
  const slides = useMemo(() => {
    const fromCms = placements ?? [];
    let list = fromCms.length
      ? fromCms
      : withDemoFallback
        ? DEMO_VERTICAL_SPONSORED_PLACEMENTS
        : [];

    if (fromCms.length === 1 && withDemoFallback) {
      const rest = DEMO_VERTICAL_SPONSORED_PLACEMENTS.filter((d) => d.id !== fromCms[0].id);
      list = [fromCms[0], ...rest].slice(0, 4);
    }

    if (includeAdvertisePlaceholder) {
      // Sentinel — rendered as VerticalAdvertisePlaceholder
      const advertise: ResolvedPlacement = {
        id: 'advertise-placeholder',
        placementId: 'advertise-placeholder',
        title: 'ADVERTISE',
        image: '',
        href: '/advertise',
        ctaLabel: 'Advertise',
        isExternal: false,
        entityType: 'brand',
      };
      list = [advertise, ...list.filter((p) => p.id !== 'advertise-placeholder')];
    }

    return list;
  }, [placements, withDemoFallback, includeAdvertisePlaceholder]);

  if (!slides.length) return null;

  return (
    <AdSlotCarousel
      items={slides}
      getKey={(p) => p.id}
      axis="x"
      paginationPosition="below"
      autoplay={autoplay}
      autoplayMs={autoplayMs}
      className={className}
      ariaLabel="Sponsored vertical ads"
      getIcon={(placement) =>
        placement.id === 'advertise-placeholder'
          ? { label: 'Advertise' }
          : { label: placement.title, imageUrl: placement.image }
      }
      renderSlide={(placement) =>
        placement.id === 'advertise-placeholder' ? (
          <VerticalAdvertisePlaceholder />
        ) : (
          <SponsoredPlacementCard
            placement={placement}
            variant={variant}
            description={description}
          />
        )
      }
    />
  );
}
