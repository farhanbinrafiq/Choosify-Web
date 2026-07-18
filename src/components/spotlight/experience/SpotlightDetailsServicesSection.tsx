import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import { cn } from '../../../lib/utils';

const SERVICE_LABELS: Record<string, string> = {
  hotel: 'Hotel & Stay',
  restaurant: 'Restaurant',
  travel: 'Travel Package',
  healthcare: 'Healthcare',
  education: 'Education',
  real_estate: 'Real Estate',
  default: 'Service',
};

function serviceLabelForId(id: string, publisherType?: string): string {
  const key = id.toLowerCase();
  if (key.includes('hotel')) return SERVICE_LABELS.hotel;
  if (key.includes('restaurant') || key.includes('dining')) return SERVICE_LABELS.restaurant;
  if (key.includes('travel')) return SERVICE_LABELS.travel;
  if (key.includes('health') || key.includes('doctor')) return SERVICE_LABELS.healthcare;
  if (key.includes('edu') || key.includes('school')) return SERVICE_LABELS.education;
  if (key.includes('estate') || key.includes('property')) return SERVICE_LABELS.real_estate;
  if (publisherType === 'hotel') return SERVICE_LABELS.hotel;
  if (publisherType === 'restaurant') return SERVICE_LABELS.restaurant;
  if (publisherType === 'travel_agency') return SERVICE_LABELS.travel;
  if (publisherType === 'healthcare') return SERVICE_LABELS.healthcare;
  if (publisherType === 'education') return SERVICE_LABELS.education;
  return SERVICE_LABELS.default;
}

/** Associated services — reuses compact commerce strip styling (LE-006.2) */
export function SpotlightDetailsServicesSection({
  content,
  className,
}: {
  content: SpotlightContent;
  className?: string;
}) {
  const serviceIds = [
    ...content.commerce.featuredServiceIds,
    ...content.connections.serviceIds,
  ].filter((id, i, arr) => arr.indexOf(id) === i);

  if (!serviceIds.length) return null;

  return (
    <section className={cn('scroll-mt-36', className)} aria-labelledby="spotlight-services-heading">
      <div className="mb-4 text-left">
        <h2 id="spotlight-services-heading" className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-0.5">
          Associated services
        </h2>
        <p className="text-[13px] font-medium text-[#9AA0AC]">
          Services featured in this Spotlight content
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {serviceIds.map((serviceId) => {
          const label = serviceLabelForId(serviceId, content.publisher.publisherType);
          return (
            <div
              key={serviceId}
              className="rounded-[5px] border border-[#e8edf2] bg-[#fafbfc] p-4 flex items-center gap-3"
            >
              <span className="w-10 h-10 rounded-[5px] bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center shrink-0">
                <Briefcase size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1a1a2e] truncate">{label}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Service ID: {serviceId}</p>
              </div>
              <Link
                to={`/search?q=${encodeURIComponent(label)}`}
                className="shrink-0 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-[#E8500A] hover:underline"
              >
                View
                <ArrowRight size={10} />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
