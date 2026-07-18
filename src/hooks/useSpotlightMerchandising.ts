import { useCallback, useMemo, useState } from 'react';
import type { SpotlightCampaignMerchandising } from '../types/spotlight/merchandising/model';
import { createDefaultMerchandising } from '../types/spotlight/merchandising/model';
import type { SpotlightCampaignProductLink } from '../types/spotlight/merchandising/productLink';
import type { SpotlightProductMerchandisingRole } from '../types/spotlight/merchandising/roles';
import type { SpotlightMerchandisingCollection } from '../types/spotlight/merchandising/collections';
import type { SpotlightCampaignBundle } from '../types/spotlight/merchandising/bundles';
import { SPOTLIGHT_DEFAULT_MERCHANDISING_SLOTS } from '../types/spotlight/merchandising/slots';
import {
  attachProducts,
  detachProducts,
  migrateLegacyToMerchandising,
  moveProductLink,
  orderProductLinks,
  setProductRole,
  syncMerchandisingToLegacy,
} from '../utils/spotlightMerchandisingOrdering';

export function useSpotlightMerchandising(
  initial?: SpotlightCampaignMerchandising,
  legacyIds?: string[],
  legacyPrimary?: string,
) {
  const [merchandising, setMerchandising] = useState<SpotlightCampaignMerchandising>(() => {
    if (initial?.productLinks?.length) {
      return {
        ...createDefaultMerchandising(),
        ...initial,
        slots: initial.slots?.length ? initial.slots : [...SPOTLIGHT_DEFAULT_MERCHANDISING_SLOTS],
      };
    }
    return migrateLegacyToMerchandising(legacyIds ?? [], legacyPrimary, initial);
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const orderedLinks = useMemo(
    () => orderProductLinks(merchandising.productLinks),
    [merchandising.productLinks],
  );

  const legacySync = useMemo(() => syncMerchandisingToLegacy(merchandising), [merchandising]);

  const updateMerchandising = useCallback((patch: Partial<SpotlightCampaignMerchandising>) => {
    setMerchandising((prev) => ({ ...prev, ...patch }));
  }, []);

  const setProductLinks = useCallback((productLinks: SpotlightCampaignProductLink[]) => {
    setMerchandising((prev) => ({ ...prev, productLinks }));
  }, []);

  const attach = useCallback((ids: string[], role?: SpotlightProductMerchandisingRole) => {
    setMerchandising((prev) => ({
      ...prev,
      productLinks: attachProducts(prev.productLinks, ids, role),
    }));
  }, []);

  const detach = useCallback((ids: string[]) => {
    setMerchandising((prev) => ({
      ...prev,
      productLinks: detachProducts(prev.productLinks, ids),
    }));
    setSelectedIds((s) => {
      const next = new Set(s);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const setRole = useCallback((productId: string, role: SpotlightProductMerchandisingRole) => {
    setMerchandising((prev) => ({
      ...prev,
      productLinks: setProductRole(prev.productLinks, productId, role),
    }));
  }, []);

  const move = useCallback((productId: string, direction: 'up' | 'down') => {
    setMerchandising((prev) => ({
      ...prev,
      productLinks: moveProductLink(prev.productLinks, productId, direction),
    }));
  }, []);

  const togglePin = useCallback((productId: string) => {
    setMerchandising((prev) => ({
      ...prev,
      productLinks: prev.productLinks.map((l) =>
        l.productId === productId ? { ...l, pinned: !l.pinned } : l,
      ),
    }));
  }, []);

  const toggleSelect = useCallback((productId: string) => {
    setSelectedIds((s) => {
      const next = new Set(s);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const bulkDetach = useCallback(() => {
    detach([...selectedIds]);
  }, [detach, selectedIds]);

  const updateCollections = useCallback((collections: SpotlightMerchandisingCollection[]) => {
    setMerchandising((prev) => ({ ...prev, collections }));
  }, []);

  const updateBundles = useCallback((bundles: SpotlightCampaignBundle[]) => {
    setMerchandising((prev) => ({ ...prev, bundles }));
  }, []);

  return {
    merchandising,
    orderedLinks,
    legacySync,
    selectedIds,
    updateMerchandising,
    setProductLinks,
    attach,
    detach,
    setRole,
    move,
    togglePin,
    toggleSelect,
    bulkDetach,
    updateCollections,
    updateBundles,
  };
}
