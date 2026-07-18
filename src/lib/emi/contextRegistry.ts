import type { EmiPageId } from '../../types/emi';

export interface EmiContextFieldDefinition {
  field: string;
  label: string;
  required: boolean;
}

export const EMI_CONTEXT_REGISTRY: Record<EmiPageId, EmiContextFieldDefinition[]> = {
  product: [
    { field: 'entityId', label: 'Product ID', required: true },
    { field: 'entityLabel', label: 'Product title', required: true },
    { field: 'metadata.price', label: 'Price', required: false },
    { field: 'metadata.rating', label: 'Rating', required: false },
    { field: 'metadata.brand', label: 'Brand', required: false },
  ],
  brand: [
    { field: 'entityId', label: 'Brand ID', required: true },
    { field: 'entityLabel', label: 'Brand name', required: true },
  ],
  compare: [
    { field: 'compareIds', label: 'Compared items', required: true },
    { field: 'metadata.mode', label: 'Compare mode', required: false },
  ],
  spotlight: [{ field: 'query', label: 'Feed filters', required: false }],
  spotlight_content: [
    { field: 'contentId', label: 'Content ID', required: true },
    { field: 'entityLabel', label: 'Headline', required: true },
    { field: 'productIds', label: 'Linked products', required: false },
  ],
  search: [{ field: 'query', label: 'Search query', required: true }],
  category: [{ field: 'entityId', label: 'Category', required: true }],
  creator: [{ field: 'entityId', label: 'Creator', required: true }],
  dashboard: [{ field: 'metadata.role', label: 'User role', required: false }],
  publisher_studio: [
    { field: 'entityId', label: 'Campaign ID', required: false },
    { field: 'metadata.headline', label: 'Draft headline', required: false },
  ],
  opportunity_center: [{ field: 'entityId', label: 'Opportunity ID', required: false }],
  marketing: [{ field: 'pathname', label: 'Marketing route', required: true }],
  orders: [{ field: 'metadata.orderCount', label: 'Order count', required: false }],
  messages: [],
  collection: [{ field: 'entityId', label: 'Collection ID', required: true }],
  series: [{ field: 'entityId', label: 'Series ID', required: true }],
  home: [],
};
