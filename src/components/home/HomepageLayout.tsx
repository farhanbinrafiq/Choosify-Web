import React from 'react';
import { cn } from '../../lib/utils';

interface HomepageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Choosify homepage shell — platform feed canvas (#F0F8FF) */
export function HomepageLayout({ children, className }: HomepageLayoutProps) {
  return (
    <div
      className={cn('min-h-screen antialiased font-sans overflow-x-clip bg-choosify-feed', className)}
      style={{ color: '#1A1A2E' }}
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
