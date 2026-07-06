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
];

export function getStudioSections(studio: StudioSectionDescriptor['studio']) {
  return STUDIO_SECTION_REGISTRY.filter((section) => section.studio === studio).sort((a, b) => a.order - b.order);
}
