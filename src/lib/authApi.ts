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
