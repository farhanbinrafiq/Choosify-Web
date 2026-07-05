import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { BreadcrumbItem } from '../lib/seoHelpers';

export type BreadcrumbPageConfig = {
  hidden?: boolean;
  labels?: Record<string, string>;
  insertBeforeLast?: BreadcrumbItem[];
  replaceItems?: BreadcrumbItem[] | null;
};

type BreadcrumbContextValue = {
  pageConfig: BreadcrumbPageConfig;
  setPageConfig: (config: BreadcrumbPageConfig) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [pageConfig, setPageConfigState] = useState<BreadcrumbPageConfig>({});

  const setPageConfig = useCallback((config: BreadcrumbPageConfig) => {
    setPageConfigState(config);
  }, []);

  const value = useMemo(
    () => ({ pageConfig, setPageConfig }),
    [pageConfig, setPageConfig],
  );

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
}

export function useBreadcrumbContext() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error('useBreadcrumbContext must be used within BreadcrumbProvider');
  }
  return ctx;
}

/** Let a page inject extra crumbs (e.g. product category) or override labels */
export function usePageBreadcrumbs(
  config: BreadcrumbPageConfig,
  deps: React.DependencyList = [],
) {
  const { setPageConfig } = useBreadcrumbContext();

  React.useEffect(() => {
    setPageConfig(config);
    return () => setPageConfig({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function mergeBreadcrumbItems(
  base: BreadcrumbItem[],
  config: BreadcrumbPageConfig,
): BreadcrumbItem[] {
  if (config.replaceItems) return config.replaceItems;

  let items = base.map((crumb) => ({
    ...crumb,
    name: config.labels?.[crumb.path] ?? crumb.name,
  }));

  if (config.insertBeforeLast?.length && items.length > 0) {
    const last = items[items.length - 1];
    items = [...items.slice(0, -1), ...config.insertBeforeLast, last];
  }

  return items;
}
