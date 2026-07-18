import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { roleCanAccess, toPlatformRole, type PlatformRole } from '../../lib/platform/roles';

interface RequireRoleProps {
  children: React.ReactNode;
  /** Allowed platform roles; admin always permitted */
  roles: PlatformRole[];
  /** Where to send unauthorized users (default: dashboard for logged-in, login for guests) */
  fallback?: string;
}

export function RequireRole({ children, roles, fallback }: RequireRoleProps) {
  const { isLoggedIn, currentUser } = useGlobalState();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!roleCanAccess(currentUser.role, roles)) {
    const destination = fallback ?? '/dashboard';
    return <Navigate to={destination} state={{ from: location.pathname, reason: 'role-denied' }} replace />;
  }

  return <>{children}</>;
}

export function usePlatformRole(): PlatformRole {
  const { currentUser } = useGlobalState();
  return toPlatformRole(currentUser.role);
}

export function useHasRole(...roles: PlatformRole[]): boolean {
  const { currentUser } = useGlobalState();
  return roleCanAccess(currentUser.role, roles);
}
