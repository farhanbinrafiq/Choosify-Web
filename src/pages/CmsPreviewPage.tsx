import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CmsDraftPreviewProvider,
  useCmsDraftPreview,
  useOptionalCmsDraftPreview,
} from '../contexts/CmsDraftPreviewContext';
import { isValidCmsPreviewToken } from '../lib/cmsPreview';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';
import { SuggestBrandPage } from './SuggestBrandPage';
import { PartnershipPage } from './PartnershipPage';
import { AdvertisePage } from './AdvertisePage';
import { TermsPage } from './TermsPage';
import { PrivacyPage } from './PrivacyPage';

/** Website Studio page drafts preview on their real page (?page=<SitePagesConfig key>). */
const PREVIEW_PAGES: Record<string, React.ComponentType> = {
  about: AboutPage,
  contact: ContactPage,
  suggestBrand: SuggestBrandPage,
  partnership: PartnershipPage,
  advertise: AdvertisePage,
  terms: TermsPage,
  privacy: PrivacyPage,
};

function PreviewUnavailable({ message = 'Preview unavailable' }: { message?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-[#F4F7F9] px-6">
      <div className="text-center space-y-2 max-w-md">
        <p className="text-sm font-extrabold uppercase tracking-widest text-[#FF5B00]">
          CMS Draft Preview
        </p>
        <h1 className="text-xl font-extrabold text-[#1A1A2E]">{message}</h1>
        <p className="text-sm text-[#5B6472]">
          This draft session is missing, expired, or invalid. Open Live Preview again from the CMS.
        </p>
      </div>
    </div>
  );
}

function CmsDraftPreviewBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-[200] bg-[#1A1A2E] text-white text-[10px] font-black uppercase tracking-[0.2em] text-center py-1.5 border-b border-white/10"
    >
      CMS Draft Preview
    </div>
  );
}

function CmsPreviewBody() {
  const { status, error } = useCmsDraftPreview();

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-[#5B6472]">
        Loading draft preview…
      </div>
    );
  }

  if (status === 'error') {
    return <PreviewUnavailable message={error || 'Preview unavailable'} />;
  }

  const Page = PREVIEW_PAGES[new URLSearchParams(window.location.search).get('page') || ''] || HomePage;
  return (
    <>
      <CmsDraftPreviewBanner />
      <Page />
    </>
  );
}

/**
 * Token-gated CMS draft preview — same homepage components as production,
 * with draft overrides applied via CmsDraftPreviewContext → GlobalState.
 * AppContent may already wrap this route with CmsDraftPreviewProvider so
 * Navbar/Footer also receive site overrides.
 */
export function CmsPreviewPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const existingPreview = useOptionalCmsDraftPreview();

  if (!isValidCmsPreviewToken(token)) {
    return <PreviewUnavailable />;
  }

  if (existingPreview) {
    return <CmsPreviewBody />;
  }

  return (
    <CmsDraftPreviewProvider token={token}>
      <CmsPreviewBody />
    </CmsDraftPreviewProvider>
  );
}

export default CmsPreviewPage;
