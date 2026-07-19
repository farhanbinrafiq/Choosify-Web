import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { colors } from '../../design-system/tokens/colors';
import { ViewAllLink } from '../design/ViewAllLink';

export interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  compact?: boolean;
  light?: boolean;
  id?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  viewAllHref,
  viewAllLabel = 'View All',
  action,
  icon: Icon,
  className,
  compact = false,
  light = false,
  id,
  centered = false,
}: SectionHeaderProps) {
  const bodyText = description ?? subtitle;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-end justify-between gap-3',
        compact ? 'mb-6' : 'mb-8 md:mb-10',
        centered && '!flex-col !items-center text-center [&>div]:text-center',
        className,
      )}
    >
      <div className={cn('text-left', centered && 'text-center')}>
        <div className={cn('flex items-center gap-2', centered && 'justify-center')}>
          {Icon && (
            <span
              className={cn(
                'inline-flex w-9 h-9 rounded-xl items-center justify-center shrink-0',
                light ? 'bg-white/15 text-[#FF8A50]' : 'bg-[#FFF0E8] text-[#EB4501]',
              )}
            >
              <Icon size={18} aria-hidden />
            </span>
          )}
          <h2
            id={id}
            className={cn(
              'font-semibold tracking-tight',
              light ? 'text-white' : `text-[${colors.text.heading}]`,
              compact ? 'text-base md:text-lg' : 'text-xl md:text-2xl lg:text-[1.65rem]',
            )}
            style={light ? undefined : { color: colors.text.heading }}
          >
            {title}
          </h2>
        </div>
        {bodyText && (
          <p
            className={cn(
              'mt-1.5 max-w-2xl',
              light ? 'text-white/65' : `text-[${colors.text.muted}]`,
              compact ? 'text-xs' : 'text-sm',
              centered && 'mx-auto',
            )}
            style={light ? undefined : { color: colors.text.muted }}
          >
            {bodyText}
          </p>
        )}
      </div>
      {action ?? (viewAllHref ? <ViewAllLink href={viewAllHref} label={viewAllLabel} light={light} /> : null)}
    </div>
  );
}
