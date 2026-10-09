/**
 * Admin session tokens.
 *
 * A session is `v1.<expiry>.<nonce>.<signature>`, where the signature is an
 * HMAC-SHA256 over the first three parts keyed with ADMIN_SESSION_SECRET.
 * The server stores nothing: a token is valid only if it verifies against the
 * secret and has not expired, so a client cannot forge one by choosing cookie
 * values (the previous scheme accepted any two cookies of 32+ characters).
 *
 * Web Crypto only, so the same code runs in the edge middleware and in Node
 * route handlers. Verification uses crypto.subtle.verify, which compares in
 * constant time.
 */

const encoder = new TextEncoder();
const VERSION = "v1";
const MIN_SECRET_LENGTH = 32;
const NONCE_BYTES = 16;
const SIGNATURE_BYTES = 32;

export const SESSION_TTL_SECONDS = 4 * 60 * 60;

// The __Host- prefix makes browsers require Secure, Path=/ and no Domain, so
// the cookie cannot be set from a sibling subdomain. It needs HTTPS, so it is
// only used in production.
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-admin_session" : "admin_session";

export function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  try {
    const binary = atob(padded);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

function hmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

export async function createSessionToken(secret: string, nowMs: number = Date.now()): Promise<string> {
  const expiry = Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS;
  const nonce = toBase64Url(crypto.getRandomValues(new Uint8Array(NONCE_BYTES)));
  const payload = `${VERSION}.${expiry}.${nonce}`;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret, "sign"), encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  nowMs: number = Date.now(),
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [version, expiryText, nonce, signatureText] = parts;
  if (version !== VERSION || !/^\d{1,12}$/.test(expiryText) || !/^[A-Za-z0-9_-]{22}$/.test(nonce)) return false;

  const nowSeconds = Math.floor(nowMs / 1000);
  const expiry = Number(expiryText);
  // Reject expired tokens, and tokens claiming a lifetime longer than we issue.
  if (expiry <= nowSeconds || expiry > nowSeconds + SESSION_TTL_SECONDS + 60) return false;

  const signature = fromBase64Url(signatureText);
  if (!signature || signature.length !== SIGNATURE_BYTES) return false;

  return crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret, "verify"),
    signature as BufferSource,
    encoder.encode(`${version}.${expiryText}.${nonce}`),
  );
}

/** True only for a cookie value that carries a valid, unexpired session. Fails closed. */
export async function isValidSessionCookie(value: string | undefined): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret || !value) return false;
  try {
    return await verifySessionToken(value, secret);
  } catch {
    return false;
  }
}
