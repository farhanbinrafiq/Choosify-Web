/**
 * LE-006.2 — Spotlight Details Intelligence demo manifests
 * Placeholder section visibility until CMS ships per-record pageSections.
 * Each entry demonstrates which sections appear for a content archetype.
 */

import type { SpotlightContentType } from '../../types/spotlight/experience/contentTypes';
import type { SpotlightPageSectionConfig } from '../../types/spotlight/experience/pageSections';
import type { SpotlightContent } from '../../types/spotlight/experience/content';
import { getDemoSpotlightContentBySlug } from './spotlightDemoFeedFactory';

function cfg(id: SpotlightPageSectionConfig['id'], visible = true): SpotlightPageSectionConfig {
  return { id, visible };
}

/** Demo manifests keyed by content archetype label */
export const SPOTLIGHT_DETAILS_DEMO_MANIFESTS: Record<
  'guide' | 'campaign' | 'review' | 'offer' | 'live' | 'collection' | 'editorial' | 'service',
  { contentType: SpotlightContentType; label: string; sections: SpotlightPageSectionConfig[] }
> = {
  guide: {
    contentType: 'buying_guide',
    label: 'Buying Guide',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('media_gallery'),
      cfg('winner'),
      cfg('why_it_won'),
      cfg('verdict'),
      cfg('takeaways'),
      cfg('pros'),
      cfg('cons'),
      cfg('top_picks'),
      cfg('products_reviewed'),
      cfg('creator_profile_card'),
      cfg('associated_products'),
      cfg('related_spotlight'),
    ],
  },
  campaign: {
    contentType: 'campaign',
    label: 'Brand Campaign',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('description'),
      cfg('associated_products'),
      cfg('brand_profile_card'),
      cfg('related_spotlight'),
      cfg('related_products'),
    ],
  },
  review: {
    contentType: 'product_review',
    label: 'Product Review',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('media_gallery'),
      cfg('description'),
      cfg('pros'),
      cfg('cons'),
      cfg('verdict'),
      cfg('specifications'),
      cfg('associated_products'),
      cfg('brand_profile_card'),
      cfg('creator_profile_card'),
      cfg('related_products'),
    ],
  },
  offer: {
    contentType: 'promotion',
    label: 'Offer / Promotion',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('description'),
      cfg('pricing'),
      cfg('associated_products'),
      cfg('brand_profile_card'),
      cfg('related_spotlight'),
    ],
  },
  live: {
    contentType: 'live',
    label: 'Live Event',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('live_status'),
      cfg('description'),
      cfg('associated_products'),
      cfg('associated_services'),
      cfg('brand_profile_card'),
      cfg('creator_profile_card'),
      cfg('related_spotlight'),
    ],
  },
  collection: {
    contentType: 'community_pick',
    label: 'Collection',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('description'),
      cfg('media_gallery'),
      cfg('associated_products'),
      cfg('brand_profile_card'),
      cfg('related_spotlight'),
    ],
  },
  editorial: {
    contentType: 'editorial',
    label: 'Editorial / Blog',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('description'),
      cfg('associated_products'),
      cfg('creator_profile_card'),
      cfg('related_spotlight'),
      cfg('related_products'),
    ],
  },
  service: {
    contentType: 'whats_on',
    label: 'Service Highlight',
    sections: [
      cfg('hero_media'),
      cfg('content_summary'),
      cfg('description'),
      cfg('pricing'),
      cfg('associated_services'),
      cfg('brand_profile_card'),
      cfg('share'),
    ],
  },
};

/** Slugs that load a demo manifest overlay (frontend placeholder only) */
export const SPOTLIGHT_DETAILS_DEMO_SLUGS: Record<string, keyof typeof SPOTLIGHT_DETAILS_DEMO_MANIFESTS> = {
  'demo-guide': 'guide',
  'demo-campaign': 'campaign',
  'demo-review': 'review',
  'demo-offer': 'offer',
  'demo-live': 'live',
  'demo-collection': 'collection',
};

/** Apply demo pageSections when slug matches a demo entry */
export function applySpotlightDetailsDemoOverlay(content: SpotlightContent): SpotlightContent {
  if (content.pageSections?.length) return content;
  const demoKey = SPOTLIGHT_DETAILS_DEMO_SLUGS[content.slug];
  if (!demoKey) return content;
  const demo = SPOTLIGHT_DETAILS_DEMO_MANIFESTS[demoKey];
  return {
    ...content,
    contentType: demo.contentType,
    pageSections: demo.sections,
    description:
      content.description ??
      `Demo ${demo.label} content — sections driven by LE-006.2 intelligence framework.`,
  };
}

/** Synthetic placeholder content for demo slugs when no backend record exists */
export function buildSpotlightDetailsDemoContent(slug: string): SpotlightContent | undefined {
  const fromFeed = getDemoSpotlightContentBySlug(slug);
  if (fromFeed) return fromFeed;

  const demoKey = SPOTLIGHT_DETAILS_DEMO_SLUGS[slug];
  if (!demoKey) return undefined;
  const demo = SPOTLIGHT_DETAILS_DEMO_MANIFESTS[demoKey];
  const isBrand = ['campaign', 'offer', 'live', 'collection'].includes(demoKey);
  const isCreator = demoKey === 'review' || demoKey === 'guide';

  return {
    contentId: `demo-${slug}`,
    slug,
    contentType: demo.contentType,
    sourceKind: 'synthetic',
    sourceId: slug,
    publisher: {
      publisherId: isBrand ? 'demo-brand' : 'demo-creator',
      name: isBrand ? 'Demo Brand' : 'Demo Creator',
      publisherType: isBrand ? 'brand' : 'creator',
      isVerified: true,
      badges: [],
      logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e939e966?w=200',
      profileHref: isBrand ? '/brands/samsung' : '/creators/demo-creator',
    },
    headline: `Demo ${demo.label}`,
    description: `This is placeholder ${demo.label} content demonstrating LE-006.2 section visibility. Only the sections listed in the manifest render — no empty placeholders.`,
    media: {
      mediaId: `demo-media-${slug}`,
      mediaType: demoKey === 'live' ? 'landscape_video' : demoKey === 'collection' ? 'carousel' : 'landscape_video',
      orientation: 'landscape',
      aspectRatio: '16:9',
      thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7a2be?w=1200',
      imageUrls: [
        'https://images.unsplash.com/photo-1611162616305-c69b3fa7a2be?w=1200',
        'https://images.unsplash.com/photo-1611162617474-5b21e939e966?w=1200',
      ],
      displayOrder: 0,
    },
    connections: {
      productIds: ['1', '2'],
      brandIds: isBrand ? ['samsung'] : [],
      serviceIds: demoKey === 'live' || demoKey === 'service' ? ['svc-hotel-1'] : [],
      categoryIds: ['electronics'],
      creatorIds: isCreator ? ['demo-creator'] : [],
      guideIds: [],
      comparisonIds: [],
      recommendationIds: [],
      offerIds: demoKey === 'offer' ? ['offer-1'] : [],
      bundleIds: [],
      couponIds: [],
      campaignIds: [],
      eventIds: [],
      liveSessionIds: [],
      spotlightContentIds: [],
    },
    graph: {
      relatedContentIds: [],
      relatedGuideIds: [],
      relatedProductIds: ['1', '2'],
      relatedBrandIds: ['samsung'],
      relatedCreatorIds: [],
      relatedCategoryIds: ['electronics'],
      relatedCampaignIds: [],
      relatedLiveSessionIds: [],
    },
    commerce: {
      featuredProductIds: ['1', '2'],
      featuredServiceIds: demoKey === 'live' ? ['svc-hotel-1'] : [],
      offerIds: [],
      couponIds: [],
      bundleIds: [],
      primaryCta: { label: 'Shop Now', href: '/products/1' },
    },
    live:
      demoKey === 'live'
        ? {
            status: 'live',
            platform: 'youtube',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            productIds: ['1'],
            serviceIds: ['svc-hotel-1'],
            pinnedProductIds: ['1'],
            pinnedOfferIds: [],
          }
        : undefined,
    badges: ['Demo'],
    isSponsored: demoKey === 'campaign',
    isLive: demoKey === 'live',
    isVerified: true,
    ctaLabel: demoKey === 'live' ? 'Watch Live' : 'Shop Now',
    href: `/spotlight/${slug}`,
    publishedAt: new Date().toISOString(),
    endsAt: demoKey === 'offer' ? new Date(Date.now() + 7 * 86400000).toISOString() : undefined,
    pageSections: demo.sections,
  };
}
