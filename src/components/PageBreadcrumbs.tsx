import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { mergeBreadcrumbItems, useBreadcrumbContext } from '../context/BreadcrumbContext';
import { useBreadcrumbItems } from '../hooks/useBreadcrumbItems';
import { cn } from '../lib/utils';

/**
 * Site-wide breadcrumb bar — mounted once in `PageWrapper` (`App.tsx`).
 * Do not add `<nav aria-label="Breadcrumb">` in page components; use `usePageBreadcrumbs()`
 * for custom trails, or `usePageBreadcrumbs({ hidden: true })` when a page renders its own
 * in-hero breadcrumb (e.g. checkout).
 */
export function PageBreadcrumbsBar({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const { pageConfig } = useBreadcrumbContext();
  const baseItems = useBreadcrumbItems(pageConfig.labels ?? {});

  const items = mergeBreadcrumbItems(baseItems, pageConfig);

  if (pageConfig.hidden || pathname === '/' || pathname.startsWith('/messages') || items.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'choosify-chrome-header w-full border-b border-white/[0.06]',
        className,
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-4">
        <ol className="flex flex-wrap items-center gap-2 text-[12px] font-medium tracking-tight text-white/70 list-none m-0 p-0">
          {items.map((crumb, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${crumb.path}-${index}`} className="flex items-center gap-2 min-w-0">
                {index > 0 && (
                  <ChevronRight size={12} className="shrink-0 text-white/35" aria-hidden />
                )}
                {isLast ? (
                  <span
                    className="text-white truncate max-w-[min(100%,28rem)]"
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-white transition-colors truncate max-w-[min(100%,16rem)] text-white/60"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
