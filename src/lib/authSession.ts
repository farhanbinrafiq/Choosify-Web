import type { User, UserRole } from '../types/schemas';
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  refreshSession as apiRefreshSession,
  sellerRegister as apiSellerRegister,
  type AuthMeResponse,
} from './authApi';

export const AUTH_TOKEN_KEY = 'choosify_auth_token';
export const AUTH_LOGIN_FLAG_KEY = 'choosify_is_logged_in';
export const AUTH_PROFILE_KEY = 'choosify_user_profile';

export type { AuthMeResponse };

/** In-memory access token — never persisted to localStorage. */
let accessTokenMemory: string | null = null;

export type SessionIdentity = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role?: string;
  accessToken: string;
};

export function getAccessToken(): string | null {
  return accessTokenMemory;
}

export function persistAuthToken(token: string) {
  accessTokenMemory = token;
}

export function clearAuthToken() {
  accessTokenMemory = null;
}

function mapBackendRole(role: string | undefined): UserRole {
  switch ((role || '').toLowerCase()) {
    case 'seller':
    case 'verified_seller':
      return 'seller';
    case 'creator':
      return 'creator';
    case 'moderator':
      return 'moderator';
    case 'admin':
    case 'super_admin':
      return 'admin';
    case 'brand':
      return 'brand';
    default:
      return 'customer';
  }
}

/**
 * Admin /auth/me returns 200 for staff/seller profiles, 403 for buyers (role user).
 * Buyers are still authenticated — operations routes accept role "user" via Bearer token.
 */
export async function fetchAuthMe(token: string): Promise<AuthMeResponse | null> {
  return getCurrentUser(token);
}

export function buildUserFromAuth(input: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role?: string;
  previous?: User | null;
}): User {
  const prev = input.previous;
  const email = input.email || prev?.email || '';
  const name = input.displayName || prev?.name || email.split('@')[0] || 'Choosify member';
  const username =
    prev?.username && prev.id === input.uid
      ? prev.username
      : email
        ? email.split('@')[0]
        : `user_${input.uid.slice(0, 6)}`;

  return {
    id: input.uid,
    role: mapBackendRole(input.role) || prev?.role || 'customer',
    name,
    username,
    phone: prev?.id === input.uid ? prev.phone || '' : '',
    email,
    avatar:
      prev?.id === input.uid && prev.avatar
        ? prev.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EB4501&color=fff`,
    address: prev?.id === input.uid ? prev.address || '' : '',
    reputation_score: prev?.id === input.uid ? prev.reputation_score : 50,
    orderStats:
      prev?.id === input.uid
        ? prev.orderStats
        : { totalOrders: 0, completedOrders: 0, cancelledOrders: 0 },
    verification:
      prev?.id === input.uid
        ? prev.verification
        : { verified: false },
    premiumStatus: prev?.id === input.uid ? prev.premiumStatus : false,
    createdAt: prev?.id === input.uid ? prev.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function decodeAccessTokenClaims(token: string): {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
} {
  try {
    const payload = token.split('.')[1];
    if (!payload) return {};
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(normalized)) as {
      uid?: string;
      sub?: string;
      email?: string;
      emailVerified?: boolean;
    };
    return {
      uid: json.uid || json.sub,
      email: json.email,
      emailVerified: json.emailVerified,
    };
  } catch {
    return {};
  }
}

export async function resolveSessionUser(
  identity: SessionIdentity,
  previous?: User | null,
): Promise<{ token: string; user: User }> {
  const token = identity.accessToken;
  persistAuthToken(token);

  let remote: AuthMeResponse | null = null;
  try {
    remote = await fetchAuthMe(token);
  } catch (err) {
    if (err instanceof Error && err.message.includes('Invalid or expired')) {
      clearAuthToken();
      throw err;
    }
  }

  const claims = decodeAccessTokenClaims(token);
  const user = buildUserFromAuth({
    uid: remote?.uid || identity.uid || claims.uid || '',
    email: remote?.email || identity.email || claims.email,
    displayName: remote?.displayName || identity.displayName || identity.email || claims.email,
    role: remote?.role || identity.role || 'user',
    previous,
  });

  return { token, user };
}

export async function signInWithEmailPassword(email: string, password: string): Promise<SessionIdentity> {
  const result = await apiLogin(email, password);
  return {
    uid: result.uid,
    email: result.email,
    displayName: result.displayName,
    role: result.role,
    accessToken: result.accessToken,
  };
}

/**
 * Storefront sign-up. Backend currently exposes seller-register (not a bare customer register).
 * Uses minimal seller profile fields so the existing form (name/email/password) still works.
 * FLAG: creates role=seller until a dedicated customer /auth/register exists.
 */
export async function registerWithEmailPassword(
  email: string,
  password: string,
  fullName: string,
): Promise<SessionIdentity> {
  const name = fullName.trim() || email.trim().split('@')[0] || 'Choosify member';
  const result = await apiSellerRegister({
    email: email.trim(),
    password,
    displayName: name,
    storeName: `${name}'s Store`,
    phone: '+8801000000000',
    category: 'General',
    city: 'Dhaka',
  });
  return {
    uid: result.uid,
    email: result.email,
    displayName: result.displayName,
    role: result.role,
    accessToken: result.customToken,
  };
}

export async function signOutSession() {
  clearAuthToken();
  localStorage.removeItem(AUTH_LOGIN_FLAG_KEY);
  try {
    await apiLogout();
  } catch {
    // Ignore — local session already cleared
  }
}

export async function refreshSession(): Promise<{ accessToken: string } | null> {
  return apiRefreshSession();
}

export function firebaseAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || '');
  const lower = message.toLowerCase();
  if (lower.includes('invalid email') || lower.includes('valid email')) {
    return 'Please enter a valid email address.';
  }
  if (lower.includes('disabled')) {
    return 'This account has been disabled.';
  }
  if (
    lower.includes('invalid email or password') ||
    lower.includes('incorrect') ||
    lower.includes('unauthorized') ||
    lower.includes('401')
  ) {
    return 'Incorrect email or password.';
  }
  if (lower.includes('already') || lower.includes('exists') || lower.includes('in use')) {
    return 'An account with this email already exists. Sign in instead.';
  }
  if (lower.includes('password') && lower.includes('6')) {
    return 'Password must be at least 6 characters.';
  }
  if (lower.includes('too many')) {
    return 'Too many attempts. Please wait and try again.';
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Network error. Check your connection and try again.';
  }
  return message || 'Authentication failed.';
}
