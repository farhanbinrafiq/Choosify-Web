import type { HomepageConfig } from '../../types/catalog';
import type { SiteConfig } from '../../types/catalog';

export type LivePulseTone = 'live' | 'sale' | 'guide' | 'review' | 'campaign' | 'offer';

export interface HomeLivePulseItem {
  id: string;
  label: string;
  href: string;
  tone: LivePulseTone;
}

const TONE_DOT: Record<LivePulseTone, string> = {
  live: 'bg-red-500',
  sale: 'bg-[#E8500A]',
  guide: 'bg-emerald-500',
  review: 'bg-blue-500',
  campaign: 'bg-violet-500',
  offer: 'bg-amber-400',
};

export function livePulseDotClass(tone: LivePulseTone): string {
  return TONE_DOT[tone];
}

const DEFAULT_PULSE: HomeLivePulseItem[] = [
  { id: 'pulse-live', label: 'Samsung Live Launch', href: '/spotlight?tab=live', tone: 'live' },
  { id: 'pulse-sale', label: 'Bata Flash Sale', href: '/deals', tone: 'sale' },
  { id: 'pulse-guide', label: 'New Buying Guide', href: '/guides', tone: 'guide' },
  { id: 'pulse-review', label: 'Creator Review Published', href: '/spotlight?tab=reviews', tone: 'review' },
  { id: 'pulse-campaign', label: 'Trending Brand Campaign', href: '/spotlight?tab=campaigns', tone: 'campaign' },
  { id: 'pulse-offer', label: 'Hotel Weekend Offer', href: '/whats-on', tone: 'offer' },
];

/** CMS-first live pulse — falls back to editorial defaults */
export function getHomeLivePulseItems(
  homepageConfig: HomepageConfig | null,
  siteConfig: SiteConfig | null,
): HomeLivePulseItem[] {
  const section = homepageConfig?.sections?.find((s) => s.id === 'whats-happening');
  if (section?.itemIds?.length) {
    return section.itemIds.map((id, index) => {
      const fallback = DEFAULT_PULSE[index % DEFAULT_PULSE.length];
      return { ...fallback, id, label: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
    });
  }

  const tickerItems = (siteConfig?.heroTickers ?? [])
    .filter((t) => t.pageKey === 'home' && t.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 8);

  if (tickerItems.length) {
    return tickerItems.map((t, i) => ({
      id: t.id,
      label: t.segments.map((s) => s.text).join(' '),
      href: '/spotlight',
      tone: DEFAULT_PULSE[i % DEFAULT_PULSE.length].tone,
    }));
  }

  return DEFAULT_PULSE;
}
