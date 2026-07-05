/** Canonical feature-flag keys shared between admin Settings and storefront. */
export const FEATURE_FLAG_DEFAULTS: Record<string, boolean> = {
  creator_hub: true,
  compare_tool: true,
  enable_comparison_engine: true,
  enable_creator_marketplace: true,
  enable_community_submissions: true,
  enable_campaign_banners: true,
  enable_cod_only_mode: false,
  enable_promo_codes: true,
  enable_brand_deals_page: true,
  maintenance_mode: false,
};

const FLAG_GROUPS: Record<string, string[]> = {
  creator_hub: ['creator_hub', 'enable_creator_marketplace'],
  enable_creator_marketplace: ['creator_hub', 'enable_creator_marketplace'],
  compare_tool: ['compare_tool', 'enable_comparison_engine'],
  enable_comparison_engine: ['compare_tool', 'enable_comparison_engine'],
};

export function normalizeFeatureFlags(
  remote: Record<string, boolean>,
): Record<string, boolean> {
  return { ...FEATURE_FLAG_DEFAULTS, ...remote };
}

export function isFlagEnabled(
  flags: Record<string, boolean>,
  key: string,
): boolean {
  const keys = FLAG_GROUPS[key] || [key];
  for (const k of keys) {
    if (flags[k] === false) return false;
  }
  return true;
}

/** Nav paths gated by feature flags */
export function isNavPathEnabled(
  path: string,
  flags: Record<string, boolean>,
): boolean {
  if (path.startsWith('/compare')) return isFlagEnabled(flags, 'enable_comparison_engine');
  if (path.startsWith('/creators')) return isFlagEnabled(flags, 'creator_hub');
  if (path.startsWith('/brand-deals')) return isFlagEnabled(flags, 'enable_brand_deals_page');
  return true;
}
