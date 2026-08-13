import type { HomepageConfig, SiteConfig } from '../types/catalog';

export const CMS_PREVIEW_MESSAGE_TYPE = 'choosify-cms-preview-draft' as const;
export const CMS_PREVIEW_READY_TYPE = 'choosify-cms-preview-ready' as const;

const DEFAULT_PARENT_ORIGINS = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

function readEnv(key: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env || {};
  return String(env[key] || '').trim();
}

export function getCmsPreviewApiBase(): string {
  return (readEnv('VITE_API_BASE_URL') || '/api/v1').replace(/\/$/, '');
}

/** Parent origins allowed to push draft overrides via postMessage. */
export function getCmsPreviewParentOrigins(): string[] {
  const raw = readEnv('VITE_CMS_PREVIEW_PARENT_ORIGINS');
  if (!raw) return [...DEFAULT_PARENT_ORIGINS];
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export type CmsPreviewSessionPayload = {
  token: string;
  expiresAt: string;
  homepage: HomepageConfig;
  site: SiteConfig;
};

export type CmsPreviewDraftMessage = {
  type: typeof CMS_PREVIEW_MESSAGE_TYPE;
  token: string;
  homepage?: HomepageConfig | null;
  site?: SiteConfig | null;
  expiresAt?: string | null;
};

export type CmsPreviewReadyMessage = {
  type: typeof CMS_PREVIEW_READY_TYPE;
  token: string;
};

export function isValidCmsPreviewToken(token: string | null | undefined): token is string {
  return typeof token === 'string' && token.trim().length >= 32;
}

/** GET draft snapshot for an opaque preview session token. */
export async function fetchCmsPreview(token: string): Promise<CmsPreviewSessionPayload> {
  const response = await fetch(
    `${getCmsPreviewApiBase()}/catalog/cms-preview/session/${encodeURIComponent(token)}`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    },
  );
  if (!response.ok) {
    throw new Error(
      response.status === 401 || response.status === 404
        ? 'Preview session expired or invalid'
        : `Preview unavailable (${response.status})`,
    );
  }
  const body = await response.json();
  const preview = body?.preview ?? body?.data ?? body;
  if (!preview?.token || !preview?.homepage || !preview?.site) {
    throw new Error('Invalid preview payload');
  }
  return {
    token: String(preview.token),
    expiresAt: String(preview.expiresAt || ''),
    homepage: preview.homepage as HomepageConfig,
    site: preview.site as SiteConfig,
  };
}

export function postCmsPreviewReady(token: string, targetOrigin = '*'): void {
  if (typeof window === 'undefined' || !window.parent || window.parent === window) return;
  const message: CmsPreviewReadyMessage = { type: CMS_PREVIEW_READY_TYPE, token };
  try {
    window.parent.postMessage(message, targetOrigin);
  } catch {
    // ignore cross-origin / detached frame failures
  }
}
