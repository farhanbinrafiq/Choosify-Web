import type { StudioSectionDescriptor } from '../types/studio';

/** Registry of editable sections — shared contract for public pages and CMS studios. */
export const STUDIO_SECTION_REGISTRY: StudioSectionDescriptor[] = [
  {
    id: 'event-about',
    label: 'Event details',
    studio: 'event',
    anchorId: 'event-about',
    order: 1,
    fields: [
      { id: 'title', label: 'Title', type: 'text', path: 'title', required: true },
      { id: 'excerpt', label: 'Excerpt', type: 'text', path: 'excerpt' },
      { id: 'body', label: 'Body', type: 'richtext', path: 'body', required: true },
      { id: 'location', label: 'Location', type: 'text', path: 'location' },
      { id: 'hero', label: 'Banner gallery', type: 'gallery', path: 'bannerImages' },
    ],
  },
  {
    id: 'related-products',
    label: 'Related products',
    studio: 'event',
    anchorId: 'related-products',
    order: 2,
    fields: [
      { id: 'linkedProductIds', label: 'Linked products', type: 'product_list', path: 'linkedProductIds' },
    ],
  },
  {
    id: 'more-events',
    label: 'More events',
    studio: 'event',
    anchorId: 'more-events',
    order: 3,
    fields: [],
  },
  {
    id: 'product-hero',
    label: 'Product hero',
    studio: 'product',
    anchorId: 'product-hero',
    order: 1,
    fields: [
      { id: 'title', label: 'Title', type: 'text', path: 'title', required: true },
      { id: 'gallery', label: 'Gallery', type: 'gallery', path: 'gallery' },
      { id: 'price', label: 'Price', type: 'text', path: 'price' },
    ],
  },
  {
    id: 'product-overview',
    label: 'Product overview',
    studio: 'product',
    anchorId: 'product-overview-section',
    order: 2,
    fields: [
      { id: 'summary', label: 'Summary', type: 'richtext', path: 'overview.summary' },
      { id: 'highlights', label: 'Highlights', type: 'richtext', path: 'overview.highlights' },
    ],
  },
  {
    id: 'product-specs',
    label: 'Product specs',
    studio: 'product',
    anchorId: 'product-specs-section',
    order: 3,
    fields: [
      { id: 'specTable', label: 'Specification table', type: 'richtext', path: 'specifications' },
      { id: 'featureFlags', label: 'Feature badges', type: 'select', path: 'featureFlags' },
    ],
  },
  {
    id: 'product-creator-reviews',
    label: 'Creator reviews',
    studio: 'product',
    anchorId: 'influencer-reviews-section',
    order: 4,
    fields: [
      { id: 'creatorReviewIds', label: 'Featured creator reviews', type: 'product_list', path: 'creatorReviewIds' },
    ],
  },
  {
    id: 'product-public-reviews',
    label: 'Public reviews',
    studio: 'product',
    anchorId: 'public-reviews-section',
    order: 5,
    fields: [
      { id: 'reviewsEnabled', label: 'Enable public reviews', type: 'toggle', path: 'reviews.enabled' },
    ],
  },
  {
    id: 'product-buying-guide',
    label: 'Buying guide',
    studio: 'product',
    anchorId: 'product-utility-section',
    order: 6,
    fields: [
      { id: 'guideTitle', label: 'Guide title', type: 'text', path: 'utility.title' },
      { id: 'guideBody', label: 'Guide body', type: 'richtext', path: 'utility.body' },
    ],
  },
  {
    id: 'brand-hero',
    label: 'Brand hero',
    studio: 'brand',
    anchorId: 'brand-hero',
    order: 1,
    fields: [
      { id: 'name', label: 'Brand name', type: 'text', path: 'name', required: true },
      { id: 'coverImage', label: 'Cover image', type: 'image', path: 'coverImage' },
      { id: 'tagline', label: 'Tagline', type: 'text', path: 'tagline' },
    ],
  },
  {
    id: 'brand-overview',
    label: 'Brand overview',
    studio: 'brand',
    anchorId: 'brand-overview',
    order: 2,
    fields: [
      { id: 'story', label: 'Brand story', type: 'richtext', path: 'story' },
      { id: 'credentials', label: 'Credentials', type: 'richtext', path: 'credentials' },
    ],
  },
  {
    id: 'brand-catalog',
    label: 'Product catalog',
    studio: 'brand',
    anchorId: 'product-catalog-section',
    order: 1,
    fields: [
      { id: 'featuredProductIds', label: 'Featured products', type: 'product_list', path: 'featuredProductIds' },
    ],
  },
  {
    id: 'brand-deals',
    label: 'Brand deals',
    studio: 'brand',
    anchorId: 'brand-deals-section',
    order: 4,
    fields: [
      { id: 'dealsEnabled', label: 'Deals enabled', type: 'toggle', path: 'deals.enabled' },
      { id: 'dealBlocks', label: 'Deal blocks', type: 'richtext', path: 'deals.blocks' },
    ],
  },
  {
    id: 'brand-posts',
    label: 'Brand posts',
    studio: 'brand',
    anchorId: 'brand-posts-section',
    order: 5,
    fields: [
      { id: 'postIds', label: 'Pinned posts', type: 'product_list', path: 'postIds' },
    ],
  },
  {
    id: 'creator-about',
    label: 'Creator profile',
    studio: 'creator',
    anchorId: 'creator-about',
    order: 1,
    fields: [
      { id: 'bio', label: 'Bio', type: 'richtext', path: 'bio' },
      { id: 'avatar', label: 'Avatar', type: 'image', path: 'avatar' },
    ],
  },
  {
    id: 'creator-videos',
    label: 'Creator videos',
    studio: 'creator',
    anchorId: 'videos-section',
    order: 2,
    fields: [
      { id: 'videoGallery', label: 'Video gallery', type: 'gallery', path: 'videos' },
    ],
  },
  {
    id: 'creator-reels',
    label: 'Creator reels',
    studio: 'creator',
    anchorId: 'reels-section',
    order: 3,
    fields: [
      { id: 'reelsGallery', label: 'Reels gallery', type: 'gallery', path: 'reels' },
    ],
  },
  {
    id: 'creator-blogs',
    label: 'Creator blogs',
    studio: 'creator',
    anchorId: 'blogs-section',
    order: 4,
    fields: [
      { id: 'blogIds', label: 'Linked blogs', type: 'product_list', path: 'blogs' },
    ],
  },
  {
    id: 'creator-brand-reviews',
    label: 'Creator brand reviews',
    studio: 'creator',
    anchorId: 'brand-reviews-section',
    order: 5,
    fields: [
      { id: 'reviewBlocks', label: 'Review blocks', type: 'richtext', path: 'brandReviews' },
    ],
  },
  {
    id: 'creator-overview',
    label: 'Creator overview',
    studio: 'creator',
    anchorId: 'creator-overview-section',
    order: 6,
    fields: [
      { id: 'contactEmail', label: 'Contact email', type: 'text', path: 'contact.email' },
      { id: 'contactPhone', label: 'Contact phone', type: 'text', path: 'contact.phone' },
    ],
  },
  {
    id: 'home-hero',
    label: 'Home hero',
    studio: 'website',
    anchorId: 'section-hero',
    order: 1,
    fields: [
      { id: 'headline', label: 'Headline', type: 'text', path: 'homepage.heroBanners[].headline' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', path: 'homepage.heroBanners[].subtitle' },
    ],
  },
  {
    id: 'home-trending-brands',
    label: 'Trending brands',
    studio: 'website',
    anchorId: 'section-trending-brands',
    order: 2,
    fields: [
      { id: 'brandIds', label: 'Featured brands', type: 'product_list', path: 'homepage.trendingBrandIds' },
    ],
  },
  {
    id: 'home-new-products',
    label: 'New products',
    studio: 'website',
    anchorId: 'section-new-on-choosify',
    order: 3,
    fields: [
      { id: 'productIds', label: 'Featured products', type: 'product_list', path: 'homepage.newProductIds' },
    ],
  },
  {
    id: 'home-deals',
    label: 'Hot deals',
    studio: 'website',
    anchorId: 'section-hot-deals',
    order: 4,
    fields: [
      { id: 'dealIds', label: 'Highlighted deals', type: 'product_list', path: 'homepage.dealIds' },
    ],
  },
  {
    id: 'home-recommendations',
    label: 'Recommendations',
    studio: 'website',
    anchorId: 'section-recommendations',
    order: 5,
    fields: [
      { id: 'guideIds', label: 'Featured guides', type: 'product_list', path: 'homepage.recommendationIds' },
    ],
  },
  {
    id: 'home-creators',
    label: 'Featured creators',
    studio: 'website',
    anchorId: 'section-featured-creators',
    order: 6,
    fields: [
      { id: 'creatorIds', label: 'Featured creators', type: 'product_list', path: 'homepage.creatorIds' },
    ],
  },
  {
    id: 'home-categories',
    label: 'Categories',
    studio: 'website',
    anchorId: 'section-categories',
    order: 7,
    fields: [
      { id: 'categoryIds', label: 'Featured categories', type: 'product_list', path: 'homepage.categoryIds' },
    ],
  },
  {
    id: 'home-events',
    label: 'Events and announcements',
    studio: 'website',
    anchorId: 'section-whats-on',
    order: 8,
    fields: [
      { id: 'eventIds', label: 'Pinned events', type: 'product_list', path: 'homepage.eventIds' },
    ],
  },
];

export function getStudioSections(studio: StudioSectionDescriptor['studio']) {
  return STUDIO_SECTION_REGISTRY.filter((section) => section.studio === studio).sort((a, b) => a.order - b.order);
}
