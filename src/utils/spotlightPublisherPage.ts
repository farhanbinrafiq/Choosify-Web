import type { SpotlightPublisherProfile } from '../types/spotlight/publisher/profile';
import type { SpotlightPublisherPageModel, SpotlightPublisherPageSection } from '../types/spotlight/publisher/page';
import { PUBLISHER_PAGE_SECTION_META } from '../types/spotlight/publisher/page';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightCampaignContribution } from '../types/spotlight/collaboration/campaign';
import type { CatalogProduct } from '../types/catalog';

export interface PublisherPageSources {
  profile: SpotlightPublisherProfile;
  allContent: SpotlightContent[];
  contributions: SpotlightCampaignContribution[];
  products: CatalogProduct[];
}

function filterByPublisher(content: SpotlightContent[], publisherId: string): SpotlightContent[] {
  return content.filter(
    (c) =>
      c.publisher.publisherId === publisherId ||
      c.collaborators?.some((col) => col.publisherId === publisherId),
  );
}

export function buildPublisherPageModel(sources: PublisherPageSources): SpotlightPublisherPageModel {
  const { profile, allContent, contributions, products } = sources;
  const mine = filterByPublisher(allContent, profile.publisherId);

  const section = (
    id: SpotlightPublisherPageModel['sections'][0]['id'],
    items?: SpotlightContent[],
    extra?: Partial<SpotlightPublisherPageSection>,
  ): SpotlightPublisherPageSection => ({
    id,
    title: PUBLISHER_PAGE_SECTION_META[id].title,
    items,
    hidden: PUBLISHER_PAGE_SECTION_META[id].future,
    ...extra,
  });

  const sections: SpotlightPublisherPageSection[] = [
    section('overview', mine.slice(0, 4)),
    section('spotlight', mine),
    section('campaigns', mine.filter((c) => ['campaign', 'promotion', 'new_launch'].includes(c.contentType))),
    section('live', mine.filter((c) => c.isLive || c.contentType === 'live')),
    section('creator_collaborations', undefined, { contributions }),
    section('recommendations', mine.filter((c) => c.contentType === 'recommendation')),
    section('buying_guides', mine.filter((c) => ['buying_guide', 'tutorial', 'tips'].includes(c.contentType))),
    section('announcements', mine.filter((c) => c.contentType === 'announcement')),
    section('events', mine.filter((c) => ['event', 'whats_on'].includes(c.contentType))),
    section('products', undefined, { productIds: products.map((p) => p.id) }),
    section('reviews', mine.filter((c) => ['creator_review', 'product_review'].includes(c.contentType))),
    section('followers', undefined, { hidden: true }),
    section('about', undefined, { items: mine.slice(0, 1) }),
  ].filter((s) => !s.hidden || s.id === 'followers');

  return {
    profile,
    sections: sections.filter((s) => {
      if (s.id === 'followers') return false;
      if (s.items?.length) return true;
      if (s.contributions?.length) return true;
      if (s.productIds?.length) return true;
      if (s.id === 'overview' || s.id === 'about') return true;
      return false;
    }),
    activeSectionId: 'overview',
  };
}
