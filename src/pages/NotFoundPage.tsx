import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { EmiAiLogo } from '../components/EmiAiLogo';
import { useGlobalState } from '../context/GlobalStateContext';
import { CATEGORIES_LIST } from '../data/categoriesData';
import { buildPagePopularSearchTerms } from '../utils/pagePopularSearches';

type NotFoundChip = {
  label: string;
  to: string;
};

export type NotFoundPageProps = {
  /** `not-found` = classic 404; `error` = runtime crash using the same layout */
  variant?: 'not-found' | 'error';
  errorMessage?: string;
  onRetry?: () => void;
};

export default function NotFoundPage({
  variant = 'not-found',
  errorMessage,
  onRetry,
}: NotFoundPageProps = {}) {
  const { allCategories, allCatalogProducts, siteConfig } = useGlobalState();
  const isError = variant === 'error';

  const chips = useMemo((): NotFoundChip[] => {
    const categoryNames = (
      allCategories.length
        ? [...allCategories]
            .filter((c) => c.enabled !== false)
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map((c) => c.name)
        : CATEGORIES_LIST.map((c) => c.name)
    ).filter(Boolean);

    const categoryChips: NotFoundChip[] = categoryNames.slice(0, 12).map((name) => ({
      label: name,
      to: `/categories?category=${encodeURIComponent(name)}`,
    }));

    categoryChips.push({ label: 'More', to: '/categories' });

    const categoryKeys = new Set(categoryNames.map((n) => n.toLowerCase()));
    const keywordChips = buildPagePopularSearchTerms({
      cmsTerms: siteConfig?.popularSearches,
      products: allCatalogProducts,
      categoryNames,
      limit: 16,
    })
      .filter((term) => !categoryKeys.has(term.toLowerCase()))
      .slice(0, 8)
      .map((term) => ({
        label: term,
        to: `/search?q=${encodeURIComponent(term)}`,
      }));

    return [...categoryChips, ...keywordChips];
  }, [allCategories, allCatalogProducts, siteConfig?.popularSearches]);

  return (
    <section
      className="w-full min-h-[calc(100vh-5rem)] font-sans flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #fff 0%, #fff 48%, #000435 82%, #000435 100%)',
      }}
      aria-labelledby="not-found-heading"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center px-5 pt-10 pb-8 sm:pt-14 sm:pb-10">
        <h1
          id="not-found-heading"
          className="text-[100px] sm:text-[150px] font-extrabold leading-none tracking-tight text-[#000435]"
        >
          {isError ? 'Oops' : '404'}
        </h1>

        <p className="mt-3 sm:mt-4 text-[15px] sm:text-base font-medium text-[#6B7280]">
          {isError
            ? 'Something went wrong while loading this page.'
            : 'Oops! We couldn\u2019t find that page.'}
        </p>

        {isError && errorMessage ? (
          <p className="mt-2 max-w-md text-[13px] font-medium text-[#FF5B00]/90">{errorMessage}</p>
        ) : null}

        <p className="mt-2 text-[15px] sm:text-base font-medium text-[#6B7280]">
          {isError && onRetry ? (
            <>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 text-[#FF5B00] font-semibold underline underline-offset-2 hover:opacity-90"
              >
                <RefreshCcw size={14} /> Refresh
              </button>
              {' or return '}
            </>
          ) : (
            'Return '
          )}
          <Link
            to="/"
            className="text-[#FF5B00] font-semibold underline underline-offset-2 hover:opacity-90"
          >
            Home
          </Link>
        </p>

        <div className="mt-8 sm:mt-10 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] flex items-center justify-center">
          <EmiAiLogo size={260} title="Emi. A.I" className="w-full h-full" />
        </div>
      </div>

      <div className="w-full bg-[#000435] px-5 sm:px-8 lg:px-10 pt-6 pb-12 sm:pb-16">
        <p className="text-center text-[13px] sm:text-sm font-medium text-white/55 mb-5 sm:mb-6">
          Why not check out our top categories instead?
        </p>

        <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-start w-full">
          {chips.map((chip) => (
            <Link
              key={`${chip.to}-${chip.label}`}
              to={chip.to}
              className="inline-flex items-center text-white text-[12px] sm:text-[13px] font-semibold hover:bg-white/20 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 20,
                padding: '9px 18px',
              }}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
