// Customer sign-in via Shopify's Customer Account API (OAuth 2.0 + PKCE, public client).
// Used to check whether a signed-in customer has an active membership subscription.

const SHOP_ID = '67901030484';
const CLIENT_ID = '17fc0686-3943-4ef4-9a9e-330e054b2f43';
const AUTH_BASE = `https://shopify.com/authentication/${SHOP_ID}`;
const API_URL = `https://shopify.com/${SHOP_ID}/account/customer/api/2025-07/graphql`;

const SESSION_KEY = 'ok-customer-session';
const PKCE_KEY = 'ok-auth-pkce';

interface Session {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

export interface MemberInfo {
  email: string | null;
  isMember: boolean;
}

const redirectUri = () => `${window.location.origin}/account/callback`;

const base64Url = (bytes: ArrayBuffer | Uint8Array) => {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = '';
  arr.forEach((b) => { str += String.fromCharCode(b); });
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const randomString = (bytes = 32) => base64Url(crypto.getRandomValues(new Uint8Array(bytes)));

const readSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
};

const writeSession = (s: Session | null) => {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
};

const saveTokenResponse = (data: { access_token: string; refresh_token?: string; id_token?: string; expires_in: number }, previous?: Session | null) => {
  writeSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? previous?.refreshToken,
    idToken: data.id_token ?? previous?.idToken,
    expiresAt: Date.now() + (data.expires_in - 30) * 1000,
  });
};

async function postToken(params: Record<string, string>) {
  const response = await fetch(`${AUTH_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });
  if (!response.ok) throw new Error(`Token request failed (${response.status})`);
  return response.json();
}

export async function startLogin(returnTo = '/') {
  const verifier = randomString(48);
  const challenge = base64Url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  const state = randomString(16);
  const nonce = randomString(16);
  sessionStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state, returnTo }));

  const url = new URL(`${AUTH_BASE}/oauth/authorize`);
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri(),
    scope: 'openid email customer-account-api:full',
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString();
  window.location.href = url.toString();
}

export async function completeLogin(): Promise<string> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const stored = JSON.parse(sessionStorage.getItem(PKCE_KEY) ?? 'null');
  sessionStorage.removeItem(PKCE_KEY);
  if (!code || !stored || stored.state !== state) throw new Error('Sign-in could not be verified. Please try again.');

  const data = await postToken({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: redirectUri(),
    code,
    code_verifier: stored.verifier,
  });
  saveTokenResponse(data);
  return stored.returnTo || '/';
}

async function getAccessToken(): Promise<string | null> {
  const session = readSession();
  if (!session) return null;
  if (Date.now() < session.expiresAt) return session.accessToken;
  if (!session.refreshToken) {
    writeSession(null);
    return null;
  }
  try {
    const data = await postToken({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: session.refreshToken,
    });
    saveTokenResponse(data, session);
    return data.access_token;
  } catch {
    writeSession(null);
    return null;
  }
}

/** Returns null when nobody is signed in. */
export async function fetchMemberInfo(): Promise<MemberInfo | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({
      query: `{ customer { emailAddress { emailAddress } subscriptionContracts(first: 25) { nodes { status } } } }`,
    }),
  });
  if (response.status === 401 || response.status === 403) {
    writeSession(null);
    return null;
  }
  if (!response.ok) throw new Error(`Customer API error (${response.status})`);

  const json = await response.json();
  const customer = json?.data?.customer;
  if (!customer) return null;
  const contracts: Array<{ status: string }> = customer.subscriptionContracts?.nodes ?? [];
  return {
    email: customer.emailAddress?.emailAddress ?? null,
    isMember: contracts.some((c) => c.status === 'ACTIVE'),
  };
}

export function logout() {
  const idToken = readSession()?.idToken;
  writeSession(null);
  if (!idToken) {
    window.location.href = '/';
    return;
  }
  const url = new URL(`${AUTH_BASE}/logout`);
  url.search = new URLSearchParams({
    id_token_hint: idToken,
    post_logout_redirect_uri: `${window.location.origin}/`,
  }).toString();
  window.location.href = url.toString();
}
