import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { operationsApi } from '../services/operationsApi';
import type { CtaPageKey, CtaPosition } from '../types/catalog';
import { getCtaBannersForAnchor } from '../lib/ctaBanners';
import { CtaBannerStrip } from './CtaBannerStrip';

/**
 * Generic, Admin-manageable CTA anchor for a real storefront insertion
 * point. Renders every enabled CTA banner assigned to this exact
 * (page, section, position) placement (Storefront Curation → CTA & Banners),
 * in order scoped to this anchor only. This is what makes "Create CTA"
 * actually appear on the storefront without further code changes -- Admin
 * picks page/section/position from the same fixed, wired registry
 * (ctaPlacementRegistry.ts) that this component's call sites are drawn from.
 *
 * Placement is never hard-coded per CTA id here -- this component has no
 * knowledge of which CTAs exist, only of which (page,section,position)
 * bucket it renders. Audience rules reuse the exact same authenticated-role
 * lookup (operationsApi.getSellerStatus) BecomeCreatorSidebarCard already
 * uses, fetched once per anchor only when a CTA there actually needs it.
 */
export function CtaBannerSlot({
  page,
  section,
  position,
  className,
}: {
  page: CtaPageKey;
  section: string;
  position: CtaPosition;
  className?: string;
}) {
  const { siteConfig, currentUser, isLoggedIn } = useGlobalState();
  const items = getCtaBannersForAnchor(siteConfig?.ctaBanners, page, section, position);
  const needsAudienceCheck = items.some(
    (item) =>
      item.audienceRule === 'hide_if_has_creator_account' || item.audienceRule === 'hide_if_has_seller_account',
  );

  const [status, setStatus] = useState<{ hasCreatorAccount?: boolean; hasSellerAccount?: boolean }>({});

  useEffect(() => {
    if (!needsAudienceCheck) return;
    const email = currentUser?.email?.trim().toLowerCase();
    if (!isLoggedIn || !email || email === 'guest') {
      setStatus({});
      return;
    }
    let cancelled = false;
    operationsApi
      .getSellerStatus(email)
      .then((result) => {
        if (!cancelled) setStatus(result);
      })
      .catch(() => {
        if (!cancelled) setStatus({});
      });
    return () => {
      cancelled = true;
    };
  }, [needsAudienceCheck, isLoggedIn, currentUser?.email]);

  const visible = items.filter((item) => {
    if (item.audienceRule === 'guests_only') return !isLoggedIn;
    if (item.audienceRule === 'logged_in_only') return isLoggedIn;
    if (item.audienceRule === 'hide_if_has_creator_account') return !status.hasCreatorAccount;
    if (item.audienceRule === 'hide_if_has_seller_account') return !status.hasSellerAccount;
    return true;
  });

  if (!visible.length) return null;

  return (
    <>
      {visible.map((item) => (
        <CtaBannerStrip key={item.id} item={item} className={className} />
      ))}
    </>
  );
}
