import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { useDashboard } from '../context/DashboardContext';
import toast from 'react-hot-toast';

export type EngagementEntityType =
  | 'product'
  | 'guide'
  | 'brand-post'
  | 'deal'
  | 'brand'
  | 'review';

function seedCount(id: string | number, salt: number, min: number, span: number): number {
  const raw = String(id)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), salt);
  return min + (raw % span);
}

function readLovedSet(): Set<string> {
  try {
    const raw = localStorage.getItem('choosify_loved_entities');
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeLovedSet(set: Set<string>) {
  localStorage.setItem('choosify_loved_entities', JSON.stringify([...set]));
}

export function useCardEngagement(options: {
  entityType: EngagementEntityType;
  entityId: string | number;
  payload?: Record<string, unknown>;
  defaultLoveCount?: number;
  defaultSaveCount?: number;
}) {
  const { savedProducts, setSavedProducts, savedGuides, setSavedGuides } =
    useDashboard();

  const loveKey = `${options.entityType}:${options.entityId}`;
  const baseLove =
    options.defaultLoveCount ??
    seedCount(options.entityId, 17, 120, options.entityType === 'brand' ? 50000 : 2400);
  const baseSave =
    options.defaultSaveCount ??
    seedCount(options.entityId, 31, 24, options.entityType === 'brand' ? 8000 : 900);

  const [loveCount, setLoveCount] = useState(baseLove);
  const [saveCount, setSaveCount] = useState(baseSave);
  const [hasLoved, setHasLoved] = useState(() => readLovedSet().has(loveKey));

  const isSaved = useMemo(() => {
    if (options.entityType === 'product') {
      return savedProducts.some((item) => String(item?.id) === String(options.entityId));
    }
    if (options.entityType === 'guide') {
      return savedGuides.some((item) => String(item?.id) === String(options.entityId));
    }
    try {
      const raw = localStorage.getItem(`choosify_saved_${options.entityType}`);
      const list: Array<{ id: string | number }> = raw ? JSON.parse(raw) : [];
      return list.some((item) => String(item.id) === String(options.entityId));
    } catch {
      return false;
    }
  }, [options.entityType, options.entityId, savedProducts, savedGuides]);

  const toggleLove = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      event?.preventDefault();
      const loved = readLovedSet();
      if (hasLoved) {
        loved.delete(loveKey);
        setHasLoved(false);
        setLoveCount((count) => Math.max(0, count - 1));
        toast.success('Love react removed');
      } else {
        loved.add(loveKey);
        setHasLoved(true);
        setLoveCount((count) => count + 1);
        toast.success('Love react added!');
      }
      writeLovedSet(loved);
    },
    [hasLoved, loveKey],
  );

  const toggleSave = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      event?.preventDefault();
      const payload = options.payload ?? { id: options.entityId };

      if (options.entityType === 'product') {
        if (isSaved) {
          setSavedProducts((prev) =>
            prev.filter((item) => String(item?.id) !== String(options.entityId)),
          );
          setSaveCount((count) => Math.max(0, count - 1));
          toast.success('Removed from saved products');
        } else {
          setSavedProducts((prev) => [payload, ...prev]);
          setSaveCount((count) => count + 1);
          toast.success('Saved to your dashboard');
        }
        return;
      }

      if (options.entityType === 'guide') {
        if (isSaved) {
          setSavedGuides((prev) =>
            prev.filter((item) => String(item?.id) !== String(options.entityId)),
          );
          setSaveCount((count) => Math.max(0, count - 1));
          toast.success('Removed from saved guides');
        } else {
          setSavedGuides((prev) => [payload, ...prev]);
          setSaveCount((count) => count + 1);
          toast.success('Guide saved!');
        }
        return;
      }

      const storageKey = `choosify_saved_${options.entityType}`;
      try {
        const raw = localStorage.getItem(storageKey);
        const list: Array<{ id: string | number }> = raw ? JSON.parse(raw) : [];
        if (isSaved) {
          localStorage.setItem(
            storageKey,
            JSON.stringify(list.filter((item) => String(item.id) !== String(options.entityId))),
          );
          setSaveCount((count) => Math.max(0, count - 1));
          toast.success('Removed from saved items');
        } else {
          localStorage.setItem(storageKey, JSON.stringify([payload, ...list]));
          setSaveCount((count) => count + 1);
          toast.success('Saved for later');
        }
      } catch {
        toast.error('Could not update saved items');
      }
    },
    [isSaved, options.entityId, options.entityType, options.payload, setSavedGuides, setSavedProducts],
  );

  const share = useCallback(
    (event?: React.MouseEvent, url?: string) => {
      event?.stopPropagation();
      event?.preventDefault();
      const target = url ?? (typeof window !== 'undefined' ? window.location.href : '');
      navigator.clipboard.writeText(target);
      toast.success('Link copied to clipboard');
    },
    [],
  );

  return {
    loveCount,
    saveCount,
    hasLoved,
    isSaved,
    toggleLove,
    toggleSave,
    share,
  };
}
