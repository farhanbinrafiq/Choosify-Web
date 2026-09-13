/**
 * Canonical origin for the cross-app Partner (Seller/Creator) signup flow,
 * which lives on the admin app (dashboard.choosify.bd/signup), not here.
 * Extracted from the dev/prod origin resolution already duplicated in
 * Footer.tsx and BecomeCreatorSidebarCard.tsx so a third/fourth copy (e.g. an
 * Admin-configured CTA banner) doesn't drift from those.
 */
const DEV_PARTNER_SIGNUP_ORIGIN = 'http://localhost:3001';
const PROD_PARTNER_SIGNUP_ORIGIN = 'https://dashboard.choosify.bd';

export function resolvePartnerSignupOrigin(): string {
  const fromEnv = ((import.meta as any).env?.VITE_SELLER_DASHBOARD_URL as string | undefined)?.replace(
    /\/$/,
    '',
  );
  if (import.meta.env.DEV) {
    if (fromEnv && /(localhost|127\.0\.0\.1)/i.test(fromEnv)) return fromEnv;
    return DEV_PARTNER_SIGNUP_ORIGIN;
  }
  return fromEnv || PROD_PARTNER_SIGNUP_ORIGIN;
}

export function resolvePartnerSignupUrl(kind: 'creator' | 'seller'): string {
  return `${resolvePartnerSignupOrigin()}/signup?type=${kind}`;
}
