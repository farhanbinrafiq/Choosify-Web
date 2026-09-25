import React, { useEffect, useState } from 'react';
import {
  Award,
  Banknote,
  BadgeCheck,
  CreditCard,
  Headphones,
  Heart,
  Lock,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { catalogApi } from '../../services/catalogApi';
import type { AssuranceIconKey, AssurancePlacementKey, AssuranceTone, StorefrontAssurance } from '../../types/catalog';

/** Approved icon registry (keys set in Admin → Storefront Curation → Trust & Assurance). */
const ICONS: Record<AssuranceIconKey, LucideIcon> = {
  'shield-check': ShieldCheck,
  'badge-check': BadgeCheck,
  lock: Lock,
  'credit-card': CreditCard,
  'rotate-ccw': RotateCcw,
  headphones: Headphones,
  banknote: Banknote,
  truck: Truck,
  award: Award,
  star: Star,
  users: Users,
  'refresh-cw': RefreshCw,
  sparkles: Sparkles,
  'thumbs-up': ThumbsUp,
  heart: Heart,
  search: Search,
};

const TONES: Record<AssuranceTone, string> = {
  blue: '#DBEAFE',
  orange: '#FFEDD5',
  green: '#DCFCE7',
  purple: '#F3E8FF',
  red: '#FEE2E2',
  slate: '#F1F5F9',
};

// One request per page load, shared by every strip on the page.
let cache: StorefrontAssurance | null = null;
let inflight: Promise<StorefrontAssurance | null> | null = null;
function loadAssurance(): Promise<StorefrontAssurance | null> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = catalogApi
      .getAssuranceStrips()
      .then((d) => (cache = d))
      .catch(() => null)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/**
 * CMS-managed Trust & Assurance strip. Content (title/description/icon/order/
 * enabled) comes from the backend placement; the visual treatment is the
 * placement's existing one. Renders nothing while loading, when disabled, or
 * when the placement has no enabled items — never an empty card.
 */
export function AssuranceStrip({ placement, className }: { placement: AssurancePlacementKey; className?: string }) {
  const [data, setData] = useState<StorefrontAssurance | null>(cache);
  useEffect(() => {
    let alive = true;
    if (!cache) void loadAssurance().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);

  const strip = data?.placements[placement];
  if (!strip || strip.items.length === 0) return null;

  if (strip.variant === 'text') {
    return (
      <div className={cn('flex justify-between bg-white border border-[#E8EDF2] rounded-[10px] px-6 py-[18px] flex-wrap gap-3.5', className)}>
        {strip.items.map((tp) => (
          <div key={tp.id} className="text-center max-w-[150px]">
            <div className="text-[11.5px] font-bold text-[#1A1A2E] mb-1">{tp.title}</div>
            <div className="text-[10px] text-[#9AA0AC]">{tp.description}</div>
          </div>
        ))}
      </div>
    );
  }

  if (strip.variant === 'icons') {
    return (
      <div
        className={cn('bg-white rounded-[10px] border border-[#E8EDF2] px-4 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 min-w-0', className)}
        aria-label="Choosify trust guarantees"
      >
        {strip.items.map((item) => {
          const Icon = ICONS[item.icon] ?? ShieldCheck;
          return (
            <div key={item.id} className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center shrink-0">
                <Icon size={15} aria-hidden />
              </div>
              <span className="text-[11.5px] font-bold text-[#1A1A2E] leading-snug break-words">{item.title}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn('bg-white rounded-xl border border-[#E8EDF2] px-5 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5', className)}
      aria-label="Choosify authentication guarantees"
    >
      {strip.items.map((tb) => {
        const Icon = ICONS[tb.icon] ?? ShieldCheck;
        return (
          <div key={tb.id} className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[#1A1A2E]"
              style={{ backgroundColor: TONES[tb.tone] ?? TONES.slate }}
              aria-hidden
            >
              <Icon size={15} />
            </div>
            <div className="min-w-0">
              <div className="text-[11.5px] font-bold text-[#1A1A2E] truncate">{tb.title}</div>
              <div className="text-[9.5px] text-[#9AA0AC] leading-snug">{tb.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
