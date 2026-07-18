import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { HomepageSpotlightCardModel } from '../../../types/spotlight/homepage';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { cn } from '../../../lib/utils';
import { HOME_CARD_HOVER } from '../../../lib/design/homeTokens';
import { resolvePreviewImage } from '../../../components/media/types/mediaModel';
import { PLACEHOLDER_IMAGE } from '../../../constants';

type EditorialBadge = {
  label: string;
  className: string;
};

function resolveEditorialBadge(card: HomepageSpotlightCardModel): EditorialBadge {
  const type = card.campaign.campaignType;
  if (type === 'festival_campaign' || card.badges.includes('limited_time')) {
    return { label: 'LIVE', className: 'bg-red-500 text-white' };
  }
  if (type === 'creator_review' || type === 'single_product') {
    return { label: 'REEL', className: 'bg-amber-400 text-[#1A1D4E]' };
  }
  if (type === 'buying_guide') {
    return { label: 'GUIDE', className: 'bg-sky-500 text-white' };
  }
  if (type === 'brand_story' || type === 'brand_campaign') {
    return { label: 'BRAND STORY', className: 'bg-violet-500 text-white' };
  }
  if (['promotion', 'discount', 'festival_campaign'].includes(type)) {
    return { label: 'CAMPAIGN', className: 'bg-[#E8500A] text-white' };
  }
  if (type === 'multi_product') {
    return { label: 'CAROUSEL', className: 'bg-blue-500 text-white' };
  }
  if (card.badges.includes('sponsored')) {
    return { label: 'SPONSORED', className: 'bg-purple-500 text-white' };
  }
  return { label: 'FEATURED', className: 'bg-[#1A1D4E] text-white' };
}

function resolveImage(card: HomepageSpotlightCardModel): string {
  if (card.media) {
    const preview = resolvePreviewImage(card.media);
    if (preview) return preview;
  }
  return card.primaryProduct?.image ?? card.brandLogoUrl ?? PLACEHOLDER_IMAGE;
}

function resolveHref(card: HomepageSpotlightCardModel): string {
  const url = card.campaign.cta?.url;
  if (url) return url.startsWith('/') ? url : `/${url}`;
  return `/spotlight/${card.campaign.campaignId}`;
}

function resolveSource(card: HomepageSpotlightCardModel): { name: string; avatar?: string } {
  const brand = card.campaign.brandName ?? card.primaryProduct?.brandName ?? 'Choosify Spotlight';
  return {
    name: brand,
    avatar: card.brandLogoUrl,
  };
}

interface HomeSpotlightEditorialCardProps {
  card: HomepageSpotlightCardModel;
  variant?: 'standard' | 'wide';
  impressionCallbacks?: SpotlightImpressionCallbacks;
  className?: string;
}

export function HomeSpotlightEditorialCard({
  card,
  variant = 'standard',
  className,
}: HomeSpotlightEditorialCardProps) {
  const badge = useMemo(() => resolveEditorialBadge(card), [card]);
  const image = resolveImage(card);
  const href = resolveHref(card);
  const source = resolveSource(card);
  const title = card.campaign.headline ?? card.campaign.campaignName ?? 'Spotlight';

  return (
    <Link
      to={href}
      className={cn(
        'group relative block overflow-hidden rounded-2xl',
        variant === 'wide' ? 'aspect-[16/10]' : 'aspect-[3/4]',
        HOME_CARD_HOVER,
        className,
      )}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <span
        className={cn(
          'absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider',
          badge.className,
        )}
      >
        {badge.label}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:underline">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden shrink-0 border border-white/30">
            {source.avatar ? (
              <img src={source.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white">
                {source.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/80 font-medium truncate">{source.name}</span>
        </div>
      </div>
    </Link>
  );
}
