import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { HomepageConfig, SiteConfig } from '../types/catalog';
import {
  CMS_PREVIEW_MESSAGE_TYPE,
  fetchCmsPreview,
  getCmsPreviewParentOrigins,
  isValidCmsPreviewToken,
  postCmsPreviewReady,
  type CmsPreviewDraftMessage,
} from '../lib/cmsPreview';

export type CmsDraftPreviewContextValue = {
  isPreviewMode: boolean;
  homepageOverride: HomepageConfig | null;
  siteOverride: SiteConfig | null;
  token: string | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
};

const CmsDraftPreviewContext = createContext<CmsDraftPreviewContextValue | null>(null);

type ProviderProps = {
  token: string;
  children: React.ReactNode;
};

export function CmsDraftPreviewProvider({ token, children }: ProviderProps) {
  const [homepageOverride, setHomepageOverride] = useState<HomepageConfig | null>(null);
  const [siteOverride, setSiteOverride] = useState<SiteConfig | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const applyDraft = useCallback((homepage?: HomepageConfig | null, site?: SiteConfig | null) => {
    if (homepage) setHomepageOverride(homepage);
    if (site) setSiteOverride(site);
  }, []);

  useEffect(() => {
    if (!isValidCmsPreviewToken(token)) {
      setStatus('error');
      setError('Preview unavailable');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetchCmsPreview(token)
      .then((session) => {
        if (cancelled) return;
        setHomepageOverride(session.homepage);
        setSiteOverride(session.site);
        setStatus('ready');
        // Notify allowlisted parents (and * as fallback for iframe boot).
        const parents = getCmsPreviewParentOrigins();
        if (parents.length) {
          parents.forEach((origin) => postCmsPreviewReady(token, origin));
        } else {
          postCmsPreviewReady(token, '*');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Preview unavailable');
        setHomepageOverride(null);
        setSiteOverride(null);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!isValidCmsPreviewToken(token)) return;
    const allowlist = new Set(getCmsPreviewParentOrigins());

    const onMessage = (event: MessageEvent) => {
      if (!allowlist.has(event.origin)) return;
      const data = event.data as CmsPreviewDraftMessage | null;
      if (!data || typeof data !== 'object') return;
      if (data.type !== CMS_PREVIEW_MESSAGE_TYPE) return;
      if (data.token !== token) return;
      applyDraft(data.homepage ?? null, data.site ?? null);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [token, applyDraft]);

  const value = useMemo<CmsDraftPreviewContextValue>(
    () => ({
      isPreviewMode: true,
      homepageOverride,
      siteOverride,
      token,
      status,
      error,
    }),
    [homepageOverride, siteOverride, token, status, error],
  );

  return (
    <CmsDraftPreviewContext.Provider value={value}>{children}</CmsDraftPreviewContext.Provider>
  );
}

/** Soft optional — returns null outside the draft preview provider. */
export function useOptionalCmsDraftPreview(): CmsDraftPreviewContextValue | null {
  return useContext(CmsDraftPreviewContext);
}

export function useCmsDraftPreview(): CmsDraftPreviewContextValue {
  const ctx = useContext(CmsDraftPreviewContext);
  if (!ctx) {
    throw new Error('useCmsDraftPreview must be used within CmsDraftPreviewProvider');
  }
  return ctx;
}
