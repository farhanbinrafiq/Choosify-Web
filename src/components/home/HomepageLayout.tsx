import React from 'react';
import { cn } from '../../lib/utils';
import { HOME_PAGE_BG } from '../../lib/design/homeTokens';

interface HomepageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Choosify.dc.html homepage shell — soft gray canvas */
export function HomepageLayout({ children, className }: HomepageLayoutProps) {
  return (
    <div
      className={cn('min-h-screen antialiased font-sans overflow-x-clip', className)}
      style={{ backgroundColor: HOME_PAGE_BG, color: '#1A1A2E' }}
    >
      {children}
    </div>
  );
}

interface HomepageSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function HomepageSection({ children, className, id }: HomepageSectionProps) {
  return (
    <section id={id} className={cn(className)}>
      {children}
    </section>
  );
}
