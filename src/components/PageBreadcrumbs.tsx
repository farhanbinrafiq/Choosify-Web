import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { mergeBreadcrumbItems, useBreadcrumbContext } from '../context/BreadcrumbContext';
import { useBreadcrumbItems } from '../hooks/useBreadcrumbItems';
import { cn } from '../lib/utils';

/** Site-wide breadcrumb bar — mount once in PageWrapper */
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
        'w-full border-b border-gray-100 bg-gradient-to-b from-[#f4f6fa] to-[#eef1f8]/80',
        className,
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-4">
        <ol className="flex flex-wrap items-center gap-2 text-[12px] font-medium tracking-tight text-[#9AA0AC] list-none m-0 p-0">
          {items.map((crumb, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${crumb.path}-${index}`} className="flex items-center gap-2 min-w-0">
                {index > 0 && (
                  <ChevronRight size={12} className="shrink-0 text-gray-300" aria-hidden />
                )}
                {isLast ? (
                  <span
                    className="text-[#EB4501] truncate max-w-[min(100%,28rem)]"
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-[#CF4400] transition-colors truncate max-w-[min(100%,16rem)] text-gray-400"
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
