import React from 'react';
import {
  Baby,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Car,
  Cpu,
  Download,
  Dumbbell,
  Factory,
  Gamepad2,
  Gavel,
  Gem,
  HeartHandshake,
  HeartPulse,
  Home,
  Key,
  Landmark,
  Monitor,
  Package,
  PartyPopper,
  PawPrint,
  Plane,
  Recycle,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Tv,
  Utensils,
  Wrench,
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Baby,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Car,
  Cpu,
  Download,
  Dumbbell,
  Factory,
  Gamepad2,
  Gavel,
  Gem,
  HeartHandshake,
  HeartPulse,
  Home,
  Key,
  Landmark,
  Monitor,
  Package,
  PartyPopper,
  PawPrint,
  Plane,
  Recycle,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Tv,
  Utensils,
  Wrench,
};

export function getCategoryIconComponent(catName: string, iconName: string) {
  const IconComponent = CATEGORY_ICON_MAP[iconName] || Package;
  const name = catName.toLowerCase();

  let colorClass = 'text-gray-500';
  if (name.includes('fashion')) colorClass = 'text-blue-600';
  else if (name.includes('tech') || name.includes('electronics')) colorClass = 'text-[#1A73E8]';
  else if (name.includes('family') || name.includes('kids') || name.includes('baby')) colorClass = 'text-blue-500';
  else if (name.includes('jewelry') || name.includes('accessories')) colorClass = 'text-yellow-500';
  else if (name.includes('hobby') || name.includes('creativity') || name.includes('hobbies') || name.includes('gaming')) colorClass = 'text-orange-500';
  else if (name.includes('travel') || name.includes('hospitality')) colorClass = 'text-rose-500';
  else if (name.includes('beauty') || name.includes('personal care')) colorClass = 'text-pink-500';
  else if (name.includes('mobile') || name.includes('phone')) colorClass = 'text-indigo-600';
  else if (name.includes('food')) colorClass = 'text-red-500';
  else if (name.includes('home') || name.includes('living')) colorClass = 'text-emerald-600';
  else if (name.includes('sport')) colorClass = 'text-green-600';
  else if (name.includes('appliance') || name.includes('tv')) colorClass = 'text-violet-600';

  return <IconComponent className={`w-5 h-5 ${colorClass}`} />;
}
