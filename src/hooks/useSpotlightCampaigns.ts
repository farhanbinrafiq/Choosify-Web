import { useCallback, useMemo, useState } from 'react';
import type {
  SpotlightCampaignListQuery,
  SpotlightCampaignRecord,
} from '../types/spotlight/cms';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';

function matchesFolder(c: SpotlightCampaignRecord, folderId?: string, userId?: string) {
  if (!folderId || folderId === 'all') return true;
  if (folderId === 'my-campaigns') return userId ? c.createdBy === userId : true;
  if (folderId === 'drafts') return c.status === 'draft';
  if (folderId === 'sponsored') return c.isSponsored;
  if (folderId === 'archived') return c.status === 'archived';
  return c.folderId === folderId;
}

export function useSpotlightCampaigns(initialQuery: Partial<SpotlightCampaignListQuery> = {}) {
  const [query, setQuery] = useState<SpotlightCampaignListQuery>({
    filters: { status: 'all', campaignType: 'all', sponsorStatus: 'all', scheduleStatus: 'all', folderId: 'all' },
    sortBy: 'updatedAt',
    sortDir: 'desc',
    page: 1,
    pageSize: 12,
    view: 'grid',
    ...initialQuery,
  });
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const allCampaigns = useMemo(() => {
    void revision;
    return listCampaignRecords();
  }, [revision]);

  const filtered = useMemo(() => {
    let items = [...allCampaigns];
    const { filters } = query;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter(
        (c) =>
          c.campaignName.toLowerCase().includes(q) ||
          c.headline.toLowerCase().includes(q) ||
          (c.brandName ?? '').toLowerCase().includes(q),
      );
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter((c) => c.status === filters.status);
    }
    if (filters.campaignType && filters.campaignType !== 'all') {
      items = items.filter((c) => c.campaignType === filters.campaignType);
    }
    if (filters.sponsorStatus === 'sponsored') items = items.filter((c) => c.isSponsored);
    if (filters.sponsorStatus === 'organic') items = items.filter((c) => !c.isSponsored);

    const now = Date.now();
    if (filters.scheduleStatus === 'active') {
      items = items.filter((c) => {
        const s = new Date(c.schedule.startAt).getTime();
        const e = new Date(c.schedule.endAt).getTime();
        return s <= now && e >= now;
      });
    }
    if (filters.scheduleStatus === 'upcoming') {
      items = items.filter((c) => new Date(c.schedule.startAt).getTime() > now);
    }
    if (filters.scheduleStatus === 'expired') {
      items = items.filter((c) => new Date(c.schedule.endAt).getTime() < now);
    }

    items = items.filter((c) => matchesFolder(c, filters.folderId));

    items.sort((a, b) => {
      const dir = query.sortDir === 'asc' ? 1 : -1;
      const getSortValue = (c: SpotlightCampaignRecord): string | number => {
        switch (query.sortBy) {
          case 'campaignName':
            return c.campaignName;
          case 'priority':
            return c.priority;
          case 'status':
            return c.status;
          case 'campaignHealthScore':
            return c.campaignHealthScore ?? 0;
          case 'updatedAt':
          default:
            return c.updatedAt;
        }
      };
      const av = getSortValue(a);
      const bv = getSortValue(b);
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });

    return items;
  }, [allCampaigns, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / query.pageSize));
  const pageItems = filtered.slice(
    (query.page - 1) * query.pageSize,
    query.page * query.pageSize,
  );

  return {
    query,
    setQuery,
    campaigns: pageItems,
    total: filtered.length,
    totalPages,
    refresh,
  };
}
