import React from 'react';
import { UniversalSection } from '../../design/UniversalSection';
import type { HomeSectionTone } from '../../../lib/design/homeTokens';

interface HomeSectionShellProps {
  id?: string;
  sectionId?: string;
  children: React.ReactNode;
  tone?: HomeSectionTone;
  className?: string;
  innerClassName?: string;
  /** @deprecated Use tone instead */
  variant?: 'large' | 'compact' | 'accent';
}

const VARIANT_TO_TONE: Record<NonNullable<HomeSectionShellProps['variant']>, HomeSectionTone> = {
  large: 'white',
  compact: 'soft-gray',
  accent: 'dark-band',
};

export function HomeSectionShell({
  id,
  sectionId,
  children,
  tone,
  variant = 'large',
  className,
  innerClassName,
}: HomeSectionShellProps) {
  const resolvedTone = tone ?? VARIANT_TO_TONE[variant];

  return (
    <UniversalSection
      id={id}
      sectionId={sectionId}
      tone={resolvedTone}
      className={className}
      innerClassName={innerClassName}
    >
      {children}
    </UniversalSection>
  );
}
