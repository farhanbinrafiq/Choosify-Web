import React from 'react';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { SpotlightCardRenderer } from './SpotlightCardRenderer';

interface SpotlightContentCardProps {
  content: SpotlightContent;
  impressionCallbacks?: SpotlightImpressionCallbacks;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
  sectionLayout?: string;
}

/** @deprecated Use SpotlightCardRenderer — thin compatibility wrapper */
export function SpotlightContentCard(props: SpotlightContentCardProps) {
  return <SpotlightCardRenderer {...props} feedMode={props.sectionLayout === 'list' ? 'list' : 'grid'} />;
}
