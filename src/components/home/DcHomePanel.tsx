import React from 'react';
import { cn } from '../../lib/utils';
import { HOME_CONTENT_MAX, HOME_PANEL, HOME_PANEL_GAP } from '../../lib/design/homeTokens';

interface DcHomePanelProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** Pull up over hero (Top Categories in dc.html) */
  overlapHero?: boolean;
  /** Extra top margin between panels */
  spaced?: boolean;
}

/** Elevated white card matching Choosify.dc.html Home panels */
export function DcHomePanel({
  children,
  id,
  className,
  overlapHero = false,
  spaced = true,
}: DcHomePanelProps) {
  return (
    <div
      id={id}
      className={cn(
        HOME_CONTENT_MAX,
        'relative z-[3]',
        overlapHero ? 'mt-[-70px]' : spaced ? HOME_PANEL_GAP : undefined,
        className,
      )}
    >
      <div className={HOME_PANEL}>{children}</div>
    </div>
  );
}

interface DcHomeBlockProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/** Non-card block on #F4F7F9 (deals, guides, brands… in dc.html) */
export function DcHomeBlock({ children, id, className }: DcHomeBlockProps) {
  return (
    <div id={id} className={cn(HOME_CONTENT_MAX, 'relative z-[3] mt-6 pb-2', className)}>
      {children}
    </div>
  );
}
