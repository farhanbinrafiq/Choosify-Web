import type { SpotlightCollection } from '../types/spotlight/discovery/collections';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';

const NOW = new Date().toISOString();

const DEMO_COLLECTIONS: Omit<SpotlightCollection, 'items'>[] = [
  { collectionId: 'col-eid', slug: 'eid-mega-sale', name: 'Eid Mega Sale', kind: 'seasonal', theme: 'eid', tags: ['eid', 'sale'], isFeatured: true, createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-school', slug: 'back-to-school', name: 'Back To School', kind: 'seasonal', theme: 'back_to_school', tags: ['education'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-tech', slug: 'tech-festival', name: 'Tech Festival', kind: 'event', tags: ['tech', 'festival'], isFeatured: true, createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-travel', slug: 'travel-deals', name: 'Travel Deals', kind: 'seasonal', tags: ['travel'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-fashion', slug: 'summer-fashion', name: 'Summer Fashion', kind: 'seasonal', tags: ['fashion'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-ramadan', slug: 'ramadan-specials', name: 'Ramadan Specials', kind: 'seasonal', theme: 'ramadan', tags: ['ramadan'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-wedding', slug: 'wedding-season', name: 'Wedding Season', kind: 'seasonal', tags: ['wedding'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-photo', slug: 'photography-week', name: 'Photography Week', kind: 'editorial', tags: ['photography'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-gaming', slug: 'gaming-month', name: 'Gaming Month', kind: 'editorial', tags: ['gaming'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-ai', slug: 'ai-products', name: 'AI Products', kind: 'editorial', tags: ['ai'], isFeatured: true, createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-smart', slug: 'smart-home', name: 'Smart Home', kind: 'brand', tags: ['smart home'], createdAt: NOW, updatedAt: NOW },
  { collectionId: 'col-health', slug: 'healthy-living', name: 'Healthy Living', kind: 'editorial', tags: ['health'], createdAt: NOW, updatedAt: NOW },
];

function buildCollectionItems(campaignIds: string[]): SpotlightCollection['items'] {
  return campaignIds.map((id, i) => ({
    kind: 'campaign' as const,
    entityId: id,
    contentId: `campaign-${id}`,
    sortOrder: i,
  }));
}

export function listSpotlightCollections(allContent: SpotlightContent[]): SpotlightCollection[] {
  const campaigns = listCampaignRecords();
  const campaignIds = campaigns.map((c) => c.campaignId);

  return DEMO_COLLECTIONS.map((base, idx) => {
    const slice = campaignIds.slice(idx % Math.max(1, campaignIds.length), (idx % Math.max(1, campaignIds.length)) + 4);
    const contentSlice = allContent.filter((c) => slice.includes(c.sourceId)).slice(0, 6);
    const items = contentSlice.length
      ? contentSlice.map((c, i) => ({ kind: 'campaign' as const, entityId: c.sourceId, contentId: c.contentId, sortOrder: i }))
      : buildCollectionItems(slice.length ? slice : campaignIds.slice(0, 3));

    return {
      ...base,
      description: `Curated ${base.name} experiences on Choosify Spotlight.`,
      items,
    };
  });
}

export function getCollectionBySlug(slug: string, allContent: SpotlightContent[]): SpotlightCollection | undefined {
  return listSpotlightCollections(allContent).find((c) => c.slug === slug);
}

export function resolveCollectionContent(collection: SpotlightCollection, allContent: SpotlightContent[]): SpotlightContent[] {
  const ids = new Set(collection.items.map((i) => i.contentId ?? `campaign-${i.entityId}`));
  return allContent.filter((c) => ids.has(c.contentId));
}
