import React from 'react';
import { SectionHeader } from '../../section/SectionHeader';
import { TrustStrip } from '../TrustStrip';
import { HomeSectionShell } from './HomeSectionShell';

export function HomeTrustSection() {
  return (
    <HomeSectionShell id="section-trust" sectionId="home-trust" tone="soft-orange">
      <SectionHeader
        id="section-trust-heading"
        title={
          <>
            Why <span className="text-[#E8500A]">Choosify</span>
          </>
        }
        subtitle="Discovery, comparison, and commerce — built on trust"
        centered
        className="!flex-col !items-center text-center [&>div]:text-center"
      />
      <TrustStrip />
    </HomeSectionShell>
  );
}
