import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Car,
  GraduationCap,
  Hotel,
  Plane,
  Sparkles,
  Stethoscope,
  Utensils,
} from 'lucide-react';

export type PopularServiceId =
  | 'hotels'
  | 'restaurants'
  | 'travel'
  | 'doctors'
  | 'education'
  | 'beauty'
  | 'real-estate'
  | 'transport';

export interface PopularServiceTile {
  id: PopularServiceId;
  label: string;
  letter: string;
  /** Product list URL — services surface as product cards */
  href: string;
  bg: string;
  fg: string;
  icon: LucideIcon;
}

/** Keywords used on /products?service=… to match product + service listings */
export const SERVICE_PRODUCT_KEYWORDS: Record<PopularServiceId, string[]> = {
  hotels: ['hotel', 'resort', 'hospitality', 'stay', 'suite'],
  restaurants: ['restaurant', 'dining', 'cafe', 'food', 'cuisine', 'eatery'],
  travel: ['travel', 'tour', 'flight', 'luggage', 'trip', 'hospitality'],
  doctors: ['doctor', 'clinic', 'health', 'medical', 'hospital', 'wellness'],
  education: ['education', 'course', 'learning', 'school', 'tuition', 'academic'],
  beauty: ['beauty', 'salon', 'skincare', 'cosmetic', 'spa', 'grooming'],
  'real-estate': ['real estate', 'property', 'apartment', 'flat', 'housing', 'rent'],
  transport: ['transport', 'ride', 'car', 'vehicle', 'bike', 'taxi', 'bus'],
};

export function productsHrefForService(id: PopularServiceId, label: string): string {
  const params = new URLSearchParams();
  params.set('service', id);
  params.set('q', label);
  return `/products?${params.toString()}`;
}

export const POPULAR_SERVICE_TILES: PopularServiceTile[] = [
  {
    id: 'hotels',
    label: 'Hotels',
    letter: 'H',
    href: productsHrefForService('hotels', 'Hotels'),
    bg: '#E8F0FF',
    fg: '#2323FF',
    icon: Hotel,
  },
  {
    id: 'restaurants',
    label: 'Restaurants',
    letter: 'R',
    href: productsHrefForService('restaurants', 'Restaurants'),
    bg: '#FFE8DC',
    fg: '#FF5B00',
    icon: Utensils,
  },
  {
    id: 'travel',
    label: 'Travel',
    letter: 'T',
    href: productsHrefForService('travel', 'Travel'),
    bg: '#F0E8FF',
    fg: '#7C3AED',
    icon: Plane,
  },
  {
    id: 'doctors',
    label: 'Doctors',
    letter: 'D',
    href: productsHrefForService('doctors', 'Doctors'),
    bg: '#E8FFF0',
    fg: '#07A828',
    icon: Stethoscope,
  },
  {
    id: 'education',
    label: 'Education',
    letter: 'E',
    href: productsHrefForService('education', 'Education'),
    bg: '#E8F8FF',
    fg: '#0EA5E9',
    icon: GraduationCap,
  },
  {
    id: 'beauty',
    label: 'Beauty',
    letter: 'B',
    href: productsHrefForService('beauty', 'Beauty'),
    bg: '#FFE8F0',
    fg: '#EC4899',
    icon: Sparkles,
  },
  {
    id: 'real-estate',
    label: 'Real Estate',
    letter: 'R',
    href: productsHrefForService('real-estate', 'Real Estate'),
    bg: '#FFF8E8',
    fg: '#D97706',
    icon: Building2,
  },
  {
    id: 'transport',
    label: 'Transport',
    letter: 'T',
    href: productsHrefForService('transport', 'Transport'),
    bg: '#EDE8FF',
    fg: '#4F46E5',
    icon: Car,
  },
];

export function resolveServiceKeywords(serviceId: string | null | undefined): string[] | null {
  if (!serviceId) return null;
  const keys = SERVICE_PRODUCT_KEYWORDS[serviceId as PopularServiceId];
  return keys?.length ? keys : null;
}
