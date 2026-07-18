import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Plane,
  Stethoscope,
  GraduationCap,
  Sparkles,
  Building2,
  Car,
  Hotel,
} from 'lucide-react';
import { DcHomeBlock } from '../DcHomePanel';

const DEFAULT_SERVICES = [
  { id: 'hotels', label: 'Hotels', letter: 'H', href: '/whats-on?type=hotel', bg: '#E8F0FF', fg: '#2323FF', icon: Hotel },
  { id: 'restaurants', label: 'Restaurants', letter: 'R', href: '/whats-on?type=restaurant', bg: '#FFE8DC', fg: '#FF5B00', icon: Utensils },
  { id: 'travel', label: 'Travel', letter: 'T', href: '/whats-on?type=travel', bg: '#F0E8FF', fg: '#7C3AED', icon: Plane },
  { id: 'doctors', label: 'Doctors', letter: 'D', href: '/whats-on?type=health', bg: '#E8FFF0', fg: '#07A828', icon: Stethoscope },
  { id: 'education', label: 'Education', letter: 'E', href: '/whats-on?type=education', bg: '#E8F8FF', fg: '#0EA5E9', icon: GraduationCap },
  { id: 'beauty', label: 'Beauty', letter: 'B', href: '/whats-on?type=beauty', bg: '#FFE8F0', fg: '#EC4899', icon: Sparkles },
  { id: 'real-estate', label: 'Real Estate', letter: 'R', href: '/whats-on?type=property', bg: '#FFF8E8', fg: '#D97706', icon: Building2 },
  { id: 'transport', label: 'Transport', letter: 'T', href: '/whats-on?type=transport', bg: '#EDE8FF', fg: '#4F46E5', icon: Car },
];

interface HomePopularServicesSectionProps {
  services?: { id: string; label: string; href: string }[];
}

/** Choosify.dc.html — 8-col service tiles with letter chips */
export function HomePopularServicesSection({ services }: HomePopularServicesSectionProps) {
  const items = services?.length
    ? services.map((s) => {
        const def = DEFAULT_SERVICES.find((d) => d.id === s.id) ?? DEFAULT_SERVICES[0]!;
        return { ...def, ...s };
      })
    : DEFAULT_SERVICES;

  return (
    <DcHomeBlock id="section-services">
      <h2 id="section-services-heading" className="text-[19px] font-extrabold text-[#1A1A2E] mb-4">
        Popular Services
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-2">
        {items.map(({ id, label, letter, href, bg, fg, icon: Icon }) => (
          <Link
            key={id}
            to={href}
            className="bg-white border border-[#E8EDF2] rounded-[10px] px-2 py-[18px] flex flex-col items-center gap-2 hover:border-[#FF5B00]/35 transition-colors"
          >
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-extrabold"
              style={{ backgroundColor: bg, color: fg }}
            >
              <Icon size={14} aria-hidden />
              <span className="sr-only">{letter}</span>
            </div>
            <div className="text-[11px] font-semibold text-[#1A1A2E] text-center line-clamp-2">
              {label}
            </div>
          </Link>
        ))}
      </div>
    </DcHomeBlock>
  );
}
