/**
 * Resolve ordered enabled optional sections for the Content Detail page.
 * Prefers content.sections; falls back to pageSections / contentType defaults.
 */

import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import type {
  ContentDetailOptionalSectionId,
  ContentDetailSectionConfig,
} from '../../../types/spotlight/experience/contentDetailSections';
import {
  CONTENT_DETAIL_OPTIONAL_SECTION_IDS,
  LEGACY_PAGE_SECTION_TO_OPTIONAL,
} from '../../../types/spotlight/experience/contentDetailSections';
import { defaultSectionsForContentType } from './sectionManifestRegistry';

const OPTIONAL_SET = new Set<string>(CONTENT_DETAIL_OPTIONAL_SECTION_IDS);

/** Default optional sections enabled per content type (add a row for new types). */
export const DEFAULT_OPTIONAL_SECTIONS_BY_TYPE: Partial<
  Record<SpotlightContentType, ContentDetailOptionalSectionId[]>
> = {
  buying_guide: [
    'winner',
    'why_it_won',
    'verdict',
    'takeaways',
    'items_mentioned',
    'brands_mentioned',
  ],
  product_review: [
    'winner',
    'why_it_won',
    'verdict',
    'takeaways',
    'items_mentioned',
    'how_review_was_made',
  ],
  creator_review: [
    'winner',
    'why_it_won',
    'verdict',
    'takeaways',
    'items_mentioned',
    'how_review_was_made',
  ],
  comparison: [
    'winner',
    'why_it_won',
    'verdict',
    'takeaways',
    'items_mentioned',
    'brands_mentioned',
  ],
  recommendation: ['winner', 'verdict', 'takeaways', 'items_mentioned'],
  tutorial: ['takeaways', 'items_mentioned'],
  tips: ['takeaways', 'items_mentioned'],
  editorial: ['takeaways', 'items_mentioned'],
  live: ['items_mentioned'],
  livestream_replay: ['items_mentioned'],
  brand_story: ['items_mentioned', 'brands_mentioned'],
  campaign: ['items_mentioned', 'brands_mentioned'],
  promotion: ['items_mentioned'],
  new_launch: ['items_mentioned', 'brands_mentioned'],
  announcement: ['items_mentioned'],
  event: ['items_mentioned'],
  whats_on: ['items_mentioned'],
};

function entriesFromIds(
  ids: ContentDetailOptionalSectionId[],
  enabled = true,
): ContentDetailSectionConfig[] {
  return ids.map((id, order) => ({ id, enabled, order }));
}

function fromLegacyPageSections(
  content: SpotlightContent,
): ContentDetailSectionConfig[] | null {
  const source =
    content.pageSections?.length
      ? content.pageSections
      : defaultSectionsForContentType(
          content.sourceKind === 'guide' ? 'buying_guide' : content.contentType,
        );

  const byOptional = new Map<ContentDetailOptionalSectionId, ContentDetailSectionConfig>();

  for (const entry of source) {
    const mapped = LEGACY_PAGE_SECTION_TO_OPTIONAL[entry.id];
    if (!mapped) continue;
    const existing = byOptional.get(mapped);
    if (existing) {
      existing.enabled = existing.enabled || entry.visible;
      continue;
    }
    byOptional.set(mapped, {
      id: mapped,
      enabled: entry.visible,
      order: entry.order ?? byOptional.size,
    });
  }

  if (byOptional.size === 0) return null;
  return [...byOptional.values()].sort((a, b) => a.order - b.order);
}

function defaultsForContent(content: SpotlightContent): ContentDetailSectionConfig[] {
  const ids =
    DEFAULT_OPTIONAL_SECTIONS_BY_TYPE[content.contentType] ??
    (['items_mentioned'] as ContentDetailOptionalSectionId[]);
  return entriesFromIds(ids);
}

/**
 * Ordered list of *enabled* optional sections for rendering.
 * Dedupes by id; preserves first occurrence order after sort by `order`.
 */
export function resolveContentDetailOptionalSections(
  content: SpotlightContent | null | undefined,
): ContentDetailSectionConfig[] {
  if (!content) {
    return entriesFromIds([
      'winner',
      'why_it_won',
      'verdict',
      'takeaways',
      'items_mentioned',
      'how_review_was_made',
    ]);
  }

  let raw: ContentDetailSectionConfig[];

  if (content.sections?.length) {
    raw = content.sections.filter((s) => OPTIONAL_SET.has(s.id));
  } else {
    raw = fromLegacyPageSections(content) ?? defaultsForContent(content);
  }

  const seen = new Set<ContentDetailOptionalSectionId>();
  return [...raw]
    .sort((a, b) => a.order - b.order)
    .filter((s) => {
      if (!s.enabled) return false;
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
}

/** Sticky nav items derived from enabled optional sections (+ fixed anchors). */
export function contentDetailNavFromSections(
  sections: ContentDetailSectionConfig[],
  opts?: { showProfile?: boolean; profileLabel?: string },
): { id: string; label: string }[] {
  const labelMap: Record<ContentDetailOptionalSectionId, string> = {
    winner: 'Winner',
    why_it_won: 'Why It Won',
    verdict: 'Verdict',
    takeaways: 'Takeaways',
    items_mentioned: 'Items',
    brands_mentioned: 'Brands',
    how_review_was_made: 'Method',
  };
  const navId: Record<ContentDetailOptionalSectionId, string> = {
    winner: 'winner',
    why_it_won: 'why-won',
    verdict: 'quick-verdict',
    takeaways: 'takeaways',
    items_mentioned: 'items-mentioned',
    brands_mentioned: 'brands-mentioned',
    how_review_was_made: 'how-review-was-made',
  };

  const items = sections.map((s) => ({
    id: navId[s.id],
    label: labelMap[s.id],
  }));

  items.unshift({ id: 'what-is-discussed', label: 'Discussed' });

  if (opts?.showProfile !== false) {
    items.push({
      id: 'reviewer-profile',
      label: opts?.profileLabel ?? 'Reviewer',
    });
  }

  return items;
}
