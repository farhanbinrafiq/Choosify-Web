export interface SuggestionItem {
  id: string;
  type: 'query' | 'product' | 'brand' | 'creator' | 'category' | 'recent' | 'popular' | 'trending' | 'spotlight' | 'guide' | 'launch';
  title: string;
  subtitle?: string;
  image?: string;
  route: string;
  badge?: string;
}

export interface SuggestionsGrouped {
  recent: SuggestionItem[];
  popular: SuggestionItem[];
  trending: SuggestionItem[];
  queries: SuggestionItem[];
  products: SuggestionItem[];
  brands: SuggestionItem[];
  creators: SuggestionItem[];
  categories: SuggestionItem[];
  totalCount: number;
}

export const matchSearchText = (value: unknown, query: string) =>
  typeof value === 'string' && value.toLowerCase().includes(query);

export const COMMON_SEARCH_KEYWORDS = [
  'iphone', 'iphone 15', 'iphone charger', 'iphone cover', 'samsung galaxy', 'samsung s24',
  'gift wrapping', 'airport pickup', 't-shirt', 'casual wear', 'sound system', 'laptop',
  'gaming console', 'leather shoes', 'beauty care', 'eid panjabi', 'headphones', 'earbuds',
  'aarong salwar kameez', 'apex shoes', 'sailor clothing',
];
