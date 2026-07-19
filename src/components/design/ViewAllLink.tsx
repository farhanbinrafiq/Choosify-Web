import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ViewAllLinkProps {
  href: string;
  label?: string;
  className?: string;
  light?: boolean;
}

export function ViewAllLink({ href, label = 'View All', className, light = false }: ViewAllLinkProps) {
  const hasArrow = /[›>]/.test(label);
  return (
    <Link
      to={href}
      className={cn(
        'inline-flex items-center gap-1 text-[12px] font-bold shrink-0 min-h-[44px] sm:min-h-0 transition-colors',
        light ? 'text-white/90 hover:text-white' : 'text-[#EB4501] hover:text-[#CF4400]',
        className,
      )}
    >
      {label}
      {!hasArrow && <ChevronRight size={14} aria-hidden />}
    </Link>
  );
}
