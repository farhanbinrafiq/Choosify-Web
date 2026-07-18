import React from 'react';
import { cn } from '../../lib/utils';
import { StudioWrap } from '../studio/StudioWrap';
import {
  HOME_CONTENT_MAX,
  HOME_SECTION_PY,
  HOME_SECTION_TONE_CLASS,
  type HomeSectionTone,
} from '../../lib/design/homeTokens';

interface UniversalSectionProps {
  id?: string;
  sectionId?: string;
  tone?: HomeSectionTone;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  fullBleed?: boolean;
}

export function UniversalSection({
  id,
  sectionId,
  tone = 'white',
  children,
  className,
  innerClassName,
  fullBleed = false,
}: UniversalSectionProps) {
  const body = (
    <section
      id={id}
      className={cn(HOME_SECTION_TONE_CLASS[tone], HOME_SECTION_PY, className)}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className={cn(!fullBleed && HOME_CONTENT_MAX, innerClassName)}>{children}</div>
    </section>
  );

  if (sectionId) {
    return <StudioWrap sectionId={sectionId}>{body}</StudioWrap>;
  }

  return body;
}
