import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import type { User, UserRole } from '../types/schemas';

export const AUTH_TOKEN_KEY = 'choosify_auth_token';
export const AUTH_LOGIN_FLAG_KEY = 'choosify_is_logged_in';
export const AUTH_PROFILE_KEY = 'choosify_user_profile';

const API_BASE =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

export type AuthMeResponse = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
};

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

export function persistAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Admin /auth/me returns 200 for staff/seller profiles, 403 for bare Firebase shoppers.
 * Shoppers are still authenticated — operations routes accept role "user" via Bearer token.
 */
export async function fetchAuthMe(token: string): Promise<AuthMeResponse | null> {
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 403) return null;
  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? 'Invalid or expired session. Please sign in again.'
        : 'Unable to verify session with the server.',
    );
  }
  return response.json() as Promise<AuthMeResponse>;
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

export async function resolveSessionUser(
  firebaseUser: FirebaseUser,
  previous?: User | null,
): Promise<{ token: string; user: User }> {
  const token = await firebaseUser.getIdToken();
  persistAuthToken(token);

  let remote: AuthMeResponse | null = null;
  try {
    remote = await fetchAuthMe(token);
  } catch (err) {
    // Token rejected by backend (e.g. Admin SDK not configured locally) — still keep Firebase session
    // for client state, but clear token so API calls don't spam 401s with a bad token.
    if (err instanceof Error && err.message.includes('Invalid or expired')) {
      clearAuthToken();
      throw err;
    }
    // Network / other — keep token; profile from Firebase only
  }

  const user = buildUserFromAuth({
    uid: remote?.uid || firebaseUser.uid,
    email: remote?.email || firebaseUser.email,
    displayName: remote?.displayName || firebaseUser.displayName || firebaseUser.email,
    role: remote?.role || 'user',
    previous,
  });

  return { token, user };
}

export async function signInWithEmailPassword(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function registerWithEmailPassword(
  email: string,
  password: string,
  fullName: string,
) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (fullName.trim()) {
    await updateProfile(credential.user, { displayName: fullName.trim() });
  }
  return credential.user;
}

export async function signOutSession() {
  clearAuthToken();
  localStorage.removeItem(AUTH_LOGIN_FLAG_KEY);
  try {
    await signOut(auth);
  } catch {
    // Ignore — local session already cleared
  }
}

export function firebaseAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return error instanceof Error ? error.message : 'Authentication failed.';
  }
}
