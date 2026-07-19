import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { FollowButton } from '../../FollowButton';
import type { SpotlightPublisher } from '../../../types/spotlight/experience/publisher';
import { publisherProfileHref } from '../../../lib/spotlight/content/publisherRegistry';

/** Reuses Product Details brand mini profile pattern — no V2 fork */
export function SpotlightBrandMiniCard({
  publisher,
  brandId,
}: {
  publisher: SpotlightPublisher;
  brandId?: string;
}) {
  const profileHref = publisherProfileHref(publisher) ?? (brandId ? `/brands/${brandId}` : undefined);
  const resolvedBrandId = brandId ?? publisher.publisherId;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8EDF2] text-left h-full flex flex-col">
      <div className="p-5 flex flex-col items-center text-center choosify-dark-surface text-white flex-1">
        <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center p-2 shadow-lg mb-3 overflow-hidden">
          {publisher.logoUrl ? (
            <img src={publisher.logoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="font-extrabold text-[11px] text-white tracking-tight">
              {publisher.name.slice(0, 3)}
            </span>
          )}
        </div>
        <h4 className="text-sm font-extrabold text-white tracking-tight mb-2">{publisher.name}</h4>
        <div className="flex gap-0.5 mb-4" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={10} className="fill-[#EB4501] text-[#EB4501]" />
          ))}
        </div>
        <div className="space-y-2 w-full mt-auto">
          <FollowButton
            id={resolvedBrandId}
            name={publisher.name}
            type="brand"
            className="w-full h-9 rounded-lg text-[12px] font-bold tracking-tight shadow-sm shrink-0 px-4"
          />
          {profileHref && (
            <Link
              to={profileHref}
              className="w-full py-2.5 rounded-lg bg-[#EB4501] hover:brightness-110 text-white text-[12px] font-bold tracking-tight inline-block text-center transition-all"
            >
              View brand profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
