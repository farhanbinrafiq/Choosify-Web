import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsApi, type ClaimEntityType } from '../../services/claimsApi';
import { toast } from '../../lib/notify';

/** "Claim this profile" → server-issued claim reference → /claim/:intentId. */
export function useStartClaim() {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const start = async (entityType: ClaimEntityType, entityId: string) => {
    if (starting) return;
    setStarting(true);
    try {
      const intent = await claimsApi.startIntent(entityType, entityId);
      navigate(`/claim/${encodeURIComponent(intent.id)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start the claim. Please try again.');
    } finally {
      setStarting(false);
    }
  };
  return { start, starting };
}
