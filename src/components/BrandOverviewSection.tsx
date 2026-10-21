import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { OverviewListItem } from './OverviewListIcon';

interface OverviewData {
  /** "About this brand" from Brand Studio (brand.description). */
  about?: string;
  /** "Guarantees & credentials" from Brand Studio (brand.credentials). */
  credentials?: string;
  address?: string;
  website?: string;
  map: string;
  email?: string;
  phone?: string;
  priceRange?: string;
  ageRange?: string;
  audience?: string;
  services: string[];
  tags: string[];
}

interface BrandOverviewSectionProps {
  brandName: string;
  overviewData: OverviewData;
}

/**
 * Every card here is real seller-entered data (brand.overview via Brand
 * Studio) — there is no prototype/name-keyed fallback content anymore. A
 * card is only rendered when it actually has something to show; if the
 * seller hasn't filled in ANY overview field, the whole section is hidden.
 * Community / claim state is shown by CommunityProfileNotice on the page,
 * driven by the server's ownership state.
 */
export function BrandOverviewSection({ brandName, overviewData }: BrandOverviewSectionProps) {
  const { customOverviews } = useDashboard();
  const brandCustoms = customOverviews ? customOverviews.filter(
    co => co.targetType === 'brand' && co.targetId.toLowerCase() === brandName.toLowerCase()
  ) : [];

  const hasAbout = Boolean(overviewData.about);
  const hasCredentials = Boolean(overviewData.credentials);
  const hasAddressCard = Boolean(overviewData.address || overviewData.website);
  const hasContactCard = Boolean(overviewData.email || overviewData.phone);
  const hasPriceAudienceCard = Boolean(overviewData.priceRange || overviewData.ageRange || overviewData.audience);
  const hasServices = overviewData.services.length > 0;
  const hasTags = overviewData.tags.length > 0;
  const hasAnyOverview =
    hasAbout || hasCredentials || hasAddressCard || hasContactCard || hasPriceAudienceCard || hasServices || hasTags || brandCustoms.length > 0;

  if (!hasAnyOverview) {
    return null;
  }

  return (
    <div id="brand-overview-section" className="scroll-mt-36 w-full">
      {hasAnyOverview && (
        <>
          <div className="mb-3.5 text-left">
            <h3 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight mb-0.5">
              BRAND OVERVIEW
            </h3>
            <p className="text-[11.5px] text-[#9AA0AC] m-0">
              About {brandName}
            </p>
          </div>

          {hasAbout && (
            <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] mb-3.5 text-left">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                  <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                </div>
                <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">About {brandName}</h4>
              </div>
              <p className="text-[12.5px] text-[#4B5563] leading-relaxed whitespace-pre-line m-0">{overviewData.about}</p>
            </div>
          )}

          {hasCredentials && (
            <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] mb-3.5 text-left">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                  <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                </div>
                <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Guarantees &amp; Credentials</h4>
              </div>
              <p className="text-[12.5px] text-[#4B5563] leading-relaxed whitespace-pre-line m-0">{overviewData.credentials}</p>
            </div>
          )}

          {(hasAddressCard || hasContactCard || hasPriceAudienceCard) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8 text-left">
              {/* 1. Address & Links */}
              {hasAddressCard && (
                <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                        <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                      </div>
                      <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Shop Address & Links</h4>
                    </div>
                    <div className="text-[11.5px] text-[#6B7280] font-semibold leading-relaxed space-y-2">
                      {overviewData.address && <p className="uppercase text-[#1A1A2E]">{overviewData.address}</p>}
                      {overviewData.website && (
                        <div>
                          <span className="text-[#FF5B00] font-extrabold">WEBSITE:</span>{' '}
                          <a href={`https://${overviewData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1A1A2E]">
                            {overviewData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  {overviewData.address && (
                    <div className="mt-4 pt-4 border-t border-[#F1F1F3]">
                      <a href={overviewData.map} target="_blank" rel="noopener noreferrer" className="text-[10.5px] font-extrabold text-[#FF5B00] uppercase tracking-wider hover:underline flex items-center gap-1">
                        Open on Maps <span>➜</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Contact Information */}
              {hasContactCard && (
                <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                        <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                      </div>
                      <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Contact Informations</h4>
                    </div>
                    <div className="text-[11.5px] text-[#6B7280] font-semibold leading-relaxed space-y-3">
                      {overviewData.email && (
                        <p className="flex items-center gap-2 truncate"><span className="text-[#1A1A2E] font-extrabold">EMAIL:</span> {overviewData.email}</p>
                      )}
                      {overviewData.phone && (
                        <p className="flex items-center gap-2"><span className="text-[#1A1A2E] font-extrabold">PHONE:</span> {overviewData.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Price Range & Audience */}
              {hasPriceAudienceCard && (
                <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                        <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                      </div>
                      <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Price & Audience</h4>
                    </div>
                    <div className="text-[11.5px] text-[#6B7280] font-semibold leading-relaxed space-y-2">
                      {overviewData.priceRange && (
                        <p><span className="text-[#1A1A2E] font-extrabold">BDT</span> - {overviewData.priceRange.replace('BDT - ', '')}</p>
                      )}
                      {overviewData.ageRange && <p className="uppercase text-[#1A1A2E]">{overviewData.ageRange}</p>}
                      {overviewData.audience && <p className="uppercase text-[#FF5B00]">{overviewData.audience}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {(hasServices || hasTags) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
              {/* 4. Services & Specialties */}
              {hasServices && (
                <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2]">
                  <div className="flex items-center gap-2.5 mb-4 border-b border-[#F1F1F3] pb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                      <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                    </div>
                    <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Services & Specialties</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {overviewData.services.map((srv, idx) => (
                      <OverviewListItem
                        key={idx}
                        text={srv}
                        className="text-[10.5px] text-[#6B7280] font-semibold uppercase tracking-wide"
                        iconSize={12}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Best For #Tags */}
              {hasTags && (
                <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2]">
                  <div className="flex items-center gap-2.5 mb-4 border-b border-[#F1F1F3] pb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                      <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                    </div>
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A00C4]">Best For #Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {overviewData.tags.map((tag, idx) => (
                      <span key={idx} className="choosify-best-for-tag text-[9px] font-extrabold px-3 py-1.5 rounded-md uppercase tracking-wider border select-none">
                        #{tag.replace(/^#+/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. Dynamic Custom Overviews */}
          {brandCustoms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left mt-3.5">
              {brandCustoms.map((co, idx) => (
                <div key={idx} className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2]">
                  <div className="flex items-center gap-2.5 mb-4 border-b border-[#F1F1F3] pb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center">
                      <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                    </div>
                    <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">{co.sectionName}</h4>
                  </div>
                  <div className="space-y-2.5">
                    {co.content.map((bullet, bIdx) => (
                      <OverviewListItem
                        key={bIdx}
                        text={bullet}
                        className="text-[10.5px] text-[#6B7280] font-semibold uppercase tracking-wide"
                        iconSize={12}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
