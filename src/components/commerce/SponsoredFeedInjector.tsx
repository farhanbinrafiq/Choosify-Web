import React from 'react';
import { cn } from '../../lib/utils';
import {
  useSponsoredFeedEntries,
  type SponsoredFeedEntry,
} from '../../hooks/useSponsoredFeedEntries';
import type { SponsoredPlacementSurface } from '../../types/commerce/sponsoredPlacement';
import { ChoosifySponsoredCard } from './ChoosifySponsoredCard';

export interface SponsoredFeedInjectorProps<T> {
  surface: SponsoredPlacementSurface;
  items: T[];
  getItemKey: (item: T, index: number) => string;
  renderItem?: (item: T) => React.ReactNode;
  frequency?: number;
  maxPlacements?: number;
  enabled?: boolean;
  className?: string;
  /** Optional: expose entries for custom layout (e.g. fragments with expanded panels) */
  children?: (entries: SponsoredFeedEntry<T>[]) => React.ReactNode;
}

/**
 * LE-006.3 — Reusable feed wrapper that injects sponsored cards at configured intervals.
 */
export function SponsoredFeedInjector<T>({
  surface,
  items,
  getItemKey,
  renderItem,
  frequency,
  maxPlacements,
  enabled = true,
  className,
  children,
}: SponsoredFeedInjectorProps<T>) {
  const entries = useSponsoredFeedEntries(surface, items, getItemKey, {
    frequency,
    maxPlacements,
    enabled,
  });

  if (children) {
    return <>{children(entries)}</>;
  }

  return (
    <div className={cn(className)}>
      {entries.map((entry) =>
        entry.kind === 'sponsored' ? (
          <ChoosifySponsoredCard key={entry.key} item={entry.sponsored} />
        ) : (
          <React.Fragment key={entry.key}>{renderItem?.(entry.item)}</React.Fragment>
        ),
      )}
    </div>
  );
}
