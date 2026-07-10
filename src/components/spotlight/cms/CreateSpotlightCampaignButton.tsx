import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';

interface CreateSpotlightCampaignButtonProps {
  productId?: string;
  brandId?: string;
  className?: string;
}

/** Product Studio entry — opens Campaign Manager wizard */
export function CreateSpotlightCampaignButton({
  productId,
  brandId,
  className = '',
}: CreateSpotlightCampaignButtonProps) {
  const params = new URLSearchParams();
  if (productId) params.set('productId', productId);
  if (brandId) params.set('brandId', brandId);
  const qs = params.toString();

  return (
    <Link
      to={`/marketing/spotlight/new${qs ? `?${qs}` : ''}`}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#E8500A] text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-[#d64809] ${className}`}
    >
      <Megaphone size={14} />
      Create Spotlight Campaign
    </Link>
  );
}
