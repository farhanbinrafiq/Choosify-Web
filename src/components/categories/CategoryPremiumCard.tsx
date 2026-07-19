import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getCategoryImage } from '../../lib/categoryImages';
import type { CategoryStatBlock } from '../../utils/categoryStats';
import type { CategorySubcategory } from '../../utils/categoryDisplay';

export type CategoryPremiumCardProps = {
  name: string;
  stats: CategoryStatBlock;
  icon: string;
  image?: string;
  subcategories?: CategorySubcategory[];
  featuredBrand?: string;
  onClick?: () => void;
  className?: string;
};

const SUBCAT_PREVIEW = 5;

/** Choosify.dc.html Categories tile — image, stats, inline subcats, Featured Brand footer */
export function CategoryPremiumCard({
  name,
  stats,
  image,
  subcategories = [],
  featuredBrand,
  onClick,
  className,
}: CategoryPremiumCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const featured = featuredBrand || name.split(/\s+/)[0] || 'Brand';
  const featuredInitial = featured.charAt(0).toUpperCase();
  const visible = expanded ? subcategories : subcategories.slice(0, SUBCAT_PREVIEW);
  const hasMore = subcategories.length > SUBCAT_PREVIEW;
  const moreLabel = expanded
    ? 'Show less'
    : `Show all (${subcategories.length - SUBCAT_PREVIEW})`;

  const openCategory = () => {
    if (onClick) onClick();
    else navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  const openSub = (subName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(
      `/products?category=${encodeURIComponent(name)}&subcategory=${encodeURIComponent(subName)}`,
    );
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl overflow-hidden border border-[#E8EDF2] flex flex-col h-full',
        className,
      )}
    >
      <button
        type="button"
        onClick={openCategory}
        className="relative h-[120px] w-full overflow-hidden bg-[#F4F7F9] border-0 p-0 cursor-pointer"
        aria-label={`Browse ${name}`}
      >
        <img
          src={getCategoryImage(name, image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </button>

      <div className="px-4 pt-5 pb-4 flex-1 flex flex-col">
        <button
          type="button"
          onClick={openCategory}
          className="text-left text-[14px] font-bold text-[#1A1A2E] mb-0.5 border-0 bg-transparent p-0 cursor-pointer hover:text-[#CF4400]"
        >
          {name}
        </button>
        <div className="text-[11px] text-[#9AA0AC] mb-3">
          {stats.products.toLocaleString()}{' '}
          <span className="text-[#1A1A2E] font-semibold">Products</span>
          {' · '}
          {stats.brands} <span className="text-[#1A1A2E] font-semibold">Brands</span>
        </div>

        {visible.map((sub) => (
          <button
            key={sub.name}
            type="button"
            onClick={(e) => openSub(sub.name, e)}
            className="block w-full text-left text-[12px] text-[#4B5563] mb-2 border-0 bg-transparent p-0 cursor-pointer hover:text-[#CF4400]"
          >
            {sub.name}
          </button>
        ))}

        {hasMore && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="text-left text-[11.5px] font-bold text-[#EB4501] mt-0.5 border-0 bg-transparent p-0 cursor-pointer hover:brightness-110"
          >
            {moreLabel}
          </button>
        )}
      </div>

      <Link
        to={`/brands?q=${encodeURIComponent(featured)}`}
        className="mt-auto bg-[#2323FF] text-white px-4 py-3 flex items-center gap-2.5 no-underline hover:brightness-110"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-extrabold shrink-0">
          {featuredInitial}
        </div>
        <div className="text-[11px] text-white/85 min-w-0">
          Featured Brand:{' '}
          <span className="text-white font-extrabold">{featured}</span>
        </div>
      </Link>
    </div>
  );
}
