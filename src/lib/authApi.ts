/**
 * Backend JWT auth API (Postgres-backed). credentials: 'include' for httpOnly refresh cookie.
 */

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '/api/v1';

export type LoginResponse = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  accessToken: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
};

export type SellerRegisterPayload = {
  email: string;
  password?: string;
  displayName: string;
  storeName: string;
  phone: string;
  category: string;
  city: string;
  website?: string;
};

export type SellerRegisterResponse = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  /** Access JWT (same response key as legacy Firebase custom token). */
  customToken: string;
  dashboardPath: string;
};

export type RegisterResponse = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  /** Access JWT — same response shape as /auth/seller-register for Closed Beta. */
  customToken: string;
  dashboardPath: string | null;
};

export type ConnectedIdentity = {
  provider: 'google' | 'facebook' | string;
  /** Provider email, already masked server-side. Never a subject/id. */
  email: string | null;
  connectedAt: string;
};

export type AuthMeResponse = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
  /** JWT-asserted verification state of the account email. */
  emailVerified?: boolean;
  /** false for a social-only Consumer who has never set a Choosify password. */
  hasPassword?: boolean;
  /** Canonical primary account phone in E.164, or null when none is set. */
  phone?: string | null;
  /** Linked social identities from canonical user_identities. */
  identities?: ConnectedIdentity[];
};

export type RefreshResponse = {
  accessToken: string;
};

async function readErrorMessage(response: Response): Promise<string> {
  const raw = await response.text();
  try {
    const parsed = JSON.parse(raw) as { error?: string; message?: string };
    return parsed.message || parsed.error || raw || `Request failed (${response.status})`;
  } catch {
    return raw || `Request failed (${response.status})`;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json() as Promise<LoginResponse>;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json() as Promise<RegisterResponse>;
}

/** Which social providers the backend can actually verify right now. */
export async function getSocialProviders(): Promise<{ google: boolean; facebook: boolean }> {
  try {
    const response = await fetch(`${API_BASE}/auth/social/providers`, { credentials: 'include' });
    if (!response.ok) return { google: false, facebook: false };
    const body = (await response.json()) as { providers?: { google?: boolean; facebook?: boolean } };
    return { google: Boolean(body.providers?.google), facebook: Boolean(body.providers?.facebook) };
  } catch {
    return { google: false, facebook: false };
  }
}

/** Exchange a server-verifiable Google ID token (from Google Identity Services)
 *  for a Choosify session. Returns the same shape as `login`. */
export async function googleSignIn(credential: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json() as Promise<LoginResponse>;
}

/** Exchange a Facebook access token (from the Facebook JS SDK) for a Choosify session. */
export async function facebookSignIn(accessToken: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/facebook`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json() as Promise<LoginResponse>;
}

export async function sellerRegister(payload: SellerRegisterPayload): Promise<SellerRegisterResponse> {
  const response = await fetch(`${API_BASE}/auth/seller-register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json() as Promise<SellerRegisterResponse>;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok && response.status !== 401) {
    throw new Error(await readErrorMessage(response));
  }
}

export async function refreshSession(): Promise<RefreshResponse | null> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json() as Promise<RefreshResponse>;
}

export async function getCurrentUser(accessToken: string): Promise<AuthMeResponse | null> {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 401) {
    throw new Error('Invalid or expired session. Please sign in again.');
  }
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json() as Promise<AuthMeResponse>;
}

/**
 * Persists the account's real display name. The backend PATCH /auth/profile
 * only accepts displayName/username/website/bio/avatarUrl -- there is no
 * email or phone column on the users table, so those fields cannot be
 * persisted here (see DashboardPage.tsx's SettingsSection, which keeps them
 * read-only rather than pretending to save them).
 */
export async function updateDisplayName(accessToken: string, displayName: string): Promise<{ displayName?: string }> {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ displayName }),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  const body = (await response.json()) as { data?: { displayName?: string } };
  return { displayName: body.data?.displayName };
}

/** Persists a server-uploaded avatar URL (or clears it by passing ''). */
export async function updateAvatarUrl(accessToken: string, avatarUrl: string): Promise<{ avatarUrl?: string }> {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ avatarUrl }),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  const body = (await response.json()) as { data?: { avatarUrl?: string } };
  return { avatarUrl: body.data?.avatarUrl };
}

// ── Pre-VPS self-hosting pass — self-service email verification + forgot/reset password ──

export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/auth/password-reset-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // 'web' identifies the storefront as the surface the reset link should
    // open in — a validated enum, never a URL. It does not grant any role
    // or privilege, only which Choosify SPA renders the token form; the
    // server owns the actual destination host.
    body: JSON.stringify({ email: email.trim(), surface: 'web' }),
  });
  // Deliberately generic — the API returns the same body whether or not the
  // email exists. Only a genuinely malformed request (missing/invalid email
  // format) throws.
  if (response.status === 400) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json() as Promise<{ success: boolean; message: string }>;
}

export type ResetPasswordResult = { success: boolean; message?: string; error?: string };

export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResult> {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  const data = (await response.json().catch(() => ({}))) as ResetPasswordResult;
  return { ...data, success: response.ok && Boolean(data.success) };
}

export type VerifyEmailResult = { success: boolean; error?: string };

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  const response = await fetch(`${API_BASE}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const data = (await response.json().catch(() => ({}))) as VerifyEmailResult;
  return { ...data, success: response.ok && Boolean(data.success) };
}

export async function resendVerificationEmail(accessToken: string): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${API_BASE}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json() as Promise<{ success: boolean; message?: string }>;
}

// ── Consumer: add a local password to a social-only account (email OTP) ──
// The destination email is ALWAYS the signed-in account's own email — the
// server derives it; nothing about it is sent from here.

export class ApiError extends Error {
  code?: string;
  status: number;
  retryAfterSeconds?: number;
  constructor(message: string, status: number, code?: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

async function postAuthed<T>(path: string, accessToken: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body ?? {}),
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new ApiError(
      String(data.error || data.message || `Request failed (${response.status})`),
      response.status,
      typeof data.code === 'string' ? data.code : undefined,
      typeof data.retryAfterSeconds === 'number' ? data.retryAfterSeconds : undefined,
    );
  }
  return data as T;
}

/**
 * Canonical authenticated account/security snapshot (hasPassword, phone,
 * identities, emailVerified). Same endpoint as the session profile — GET
 * /auth/me — so there is one source of truth, not a scatter of tiny endpoints.
 */
export async function fetchAccountOverview(accessToken: string): Promise<AuthMeResponse | null> {
  return getCurrentUser(accessToken);
}

/** Add or replace the primary account phone. Server normalizes to E.164. */
export async function updatePrimaryPhone(
  accessToken: string,
  phone: string,
): Promise<{ phone: string | null }> {
  const data = await postProfile(accessToken, { phone });
  return { phone: data.phone ?? null };
}

/** Remove the primary account phone. Does not touch historical order snapshots. */
export async function deletePrimaryPhone(accessToken: string): Promise<{ phone: string | null }> {
  const data = await postProfile(accessToken, { phone: null });
  return { phone: data.phone ?? null };
}

async function postProfile(
  accessToken: string,
  body: Record<string, unknown>,
): Promise<{ phone?: string | null }> {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const json = (await response.json().catch(() => ({}))) as {
    data?: { phone?: string | null };
    error?: string;
    code?: string;
  };
  if (!response.ok) {
    throw new ApiError(String(json.error || `Request failed (${response.status})`), response.status, json.code);
  }
  return json.data ?? {};
}

/** Step 1 — ask the server to email a 6-digit code to the account's own address. */
export async function requestLocalPasswordOtp(
  accessToken: string,
): Promise<{ success: boolean; email: string; expiresInSeconds: number }> {
  return postAuthed('/auth/local-password/request-otp', accessToken);
}

/** Step 2 — submit the code; on success returns a single-use setup authorization token. */
export async function verifyLocalPasswordOtp(
  accessToken: string,
  code: string,
): Promise<{ success: boolean; setupToken: string; expiresInSeconds: number }> {
  return postAuthed('/auth/local-password/verify-otp', accessToken, { code });
}

/** Step 3 — consume the setup token and establish the password. Returns a fresh access token. */
export async function setLocalPassword(
  accessToken: string,
  setupToken: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ success: boolean; accessToken: string }> {
  return postAuthed('/auth/local-password/set', accessToken, { setupToken, newPassword, confirmPassword });
}

/** Canonical change-password for a Consumer who already has one (current-password gated). */
export async function changePassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string }> {
  return postAuthed('/auth/change-password', accessToken, { currentPassword, newPassword });
}
