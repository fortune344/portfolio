import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentification de l'admin : mot de passe unique (ADMIN_PASSWORD) et
 * session via cookie HttpOnly signé en HMAC (aucune donnée sensible stockée).
 *
 * Règles :
 * - En production, ADMIN_PASSWORD est obligatoire — sinon l'admin est désactivé.
 * - En développement sans ADMIN_PASSWORD, l'admin est ouvert (machine locale).
 */

const COOKIE_NAME = "pf_admin";
const SESSION_SECONDS = 7 * 24 * 3600; // 7 jours

const isProd = process.env.NODE_ENV === "production";

function secret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "portfolio-dev-secret"
  );
}

function sign(expiry: number): string {
  return createHmac("sha256", secret()).update(String(expiry)).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Un mot de passe est-il configuré ? */
export function passwordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** L'admin est-il utilisable dans cet environnement ? */
export function adminEnabled(): boolean {
  return !isProd || passwordConfigured();
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return !isProd;
  return safeEqual(candidate, expected);
}

export async function createSession(): Promise<void> {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  (await cookies()).set(COOKIE_NAME, `${expiry}.${sign(expiry)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  // Dev sans mot de passe : accès libre sur la machine locale.
  if (!passwordConfigured()) return !isProd;

  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [expiryStr, signature] = raw.split(".");
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now() / 1000) return false;
  return Boolean(signature) && safeEqual(signature, sign(expiry));
}
