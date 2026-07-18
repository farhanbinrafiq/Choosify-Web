import React from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { spotlightContentHref } from '../lib/spotlight/content';

/**
 * Legacy interactive live player → unified Guide Detail shell.
 * Optional `?player=1` is ignored; live embeds render inside Guide Detail.
 */
export function LegacyLiveContentRedirect() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const hash = params.get('section') ? `#${params.get('section')}` : '';
  return <Navigate to={`${spotlightContentHref(slug)}${hash}`} replace />;
}

/** What’s On brand post → same Guide Detail layout as Discover formats */
export function LegacyWhatsOnContentRedirect() {
  const { slug = '' } = useParams<{ slug: string }>();
  return <Navigate to={spotlightContentHref(slug)} replace />;
}
