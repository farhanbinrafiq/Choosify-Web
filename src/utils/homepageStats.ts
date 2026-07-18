import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Package, Flame, BookOpen, Users } from 'lucide-react';
import type { HeroStatItem } from '../components/hero/types';

export type HomepageStatsInput = {
  brands: unknown[];
  products: unknown[];
  deals: unknown[];
  guides: unknown[];
  creators: unknown[];
  homepageConfig?: {
    stats?: Partial<Record<'brands' | 'products' | 'deals' | 'guides' | 'creators', string | number>>;
  } | null;
};

function formatStatValue(value: number): string {
  if (value >= 1000) return `${Math.floor(value / 100) * 100}+`;
  return String(value);
}

function cmsStat(
  config: HomepageStatsInput['homepageConfig'],
  key: keyof NonNullable<NonNullable<HomepageStatsInput['homepageConfig']>['stats']>,
  fallback: number,
): string {
  const raw = config?.stats?.[key];
  if (raw != null && raw !== '') return String(raw);
  return formatStatValue(fallback);
}

export function buildHomepageHeroStats(input: HomepageStatsInput): HeroStatItem[] {
  const productCount = input.products.length || 2500;
  const brandCount = input.brands.length || 500;
  const dealCount = input.deals.length || Math.max(120, Math.floor(productCount * 0.05));
  const guideCount = input.guides.length || 300;
  const creatorCount = input.creators.length || 200;

  const defs: Array<{ id: string; label: string; icon: LucideIcon; fallback: number; cmsKey: 'brands' | 'products' | 'deals' | 'guides' | 'creators' }> = [
    { id: 'brands', label: 'Verified Brands', icon: BadgeCheck, fallback: brandCount, cmsKey: 'brands' },
    { id: 'products', label: 'Products', icon: Package, fallback: productCount, cmsKey: 'products' },
    { id: 'deals', label: 'Deals', icon: Flame, fallback: dealCount, cmsKey: 'deals' },
    { id: 'guides', label: 'Guides', icon: BookOpen, fallback: guideCount, cmsKey: 'guides' },
    { id: 'creators', label: 'Creators', icon: Users, fallback: creatorCount, cmsKey: 'creators' },
  ];

  return defs.map(({ id, label, icon, fallback, cmsKey }) => ({
    id,
    label,
    icon,
    value: cmsStat(input.homepageConfig, cmsKey, fallback),
  }));
}
