import { useCallback, useState } from 'react';
import type { SpotlightSaveRecord } from '../types/spotlight/discovery/save';
import { listSaves, toggleSave } from '../utils/spotlightUserSignals';

export function useSpotlightSave() {
  const [saves, setSaves] = useState<SpotlightSaveRecord[]>(listSaves);

  const save = useCallback((record: Omit<SpotlightSaveRecord, 'savedAt'>) => {
    toggleSave(record);
    setSaves(listSaves());
  }, []);

  const isSaved = useCallback(
    (targetKind: SpotlightSaveRecord['targetKind'], targetId: string) =>
      saves.some((s) => s.targetKind === targetKind && s.targetId === targetId),
    [saves],
  );

  return { saves, save, isSaved };
}
