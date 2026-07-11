/**
 * Shared DTO strategy — monorepo package guidance (CTO addition), LE-005.3.2
 *
 * Future package: @choosify/spotlight-types or packages/shared/spotlight
 */

/** Safe to share between Choosify-Web, choosify-admin-4.0, and API workers */
export const SPOTLIGHT_SHARED_DTO_MODULES = [
  'types/spotlight/campaign.ts',
  'types/spotlight/campaignTypes.ts',
  'types/spotlight/lifecycle.ts',
  'types/spotlight/scheduling.ts',
  'types/spotlight/media.ts',
  'types/spotlight/placement.ts',
  'types/spotlight/template.ts',
  'types/spotlight/versioning.ts',
  'types/spotlight/objectives.ts',
  'types/spotlight/seo.ts',
  'types/spotlight/localization.ts',
  'types/spotlight/targeting.ts',
  'types/spotlight/budget.ts',
  'types/spotlight/relationships.ts',
  'types/spotlight/assets.ts',
  'types/spotlight/keywords.ts',
  'types/spotlight/landingPage.ts',
  'types/spotlight/audit.ts',
  'types/spotlight/approval.ts',
  'types/spotlight/aiMetadata.ts',
  'types/spotlight/health.ts',
  'types/spotlight/collections.ts',
  'types/spotlight/api/**',
  'types/spotlight/integrations/**',
  'types/spotlight/repositories/**',
] as const;

/** Frontend-only — UI state, wizard drafts, CMS folders */
export const SPOTLIGHT_FRONTEND_ONLY_MODULES = [
  'types/spotlight/cms.ts',
  'components/media/**',
  'components/spotlight/**',
  'hooks/useSpotlightCampaigns.ts',
  'hooks/useSpotlightCampaignWizard.ts',
  'services/spotlightCampaignStorage.ts',
] as const;

/** Backend-only — persistence adapters, workers, webhooks */
export const SPOTLIGHT_BACKEND_ONLY_MODULES = [
  'firestore/spotlight/**',
  'workers/spotlight/**',
  'webhooks/spotlight/**',
] as const;

export interface SpotlightSharedPackageManifest {
  name: '@choosify/spotlight-types';
  exports: {
    campaign: string;
    api: string;
    integrations: string;
    repositories: string;
    services: string;
  };
  consumers: Array<'choosify-web' | 'choosify-admin-4.0' | 'choosify-api'>;
}

export const SPOTLIGHT_SHARED_PACKAGE_MANIFEST: SpotlightSharedPackageManifest = {
  name: '@choosify/spotlight-types',
  exports: {
    campaign: './campaign',
    api: './api',
    integrations: './integrations',
    repositories: './repositories',
    services: './services',
  },
  consumers: ['choosify-web', 'choosify-admin-4.0', 'choosify-api'],
};
