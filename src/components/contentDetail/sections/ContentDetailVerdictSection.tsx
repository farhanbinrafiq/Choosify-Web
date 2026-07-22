import React from 'react';
import { Check, X, Star, Info } from 'lucide-react';
import type { ContentDetailSectionConfig } from '../../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from '../contentDetailSectionContext';

function ListCard({
  title,
  icon,
  colorClass,
  dotClass,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  dotClass: string;
  items: string[];
}) {
  return (
    <div className="bg-white rounded-[5px] border border-gray-100 p-5 text-left shadow-sm">
      <span className={`text-[11px] font-extrabold ${colorClass} flex items-center gap-1.5 mb-2`}>
        {icon} {title}
      </span>
      <ul className="space-y-1.5 pl-1.5 list-none">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-[12px] font-bold text-[#1A1A2E]/70 flex items-center gap-1.5"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass} shrink-0`} /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContentDetailVerdictSection({
  section,
  ctx,
}: {
  section: ContentDetailSectionConfig;
  ctx: ContentDetailSectionContext;
}) {
  const data = section.data;
  const bestFor =
    data?.bestFor?.length
      ? data.bestFor
      : ['High daily usage & professionals', 'Premium display enthusiasts', 'Zero hassle long-term support'];
  const notFor =
    data?.notFor?.length
      ? data.notFor
      : ['Ultra-tight budget buyers', 'Compact pocket lovers', 'Sourcing-indifferent shoppers'];
  const whatWeLike =
    data?.whatWeLike?.length
      ? data.whatWeLike
      : ctx.content
        ? ['Exquisite screen brightness', 'Stunning camera outputs', 'Superfast thermal cooling']
        : ['Exquisite screen brightness', 'Stunning camera outputs', 'Superfast thermal cooling'];
  const whatToConsider =
    data?.whatToConsider?.length
      ? data.whatToConsider
      : [
          'High stock demand limits',
          'Explicit premium price bar',
          'Requires premium charger/accessories',
        ];

  return (
    <div id="quick-verdict" className="scroll-mt-36">
      <div className="mb-4 text-left">
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-0.5">
          Recommendation & quick verdict
        </h2>
        <p className="text-[13px] font-bold text-[#9AA0AC]">High level, scannable advice</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ListCard
          title="Best for"
          icon={<Check size={12} className="text-emerald-500" />}
          colorClass="text-emerald-500"
          dotClass="bg-emerald-500"
          items={bestFor}
        />
        <ListCard
          title="Not for"
          icon={<X size={12} className="text-red-500" />}
          colorClass="text-red-500"
          dotClass="bg-red-400"
          items={notFor}
        />
        <ListCard
          title="What we like"
          icon={<Star size={12} className="text-blue-500" />}
          colorClass="text-blue-500"
          dotClass="bg-blue-500"
          items={whatWeLike}
        />
        <ListCard
          title="What to consider"
          icon={<Info size={12} className="text-[#EB4501]" />}
          colorClass="text-[#EB4501]"
          dotClass="bg-[#EB4501]/50"
          items={whatToConsider}
        />
      </div>
    </div>
  );
}
