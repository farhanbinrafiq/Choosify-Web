import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { DcHomeBlock } from '../DcHomePanel';
import { PLACEHOLDER_IMAGE } from '../../../constants';

interface HomeRecentlyViewedSectionProps {
  products: any[];
}

/** Choosify.dc.html — 6-col product tiles with price */
export function HomeRecentlyViewedSection({ products }: HomeRecentlyViewedSectionProps) {
  if (!products.length) return null;

  return (
    <DcHomeBlock id="section-recently-viewed" className="pb-10">
      <h2
        id="section-recently-viewed-heading"
        className="text-[19px] font-extrabold text-[#1A1A2E] mb-4"
      >
        Recently Viewed
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug ?? product.id}`}
            className="bg-white rounded-[10px] overflow-hidden border border-[#E8EDF2] hover:border-[#EB4501]/35 transition-colors"
          >
            <div className="relative h-[150px] bg-[#F4F7F9]">
              <img
                src={product.image || PLACEHOLDER_IMAGE}
                alt={product.title}
                className="w-full h-full object-contain p-3"
                loading="lazy"
              />
              <span className="absolute top-2 right-2 w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center text-[#EB4501] shadow-sm">
                <Heart size={13} className="text-[#EB4501]" strokeWidth={2} />
              </span>
            </div>
            <div className="px-3 py-2.5 pb-3.5">
              <div className="text-[13px] font-extrabold text-[#EB4501]">
                {typeof product.price === 'number'
                  ? `BDT ${product.price.toLocaleString()}`
                  : product.price || '—'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DcHomeBlock>
  );
}
