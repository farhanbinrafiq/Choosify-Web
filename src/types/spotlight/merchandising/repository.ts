/**
 * Merchandising repository contracts — LE-005.3.2 / LE-005.4
 * No Firestore implementation.
 */

import type { SpotlightCampaignMerchandising } from './model';
import type { SpotlightMerchandisingCollection } from './collections';
import type { SpotlightCampaignBundle } from './bundles';
import type { SpotlightMerchandisingRuleGroup } from './rules';
import type { SpotlightCampaignProductLink } from './productLink';

export interface CampaignMerchandisingRepository {
  get(campaignId: string): Promise<SpotlightCampaignMerchandising | null>;
  save(campaignId: string, merchandising: SpotlightCampaignMerchandising): Promise<SpotlightCampaignMerchandising>;
  updateProductLinks(campaignId: string, links: SpotlightCampaignProductLink[]): Promise<void>;
}

export interface MerchandisingCollectionRepository {
  list(campaignId: string): Promise<SpotlightMerchandisingCollection[]>;
  create(collection: SpotlightMerchandisingCollection): Promise<SpotlightMerchandisingCollection>;
  update(collectionId: string, patch: Partial<SpotlightMerchandisingCollection>): Promise<SpotlightMerchandisingCollection>;
  delete(collectionId: string): Promise<void>;
  duplicate(collectionId: string, newName: string): Promise<SpotlightMerchandisingCollection>;
  merge(sourceId: string, targetId: string): Promise<SpotlightMerchandisingCollection>;
  assignProducts(collectionId: string, productIds: string[]): Promise<void>;
  moveProducts(fromCollectionId: string, toCollectionId: string, productIds: string[]): Promise<void>;
}

export interface CampaignBundleRepository {
  list(campaignId: string): Promise<SpotlightCampaignBundle[]>;
  save(bundle: SpotlightCampaignBundle): Promise<SpotlightCampaignBundle>;
  delete(bundleId: string): Promise<void>;
}

export interface MerchandisingRulesRepository {
  getSmartRules(campaignId: string): Promise<SpotlightMerchandisingRuleGroup[]>;
  saveSmartRules(campaignId: string, rules: SpotlightMerchandisingRuleGroup[]): Promise<void>;
}

export interface SpotlightMerchandisingRepositoryRegistry {
  merchandising: CampaignMerchandisingRepository;
  collections: MerchandisingCollectionRepository;
  bundles: CampaignBundleRepository;
  rules: MerchandisingRulesRepository;
}
