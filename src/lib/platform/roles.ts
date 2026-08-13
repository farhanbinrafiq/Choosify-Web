import type { UserRole } from '../../types/schemas';

/** Platform-facing role names (spec LE-005 Phase 5.1) */
export type PlatformRole = 'buyer' | 'seller' | 'brand' | 'creator' | 'moderator' | 'admin';

export const ALL_PLATFORM_ROLES: PlatformRole[] = [
  'buyer',
  'seller',
  'brand',
  'creator',
  'moderator',
  'admin',
];

/** Map persisted user role → platform role */
export function toPlatformRole(role: UserRole | string): PlatformRole {
  switch (String(role || '').toLowerCase()) {
    case 'customer':
    case 'consumer':
    case 'buyer':
    case 'user':
      return 'buyer';
    case 'seller':
    case 'verified_seller':
      return 'seller';
    case 'brand':
      return 'brand';
    case 'creator':
      return 'creator';
    case 'moderator':
      return 'moderator';
    case 'admin':
    case 'super_admin':
      return 'admin';
    default:
      return 'buyer';
  }
}

/** Administrators inherit all role capabilities */
export function roleCanAccess(userRole: UserRole, allowed: readonly PlatformRole[]): boolean {
  const platform = toPlatformRole(userRole);
  if (platform === 'admin') return true;
  return allowed.includes(platform);
}

export function isBuyer(role: UserRole): boolean {
  return toPlatformRole(role) === 'buyer';
}

export function isMarketingRole(role: UserRole): boolean {
  return roleCanAccess(role, ['brand', 'admin']);
}

export function canAccessStudioEdit(role: UserRole): boolean {
  return roleCanAccess(role, ['admin']);
}

export function canAccessMarketingHub(role: UserRole): boolean {
  return roleCanAccess(role, ['brand', 'admin', 'moderator']);
}
