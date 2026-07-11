import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { EmiPublisherPanel } from '../../emi/EmiPublisherPanel';
import { buildPageContext } from '../../../lib/emi/emiContextEngine';

export function SpotlightAiPanel() {
  const location = useLocation();
  const context = useMemo(
    () => buildPageContext(location.pathname, { pageId: 'publisher_studio' }),
    [location.pathname],
  );

  return <EmiPublisherPanel context={context} />;
}
