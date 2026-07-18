import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { getAllBrandPosts } from '../lib/brandPosts';
import { getSpotlightContentBySlug, resolveSpotlightExperience } from '../utils/spotlightContentResolver';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';
import { resolveRelatedExperience } from '../utils/spotlightRelatedExperience';
import { buildCampaignTimeline } from '../utils/spotlightContentTimeline';
import { buildSpotlightHub, inferCampaignJourney } from '../utils/spotlightHub';
import { buildPersonalizedRails } from '../utils/spotlightPersonalizedRails';
import { PublisherTimeline } from '../components/spotlight/publisher/PublisherTimeline';
import { SpotlightContentCard } from '../components/spotlight/experience/SpotlightContentCard';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';
import { useSpotlightHistory } from '../hooks/useSpotlightHistory';
import {
  SpotlightBreadcrumbs,
  SpotlightCampaignJourneyStrip,
  SpotlightDiscoveryNav,
  SpotlightHubNav,
  SpotlightPersonalizedRails,
} from '../components/spotlight/discovery';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

export function SpotlightCampaignPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();
  const impressionCallbacks = useMemo(() => createSpotlightImpressionLogger(), []);

  const sources = useMemo(
    () => ({
      catalog: allCatalogProducts,
      guides: allCatalogGuides,
      creators: allCreators,
      brandPosts: getAllBrandPosts(),
      brandLogos: BRAND_LOGOS,
    }),
    [allCatalogProducts, allCatalogGuides, allCreators],
  );

  const allContent = useMemo(() => resolveSpotlightExperience(sources), [sources]);

  const content = useMemo(
    () => (slug ? getSpotlightContentBySlug(slug, sources) : undefined),
    [slug, sources],
  );

  const { recordView } = useSpotlightHistory(allContent);

  useEffect(() => {
    if (content) recordView(content);
  }, [content, recordView]);

  const hub = useMemo(() => (content ? buildSpotlightHub(content, allContent) : undefined), [content, allContent]);
  const journey = useMemo(() => (content ? inferCampaignJourney(content) : []), [content]);

  const related = useMemo(() => {
    if (!content) return null;
    return resolveRelatedExperience(content, allContent);
  }, [content, allContent]);

  const personalizedRails = useMemo(
    () => (content ? buildPersonalizedRails(allContent, [content.contentId]) : []),
    [content, allContent],
  );

  const hubNav = useMemo(() => {
    if (!hub) return [];
    return hub.sections
      .filter((s) => s.href || s.contentIds.length > 0)
      .map((s) => ({
        id: s.id,
        label: s.title,
        href: s.href ?? `#hub-${s.id}`,
        isActive: s.id === 'overview',
      }));
  }, [hub]);

  const timeline = useMemo(() => {
    if (!content || content.sourceKind !== 'campaign') return undefined;
    const campaign = listCampaignRecords().find((c) => c.campaignId === content.sourceId);
    return campaign ? buildCampaignTimeline(campaign) : undefined;
  }, [content]);

  if (!content) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-[#1a1a2e]">Experience unavailable</h1>
        <p className="text-sm text-gray-500 mt-2">This Spotlight experience may have ended or been removed.</p>
        <Link to="/spotlight" className="inline-flex items-center gap-1 mt-6 text-[#E8500A] text-sm font-bold uppercase">
          Browse Spotlight <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SpotlightDiscoveryNav />

      {hub && <SpotlightBreadcrumbs className="mb-4" items={hub.breadcrumbs} />}

      <SpotlightCampaignJourneyStrip steps={journey} />

      {hubNav.length > 0 && <SpotlightHubNav items={hubNav} />}

      <SpotlightContentCard content={content} impressionCallbacks={impressionCallbacks} variant="hero" />

      {(content.isLive || content.contentType === 'live') && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/spotlight/${content.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-[#E8500A] text-white text-xs font-black uppercase tracking-wider rounded hover:bg-[#CF4400]"
          >
            {content.live?.status === 'replay' || content.live?.status === 'ended' ? 'Watch Replay' : content.live?.status === 'upcoming' ? 'Notify Me' : 'Watch Live'}
          </Link>
          <Link
            to={`/spotlight/${content.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] border border-[#e8edf2] text-[#1a1a2e] text-xs font-bold uppercase tracking-wider rounded hover:border-[#E8500A]/40"
          >
            Campaign Overview
          </Link>
        </div>
      )}

      {timeline && (
        <div className="mt-10 text-left border-t border-gray-100 pt-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Campaign Timeline</p>
          <PublisherTimeline timeline={timeline} />
        </div>
      )}

      {personalizedRails.length > 0 && (
        <div className="mt-10 border-t border-gray-100 pt-8">
          <SpotlightPersonalizedRails rails={personalizedRails} allContent={allContent} impressionCallbacks={impressionCallbacks} />
        </div>
      )}

      {related && related.sections.length > 0 && (
        <div className="mt-10 text-left border-t border-gray-100 pt-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Related Experiences</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.sections.flatMap((s) =>
              s.contentIds.slice(0, 2).map((cid) => {
                const item = allContent.find((c) => c.contentId === cid);
                return item ? (
                  <SpotlightContentCard key={cid} content={item} impressionCallbacks={impressionCallbacks} variant="compact" />
                ) : null;
              }),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
