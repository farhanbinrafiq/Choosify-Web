import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { SpotlightBreadcrumb } from '../../../types/spotlight/discovery/navigation';

interface SpotlightBreadcrumbsProps {
  items: SpotlightBreadcrumb[];
  className?: string;
}

export function SpotlightBreadcrumbs({ items, className }: SpotlightBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-400">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} aria-hidden className="text-gray-300" />}
            {item.href ? (
              <Link to={item.href} className="font-bold uppercase hover:text-[#E8500A] focus:outline-none focus-visible:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
