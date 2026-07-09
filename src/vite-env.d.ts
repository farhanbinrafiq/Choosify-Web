/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ADSENSE_CLIENT?: string;
  readonly VITE_ADSENSE_SLOT_SIDEBAR?: string;
  readonly VITE_ADSENSE_SLOT_INFEED?: string;
  readonly VITE_ADSENSE_SLOT_RESPONSIVE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
