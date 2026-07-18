import type { SpotlightPublisher } from '../../../types/spotlight/experience/publisher';

export type PublisherKind = SpotlightPublisher['publisherType'];

export interface PublisherRegistryEntry {
  kind: PublisherKind;
  label: string;
  profileRoute: (id: string) => string;
  isSecondaryDestination: boolean;
}

/** Publisher profiles are secondary — content page is always primary */
export const PUBLISHER_REGISTRY: PublisherRegistryEntry[] = [
  { kind: 'brand', label: 'Brand', profileRoute: (id) => `/brands/${id}`, isSecondaryDestination: true },
  { kind: 'creator', label: 'Creator', profileRoute: (id) => `/creators/${id}`, isSecondaryDestination: true },
  { kind: 'influencer', label: 'Creator', profileRoute: (id) => `/creators/${id}`, isSecondaryDestination: true },
  { kind: 'editorial_team', label: 'Choosify Editorial', profileRoute: () => '/spotlight', isSecondaryDestination: true },
  { kind: 'marketplace_admin', label: 'Choosify', profileRoute: () => '/', isSecondaryDestination: true },
  { kind: 'verified_seller', label: 'Seller', profileRoute: (id) => `/brands/${id}`, isSecondaryDestination: true },
  { kind: 'retailer', label: 'Retailer', profileRoute: (id) => `/brands/${id}`, isSecondaryDestination: true },
];

export function publisherProfileHref(publisher: SpotlightPublisher): string | undefined {
  if (publisher.profileHref) return publisher.profileHref;
  const entry = PUBLISHER_REGISTRY.find((p) => p.kind === publisher.publisherType);
  if (!entry) return undefined;
  return entry.profileRoute(publisher.publisherId);
}
