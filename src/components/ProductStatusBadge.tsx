import React from 'react';
import { Flame, Sparkles, Star, Tag, Ticket, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import type { SiteProductBadge } from '../types/catalog';

export type ProductBadgeTone = 'hot' | 'new' | 'featured' | 'sale' | 'event' | 'promo' | 'default';

const TONE_STYLES: Record<ProductBadgeTone, string> = {
  hot: 'bg-gradient-to-r from-[#EB4501] to-[#CF4400] text-white border-[#FF8A4C]/40 shadow-[0_2px_8px_rgba(235, 69, 1,0.35)]',
  new: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-300/40 shadow-[0_2px_8px_rgba(16,185,129,0.28)]',
  featured: 'bg-gradient-to-r from-[#1A1D4E] to-[#2d3278] text-white border-[#4b55c4]/35 shadow-[0_2px_8px_rgba(26,29,78,0.28)]',
  sale: 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-rose-300/40 shadow-[0_2px_8px_rgba(225,29,72,0.28)]',
  event: 'bg-gradient-to-r from-violet-600 to-purple-500 text-white border-violet-300/40 shadow-[0_2px_8px_rgba(124,58,237,0.28)]',
  promo: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-200/50 shadow-[0_2px_8px_rgba(245,158,11,0.28)]',
  default: 'bg-gradient-to-r from-[#EB4501] to-[#CF4400] text-white border-orange-200/40 shadow-[0_2px_8px_rgba(235, 69, 1,0.25)]',
};

function resolveTone(label: string): ProductBadgeTone {
  const normalized = label.replace(/[^\w\s%]/g, ' ').trim().toUpperCase();

  if (/\b(HOT|VIRAL|TRENDING|FLASH)\b/.test(normalized)) return 'hot';
  if (/\b(NEW|ARRIVAL)\b/.test(normalized)) return 'new';
  if (/\b(FEATURED|EDITOR|STAFF|PICK)\b/.test(normalized)) return 'featured';
  if (/\b(SALE|DEAL|OFFER|MEGA|LIMITED|EXCLUSIVE|%)\b/.test(normalized)) return 'sale';
  if (/\b(EVENT|LAUNCH|FESTIVAL)\b/.test(normalized)) return 'event';
  if (/\b(PROMO|COUPON|CODE)\b/.test(normalized)) return 'promo';
  return 'default';
}

function BadgeIcon({ tone }: { tone: ProductBadgeTone }) {
  const className = 'w-3 h-3 shrink-0';
  switch (tone) {
    case 'hot':
      return <Flame className={className} />;
    case 'new':
      return <Zap className={className} />;
    case 'featured':
      return <Star className={className} />;
    case 'sale':
      return <Tag className={className} />;
    case 'event':
      return <Sparkles className={className} />;
    case 'promo':
      return <Ticket className={className} />;
    default:
      return <Tag className={className} />;
  }
}

function formatBadgeLabel(label: string) {
  const cleaned = label.replace(/[^\w\s%]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'HOT';
  if (cleaned.length <= 14) return cleaned.toUpperCase();
  return cleaned.slice(0, 14).toUpperCase();
}

export function ProductStatusBadge({
  label,
  className,
  size = 'md',
}: {
  label: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const tone = resolveTone(label);
  const sizeClass =
    size === 'sm'
      ? 'text-[9px] px-2 py-0.5 gap-1'
      : 'text-[10px] px-2.5 py-1 gap-1.5';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-black uppercase tracking-wider border leading-none whitespace-nowrap',
        sizeClass,
        TONE_STYLES[tone],
        className,
      )}
    >
      <BadgeIcon tone={tone} />
      <span>{formatBadgeLabel(label)}</span>
    </span>
  );
}

export function ProductStatusBadgeStack({
  labels,
  className,
  align = 'start',
  size = 'md',
}: {
  labels: string[];
  className?: string;
  align?: 'start' | 'end';
  size?: 'sm' | 'md';
}) {
  const unique = Array.from(new Set(labels.map((label) => formatBadgeLabel(label)))).slice(0, 2);
  if (!unique.length) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 z-20 pointer-events-none',
        align === 'end' ? 'items-end' : 'items-start',
        className,
      )}
    >
      {unique.map((label) => (
        <ProductStatusBadge key={label} label={label} size={size} />
      ))}
    </div>
  );
}

export function cmsBadgeToLabel(badge: SiteProductBadge) {
  return badge.label;
}

export function collectProductBadgeLabels(
  product: Record<string, unknown>,
  cmsBadges: SiteProductBadge[] = [],
): string[] {
  const labels: string[] = [];

  cmsBadges.forEach((badge) => labels.push(badge.label));

  if (typeof product.tag === 'string' && product.tag.trim()) {
    labels.push(product.tag);
  }

  if (product.isNewArrival) labels.push('NEW');
  if (product.featuredFlag) labels.push('FEATURED');
  if (product.isDeal || product.dealType) labels.push('SALE');
  if (product.isBestseller) labels.push('HOT');

  return labels;
}
