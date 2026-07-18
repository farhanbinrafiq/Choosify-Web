import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { colors } from '../../design-system/tokens/colors';
import type { HeroAction } from './types';

interface HeroActionsProps {
  primary?: HeroAction;
  secondary?: HeroAction;
  className?: string;
}

function normalizeHref(href: string) {
  return href.startsWith('/') ? href : `/${href}`;
}

export function HeroActions({ primary, secondary, className }: HeroActionsProps) {
  if (!primary && !secondary) return null;

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {primary && (
        <Link
          to={normalizeHref(primary.href)}
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-white text-xs font-black uppercase tracking-wider transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{ backgroundColor: colors.brand.orange.legacy }}
        >
          {primary.label}
        </Link>
      )}
      {secondary && (
        <Link
          to={normalizeHref(secondary.href)}
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 border-white/40 hover:border-white/70 text-white text-xs font-black uppercase tracking-wider transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
