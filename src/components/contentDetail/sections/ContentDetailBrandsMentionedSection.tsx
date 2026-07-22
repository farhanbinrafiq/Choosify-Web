import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { getBrandsMentionedTitle } from '../../../lib/spotlight/content/categorySectionLabels';
import type { ContentDetailSectionConfig } from '../../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from '../contentDetailSectionContext';

/** Brands Mentioned — brand cards (buying guides / brand-forward content). */
export function ContentDetailBrandsMentionedSection({
  section,
  ctx,
}: {
  section: ContentDetailSectionConfig;
  ctx: ContentDetailSectionContext;
}) {
  const { allBrands } = useGlobalState();

  const brandIds =
    section.data?.brandIds?.length
      ? section.data.brandIds
      : ctx.content?.connections.brandIds ?? [];

  const brands = useMemo(() => {
    if (!brandIds.length) {
      // Derive from product brands when no explicit brand ids
      const names = new Set(
        ctx.products.map((p: any) => String(p.brand || p.brandName || '').trim()).filter(Boolean),
      );
      return (allBrands ?? []).filter((b: any) => names.has(String(b.name || '').trim())).slice(0, 8);
    }
    return brandIds
      .map((id) =>
        (allBrands ?? []).find(
          (b: any) => String(b.id) === String(id) || String(b.id) === String(Number(id)),
        ),
      )
      .filter(Boolean);
  }, [allBrands, brandIds, ctx.products]);

  if (!brands.length) return null;

  const title = getBrandsMentionedTitle(ctx.category ?? ctx.content?.category);

  return (
    <div id="brands-mentioned" className="scroll-mt-36">
      <div className="mb-3.5 text-left">
        <h2 className="text-[13px] font-extrabold text-[#1A1A2E] tracking-wide uppercase">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {brands.map((brand: any) => (
          <Link
            key={brand.id}
            to={`/brands/${brand.id}`}
            className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 text-center hover:border-[#EB4501]/40 transition-colors no-underline"
          >
            <div className="w-14 h-14 mx-auto mb-2.5 rounded-full bg-[#F4F7F9] overflow-hidden flex items-center justify-center">
              {brand.logo || brand.image ? (
                <img
                  src={brand.logo || brand.image}
                  alt=""
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[16px] font-extrabold text-[#EB4501]">
                  {String(brand.name || 'B').charAt(0)}
                </span>
              )}
            </div>
            <div className="text-[12px] font-extrabold text-[#1A1A2E] truncate">
              {brand.name}
            </div>
            {brand.category ? (
              <div className="text-[10px] text-[#9AA0AC] mt-0.5 truncate">{brand.category}</div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
