import type { FilterProfile } from '../FilterEngine';

export const PRODUCTS_PAGE_FILTER_PROFILE: FilterProfile = {
  entity: 'products',
  filters: [
    {
      id: 'price_custom',
      name: 'Price Scope (BDT)',
      type: 'price_custom',
    },
    {
      id: 'category',
      name: 'Categories',
      type: 'single_select',
    },
    {
      id: 'brand',
      name: 'Featured Brands',
      type: 'single_select',
    },
    {
      id: 'rating',
      name: 'Rating Score',
      type: 'single_select',
    },
    {
      id: 'availability',
      name: 'Availability',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Items' },
        { value: 'in-stock', label: 'In Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' },
      ],
    },
  ],
};

export const DEALS_PAGE_FILTER_PROFILE: FilterProfile = {
  entity: 'deals',
  filters: [
    {
      id: 'category',
      name: 'Category Channel',
      type: 'single_select',
    },
    {
      id: 'discount_range',
      name: 'Minimum Discount',
      type: 'range',
      min: 0,
      max: 70,
      step: 10,
      unit: '% Off',
    },
  ],
};

export const CREATORS_PAGE_FILTER_PROFILE: FilterProfile = {
  entity: 'creators',
  filters: [
    {
      id: 'alphabet',
      name: 'Initial Selector',
      type: 'alphabet',
    },
    {
      id: 'niche',
      name: 'Niche Markets',
      type: 'single_select',
    },
    {
      id: 'verification',
      name: 'Verified Badges',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Creators' },
        { value: 'verified', label: 'Verified Only' },
        { value: 'unverified', label: 'Independent' },
      ],
    },
    {
      id: 'engagement',
      name: 'Engagement Rating',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Ratings' },
        { value: 'high', label: 'Top-Tier Engagement (4.8+)' },
        { value: 'normal', label: 'Standard Rating' },
      ],
    },
  ],
};
