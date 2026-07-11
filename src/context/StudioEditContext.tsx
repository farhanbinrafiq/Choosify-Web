import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { StudioKind } from '../types/studio';
import { getStudioSectionById } from '../data/studioSections';
import { useGlobalState } from './GlobalStateContext';
import { canAccessStudioEdit } from '../lib/platform/roles';

type StudioDraftStore = Record<string, string>;

type StudioEditContextValue = {
  studio: StudioKind | null;
  entityId: string;
  editMode: boolean;
  activeSectionId: string | null;
  openEditor: (sectionId: string) => void;
  closeEditor: () => void;
  getFieldValue: (sectionId: string, fieldId: string, fallback?: string) => string;
  setFieldValue: (sectionId: string, fieldId: string, value: string) => void;
  saveSectionDraft: (sectionId: string) => void;
  clearSectionDraft: (sectionId: string) => void;
};

const StudioEditContext = createContext<StudioEditContextValue | null>(null);

function draftStorageKey(studio: StudioKind | null, entityId: string, sectionId: string) {
  return `choosify_studio_draft_${studio ?? 'public'}_${entityId}_${sectionId}`;
}

function readDraft(studio: StudioKind | null, entityId: string, sectionId: string): StudioDraftStore {
  try {
    const raw = localStorage.getItem(draftStorageKey(studio, entityId, sectionId));
    return raw ? (JSON.parse(raw) as StudioDraftStore) : {};
  } catch {
    return {};
  }
}

function writeDraft(
  studio: StudioKind | null,
  entityId: string,
  sectionId: string,
  draft: StudioDraftStore,
) {
  localStorage.setItem(draftStorageKey(studio, entityId, sectionId), JSON.stringify(draft));
}

type StudioEditProviderProps = {
  children: React.ReactNode;
  studio?: StudioKind | null;
  entityId?: string;
  forcedEditMode?: boolean;
};

export function StudioEditProvider({
  children,
  studio = null,
  entityId = 'default',
  forcedEditMode = false,
}: StudioEditProviderProps) {
  const [searchParams] = useSearchParams();
  const { currentUser, isLoggedIn } = useGlobalState();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [draftRevision, setDraftRevision] = useState(0);

  const studioEditRequested = forcedEditMode || searchParams.get('studioEdit') === '1';
  const editMode = studioEditRequested && isLoggedIn && canAccessStudioEdit(currentUser.role);

  const openEditor = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  const closeEditor = useCallback(() => {
    setActiveSectionId(null);
  }, []);

  const getFieldValue = useCallback(
    (sectionId: string, fieldId: string, fallback = '') => {
      void draftRevision;
      const draft = readDraft(studio, entityId, sectionId);
      return draft[fieldId] ?? fallback;
    },
    [studio, entityId, draftRevision],
  );

  const setFieldValue = useCallback(
    (sectionId: string, fieldId: string, value: string) => {
      const draft = readDraft(studio, entityId, sectionId);
      draft[fieldId] = value;
      writeDraft(studio, entityId, sectionId, draft);
      setDraftRevision((prev) => prev + 1);
    },
    [studio, entityId],
  );

  const saveSectionDraft = useCallback(
    (sectionId: string) => {
      const section = getStudioSectionById(sectionId);
      if (!section) return;
      toast.success(`${section.label} draft saved`);
      setActiveSectionId(null);
    },
    [],
  );

  const clearSectionDraft = useCallback(
    (sectionId: string) => {
      localStorage.removeItem(draftStorageKey(studio, entityId, sectionId));
      setDraftRevision((prev) => prev + 1);
      toast.success('Draft cleared');
    },
    [studio, entityId],
  );

  const value = useMemo(
    () => ({
      studio,
      entityId,
      editMode,
      activeSectionId,
      openEditor,
      closeEditor,
      getFieldValue,
      setFieldValue,
      saveSectionDraft,
      clearSectionDraft,
    }),
    [
      studio,
      entityId,
      editMode,
      activeSectionId,
      openEditor,
      closeEditor,
      getFieldValue,
      setFieldValue,
      saveSectionDraft,
      clearSectionDraft,
    ],
  );

  return <StudioEditContext.Provider value={value}>{children}</StudioEditContext.Provider>;
}

export function useStudioEdit() {
  const context = useContext(StudioEditContext);
  if (!context) {
    return {
      studio: null,
      entityId: 'default',
      editMode: false,
      activeSectionId: null,
      openEditor: () => {},
      closeEditor: () => {},
      getFieldValue: (_sectionId: string, _fieldId: string, fallback = '') => fallback,
      setFieldValue: () => {},
      saveSectionDraft: () => {},
      clearSectionDraft: () => {},
    } satisfies StudioEditContextValue;
  }
  return context;
}
