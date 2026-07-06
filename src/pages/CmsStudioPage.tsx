import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, LayoutDashboard } from 'lucide-react';
import type { StudioKind } from '../types/studio';
import { StudioEditProvider } from '../context/StudioEditContext';
import { StudioEditPanel } from '../components/studio/StudioEditPanel';
import { HomePage } from './HomePage';
import { ProductDetailPage } from './ProductDetailPage';
import { BrandDetailPage } from './BrandDetailPage';
import { CreatorProfilePage } from './CreatorProfilePage';
import { BrandPostDetailPage } from './BrandPostDetailPage';

const STUDIO_META: Record<
  StudioKind,
  { title: string; subtitle: string; buildPreviewHref: (entityId?: string) => string }
> = {
  website: {
    title: 'Website Studio',
    subtitle: 'Homepage mirror with inline section editing',
    buildPreviewHref: () => '/',
  },
  product: {
    title: 'Product Studio',
    subtitle: 'Product detail mirror',
    buildPreviewHref: (entityId = '1') => `/products/${entityId}`,
  },
  brand: {
    title: 'Brand Studio',
    subtitle: 'Brand profile mirror',
    buildPreviewHref: (entityId = '1') => `/brands/${entityId}`,
  },
  creator: {
    title: 'Creator Studio',
    subtitle: 'Creator profile mirror',
    buildPreviewHref: (entityId = 'creator-1') => `/creators/${entityId}`,
  },
  event: {
    title: 'Event Studio',
    subtitle: 'Event detail mirror',
    buildPreviewHref: (entityId) => (entityId ? `/whats-on/${entityId}` : '/whats-on'),
  },
};

type CmsStudioPageProps = {
  kind: StudioKind;
};

export function CmsStudioPage({ kind }: CmsStudioPageProps) {
  const params = useParams();
  const entityId = params.id || params.slug || 'default';
  const meta = STUDIO_META[kind];
  const previewHref = meta.buildPreviewHref(entityId === 'default' ? undefined : entityId);

  return (
    <StudioEditProvider studio={kind} entityId={entityId} forcedEditMode>
      <div className="sticky top-0 z-[90] bg-[#1A1D4E] text-white border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E8500A]">
              CMS Studio · Edit mode
            </p>
            <h1 className="text-base sm:text-lg font-black italic uppercase tracking-tight">
              {meta.title}
            </h1>
            <p className="text-[10px] font-semibold text-white/60 mt-0.5">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={previewHref}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[5px] bg-white/10 hover:bg-white/15 text-[10px] font-black uppercase tracking-wider"
            >
              <ExternalLink size={12} />
              View live
            </Link>
            <Link
              to="/dashboard"
              state={{ activeTab: 'cms-studios' }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[5px] border border-white/15 hover:border-[#E8500A]/40 text-[10px] font-black uppercase tracking-wider"
            >
              <LayoutDashboard size={12} />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {kind === 'website' && <HomePage />}
      {kind === 'product' && <ProductDetailPage />}
      {kind === 'brand' && <BrandDetailPage />}
      {kind === 'creator' && <CreatorProfilePage />}
      {kind === 'event' && <BrandPostDetailPage />}

      <StudioEditPanel />
    </StudioEditProvider>
  );
}
