import React from 'react';

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

function buildWhereToBuy(brandName: string) {
  const n = brandName;
  return {
    stores: [
      { name: `${n} Store Gulshan`, location: 'Gulshan-2, Dhaka', status: 'Open Now' },
      { name: `${n} Store Bashundhara`, location: 'Bashundhara City, Dhaka', status: 'Open Now' },
      { name: `${n} Store Chattogram`, location: 'GEC Circle, Chattogram', status: 'Open Now' },
      { name: `${n} Store Sylhet`, location: 'Zindabazar, Sylhet', status: 'Closed' },
    ] as StoreRow[],
    distributors: [
      { name: 'Ryans Computers', type: 'Authorized Distributor', region: 'Nationwide' },
      { name: 'Star Tech & Engineering', type: 'Authorized Reseller', region: 'Nationwide' },
      { name: 'Pickaboo', type: 'Online Reseller', region: 'Nationwide' },
      { name: 'Global Brand Pvt. Ltd.', type: 'Authorized Distributor', region: 'Dhaka & Chattogram' },
    ] as DistributorRow[],
    services: [
      { name: `${n} Care Dhaka`, location: 'Banani, Dhaka', hours: '10AM–8PM' },
      { name: `${n} Care Chattogram`, location: 'Agrabad, Chattogram', hours: '10AM–7PM' },
      { name: `${n} Care Sylhet`, location: 'Zindabazar, Sylhet', hours: '10AM–7PM' },
      { name: `${n} Care Khulna`, location: 'Shib Bari, Khulna', hours: '10AM–6PM' },
    ] as ServiceRow[],
  };
}

export function BrandWhereToBuySection({ brandName }: { brandName: string }) {
  const { stores, distributors, services } = buildWhereToBuy(brandName);

  return (
    <div id="store-location-section" className="scroll-mt-36 w-full">
      <h3 className="text-[15px] font-extrabold text-[#1A1A2E] mb-3.5">
        WHERE TO BUY {brandName.toUpperCase()}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
          <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">
            AUTHORIZED STORES
          </div>
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
                className="shrink-0 bg-[#EB4501] text-white border-0 px-3 py-1.5 rounded-md text-[10.5px] font-bold whitespace-nowrap no-underline"
              >
                View Map
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
          <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">
            DISTRIBUTORS & RESELLERS
          </div>
          {distributors.map((row) => (
            <div
              key={row.name}
              className="flex justify-between items-center py-2 border-b border-[#F1F1F3] gap-2.5 last:border-0"
            >
              <div className="min-w-0">
                <div className="text-[11.5px] font-bold text-[#1A1A2E]">{row.name}</div>
                <div className="text-[10px] text-[#9AA0AC]">{row.type}</div>
                <div className="text-[10px] font-bold text-[#4B5563]">{row.region}</div>
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="shrink-0 bg-[#2323FF] text-white border-0 px-3 py-1.5 rounded-md text-[10.5px] font-bold whitespace-nowrap no-underline"
              >
                Visit Website
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
          <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">
            SERVICE CENTERS
          </div>
          {services.map((row) => (
            <div
              key={row.name}
              className="flex justify-between items-center py-2 border-b border-[#F1F1F3] gap-2.5 last:border-0"
            >
              <div className="min-w-0">
                <div className="text-[11.5px] font-bold text-[#1A1A2E]">{row.name}</div>
                <div className="text-[10px] text-[#9AA0AC]">{row.location}</div>
              </div>
              <span className="shrink-0 bg-[#07DD05] text-white px-3 py-1.5 rounded-md text-[10.5px] font-bold whitespace-nowrap">
                {row.hours}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
