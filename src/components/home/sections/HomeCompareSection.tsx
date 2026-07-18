import React from 'react';
import { CompareHero } from '../CompareHero';
import { DcHomeBlock } from '../DcHomePanel';

/** Compare Anything — same max-width shell as Deals / Guides above & below */
export function HomeCompareSection() {
  return (
    <DcHomeBlock id="section-compare">
      <CompareHero />
    </DcHomeBlock>
  );
}
