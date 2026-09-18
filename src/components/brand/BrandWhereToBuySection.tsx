import React from 'react';
import type { CatalogBrandStores } from '../../types/catalog';

type StoreRow = {
  name: string;
  location: string;
  status?: string;
};

type DistributorRow = {
  name: string;
  type: string;
  region: string;
};

type ServiceRow = {
  name: string;
  location: string;
  hours: string;
};

/**
 * Real seller-entered stores/distributors/service-centers only (brand.stores
 * via Brand Studio) — no hardcoded store names, and no real-world third-party
 * company names (the old fallback literally listed "Ryans Computers", "Star
 * Tech & Engineering", etc. as if they distributed for every brand). Whole
 * section is hidden when the seller hasn't entered anything in any of the
 * three categories; an individual category with no entries renders nothing
 * for that category rather than falling back to mock rows.
 */
export function BrandWhereToBuySection({
  brandName,
  stores: catalogStores,
}: {
  brandName: string;
  stores?: CatalogBrandStores;
}) {
  const stores: StoreRow[] = (catalogStores?.authorized ?? []).map((s) => ({ name: s.name, location: s.sub || '' }));
  const distributors: DistributorRow[] = (catalogStores?.distributors ?? []).map((s) => ({ name: s.name, type: '', region: s.sub || '' }));
  const services: ServiceRow[] = (catalogStores?.serviceCenters ?? []).map((s) => ({ name: s.name, location: s.sub || '', hours: s.hours || '' }));

  const hasAnyData = stores.length > 0 || distributors.length > 0 || services.length > 0;
  if (!hasAnyData) return null;

  return (
    <div id="store-location-section" className="scroll-mt-36 w-full">
      <h3 className="text-[15px] font-extrabold text-[#1A1A2E] mb-3.5">
        WHERE TO BUY {brandName.toUpperCase()}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {stores.length > 0 && (
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden">
          <div className="text-[11px] font-extrabold text-white choosify-dark-surface px-2.5 py-1.5">
            AUTHORIZED STORES
          </div>
          <div className="p-[18px] pt-3">
          {stores.map((row) => (
            <div
              key={row.name}
              className="flex justify-between items-center py-2 border-b border-[#F1F1F3] gap-2.5 last:border-0"
            >
              <div className="min-w-0">
                <div className="text-[11.5px] font-bold text-[#1A1A2E]">{row.name}</div>
                <div className="text-[10px] text-[#9AA0AC]">{row.location}</div>
                {row.status && (
                  <div
                    className={`text-[10px] font-bold ${
                      row.status === 'Open Now' ? 'text-[#07DD05]' : 'text-[#9AA0AC]'
                    }`}
                  >
                    {row.status}
                  </div>
                )}
              </div>
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-white text-[#18154C] border border-[#E5E7EB] px-3 py-1.5 rounded-md text-[10.5px] font-bold whitespace-nowrap no-underline hover:border-[#18154C]/30 transition-colors"
              >
                View Map
              </a>
            </div>
          ))}
          </div>
        </div>
        )}

        {distributors.length > 0 && (
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden">
          <div className="text-[11px] font-extrabold text-white choosify-dark-surface px-2.5 py-1.5">
            DISTRIBUTORS & RESELLERS
          </div>
          <div className="p-[18px] pt-3">
          {distributors.map((row) => (
            <div
              key={row.name}
              className="flex justify-between items-center py-2 border-b border-[#F1F1F3] gap-2.5 last:border-0"
            >
              <div className="min-w-0">
                <div className="text-[11.5px] font-bold text-[#1A1A2E]">{row.name}</div>
                {row.type && <div className="text-[10px] text-[#9AA0AC]">{row.type}</div>}
                {row.region && <div className="text-[10px] font-bold text-[#4B5563]">{row.region}</div>}
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="shrink-0 bg-white text-[#18154C] border border-[#E5E7EB] px-3 py-1.5 rounded-md text-[10.5px] font-bold whitespace-nowrap no-underline hover:border-[#18154C]/30 transition-colors"
              >
                Visit Website
              </a>
            </div>
          ))}
          </div>
        </div>
        )}

        {services.length > 0 && (
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden">
          <div className="text-[11px] font-extrabold text-white choosify-dark-surface px-2.5 py-1.5">
            SERVICE CENTERS
          </div>
          <div className="p-[18px] pt-3">
          {services.map((row) => (
            <div
              key={row.name}
              className="flex justify-between items-center py-2 border-b border-[#F1F1F3] gap-2.5 last:border-0"
            >
              <div className="min-w-0">
                <div className="text-[11.5px] font-bold text-[#1A1A2E]">{row.name}</div>
                <div className="text-[10px] text-[#9AA0AC]">{row.location}</div>
              </div>
              <span className="shrink-0 bg-white text-[#18154C] border border-[#E5E7EB] px-3 py-1.5 rounded-md text-[10.5px] font-bold whitespace-nowrap">
                {row.hours}
              </span>
            </div>
          ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
