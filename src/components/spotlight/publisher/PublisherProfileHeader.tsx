import React from 'react';
import { BadgeCheck } from 'lucide-react';
import type { SpotlightPublisherProfile } from '../../../types/spotlight/publisher/profile';
import type { SpotlightPublisherTrustProfile } from '../../../types/spotlight/publisher/trust';
import { SPOTLIGHT_PUBLISHER_PROFILE_TYPE_LABELS } from '../../../types/spotlight/publisher/profile';
import { SpotlightPublisherTrustBadges } from './SpotlightPublisherTrustBadges';

interface PublisherProfileHeaderProps {
  profile: SpotlightPublisherProfile;
  trust?: SpotlightPublisherTrustProfile;
}

export function PublisherProfileHeader({ profile, trust }: PublisherProfileHeaderProps) {
  return (
    <div className="relative rounded-[5px] overflow-hidden border border-[#e8edf2] bg-white mb-6">
      <div
        className="h-32 sm:h-40 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] bg-cover bg-center"
        style={profile.coverUrl ? { backgroundImage: `url(${profile.coverUrl})` } : undefined}
      />
      <div className="px-5 pb-5 -mt-10 relative">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt=""
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md bg-white"
            />
          ) : (
            <span className="w-20 h-20 rounded-full border-4 border-white bg-[#E8500A]/10 text-[#E8500A] text-2xl font-black flex items-center justify-center shadow-md">
              {profile.name.slice(0, 1)}
            </span>
          )}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#1a1a2e]">{profile.name}</h1>
              {profile.isVerified && <BadgeCheck size={18} className="text-[#E8500A]" aria-label="Verified" />}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">
              {SPOTLIGHT_PUBLISHER_PROFILE_TYPE_LABELS[profile.publisherType]}
            </p>
            {trust && <SpotlightPublisherTrustBadges trust={trust} className="mt-2" />}
          </div>
        </div>
        {profile.description && (
          <p className="text-sm text-gray-600 mt-4 text-left line-clamp-3">{profile.description}</p>
        )}
      </div>
    </div>
  );
}
