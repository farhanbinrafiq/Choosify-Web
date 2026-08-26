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

export type AuthMeResponse = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
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
  // Buyers (role user) get 403 from admin /auth/me — still authenticated.
  if (response.status === 403) return null;
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
    body: JSON.stringify({ email: email.trim() }),
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
