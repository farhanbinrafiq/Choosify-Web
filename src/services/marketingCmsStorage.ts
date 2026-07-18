import type {
  CmsCalendarEvent,
  CmsContentStatus,
  CmsContentTypeId,
  MarketingContentRecord,
  SponsoredCampaignRecord,
} from '../types/marketing/cms';
import { getCmsContentType } from '../lib/marketing/cmsContentTypeRegistry';

const CONTENT_KEY = 'choosify_marketing_content';
const SPONSORED_KEY = 'choosify_sponsored_campaigns';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function generateContentId(): string {
  return `cms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateSponsoredCampaignId(): string {
  return `spn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function slugifyContentTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Spotlight Content ──────────────────────────────────────────────────────

export function listMarketingContent(): MarketingContentRecord[] {
  return readJson<MarketingContentRecord[]>(CONTENT_KEY, []);
}

export function getMarketingContentById(contentId: string): MarketingContentRecord | undefined {
  return listMarketingContent().find((c) => c.contentId === contentId);
}

export function upsertMarketingContent(record: MarketingContentRecord): MarketingContentRecord {
  const items = listMarketingContent();
  const idx = items.findIndex((c) => c.contentId === record.contentId);
  const next = { ...record, updatedAt: new Date().toISOString() };
  if (idx === -1) items.push(next);
  else items[idx] = next;
  writeJson(CONTENT_KEY, items);
  return next;
}

export function deleteMarketingContent(contentId: string) {
  writeJson(CONTENT_KEY, listMarketingContent().filter((c) => c.contentId !== contentId));
}

export function createEmptyContent(
  contentType: CmsContentTypeId,
  userId: string,
  title = 'Untitled',
): MarketingContentRecord {
  const typeDef = getCmsContentType(contentType);
  const now = new Date().toISOString();
  return {
    contentId: generateContentId(),
    title,
    slug: slugifyContentTitle(title),
    contentType,
    status: 'draft',
    headline: title,
    summary: '',
    pageSections: typeDef?.defaultSections ?? [],
    associations: [],
    mediaIds: [],
    tags: [],
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  };
}

export function filterMarketingContent(opts: {
  contentType?: CmsContentTypeId | CmsContentTypeId[];
  status?: CmsContentStatus | 'all';
  query?: string;
}): MarketingContentRecord[] {
  let items = listMarketingContent();
  if (opts.contentType) {
    const types = Array.isArray(opts.contentType) ? opts.contentType : [opts.contentType];
    items = items.filter((c) => types.includes(c.contentType));
  }
  if (opts.status && opts.status !== 'all') {
    items = items.filter((c) => c.status === opts.status);
  }
  if (opts.query?.trim()) {
    const q = opts.query.trim().toLowerCase();
    items = items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

// ── Sponsored Campaigns ────────────────────────────────────────────────────

export function listSponsoredCampaigns(): SponsoredCampaignRecord[] {
  return readJson<SponsoredCampaignRecord[]>(SPONSORED_KEY, []);
}

export function getSponsoredCampaignById(campaignId: string): SponsoredCampaignRecord | undefined {
  return listSponsoredCampaigns().find((c) => c.campaignId === campaignId);
}

export function upsertSponsoredCampaign(record: SponsoredCampaignRecord): SponsoredCampaignRecord {
  const items = listSponsoredCampaigns();
  const idx = items.findIndex((c) => c.campaignId === record.campaignId);
  const next = { ...record, updatedAt: new Date().toISOString() };
  if (idx === -1) items.push(next);
  else items[idx] = next;
  writeJson(SPONSORED_KEY, items);
  return next;
}

export function deleteSponsoredCampaign(campaignId: string) {
  writeJson(SPONSORED_KEY, listSponsoredCampaigns().filter((c) => c.campaignId !== campaignId));
}

export function createEmptySponsoredCampaign(userId: string, name = 'New Campaign'): SponsoredCampaignRecord {
  const now = new Date().toISOString();
  const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return {
    campaignId: generateSponsoredCampaignId(),
    name,
    campaignType: 'product',
    placements: ['spotlight'],
    priority: 50,
    startDate: now,
    endDate: end,
    cta: { label: 'Shop Now', url: '/' },
    productIds: [],
    serviceIds: [],
    categoryIds: [],
    collectionIds: [],
    status: 'draft',
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  };
}

// ── Calendar (mock aggregation) ────────────────────────────────────────────

export function listCalendarEvents(): CmsCalendarEvent[] {
  const contentEvents: CmsCalendarEvent[] = listMarketingContent()
    .filter((c) => c.schedule?.startAt || c.status !== 'draft')
    .map((c) => ({
      eventId: `evt-content-${c.contentId}`,
      title: c.title,
      date: c.schedule?.startAt ?? c.updatedAt,
      status: c.status,
      kind: 'content' as const,
      refId: c.contentId,
    }));

  const sponsoredEvents: CmsCalendarEvent[] = listSponsoredCampaigns().map((c) => ({
    eventId: `evt-spn-${c.campaignId}`,
    title: c.name,
    date: c.startDate,
    status: c.status === 'active' ? 'published' : c.status === 'draft' ? 'draft' : c.status === 'expired' ? 'expired' : 'scheduled',
    kind: 'sponsored' as const,
    refId: c.campaignId,
  }));

  return [...contentEvents, ...sponsoredEvents].sort((a, b) => a.date.localeCompare(b.date));
}
