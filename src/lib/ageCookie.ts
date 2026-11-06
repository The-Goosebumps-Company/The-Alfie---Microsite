// Signed cookie holding the date of birth from the age gate (server only).
import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "@/config";
import { ageOn } from "./dates";
import { isPreviewMode } from "./previewMode";

export const AGE_COOKIE = "alfie_age";
export const BLOCK_COOKIE = "alfie_u18";

/** Signing key for the age cookie and preview tickets. Launch must set AGE_COOKIE_SECRET. */
export function serverSecret(): string {
  const s = process.env.AGE_COOKIE_SECRET;
  if (s) return s;
  if (isPreviewMode) return "preview-mode-secret"; // nothing real is protected in preview
  if (process.env.NODE_ENV === "production") throw new Error("AGE_COOKIE_SECRET is not set");
  return "dev-only-secret";
}

export function sign(value: string): string {
  return createHmac("sha256", serverSecret()).update(value).digest("base64url");
}

export function makeAgeCookie(isoDob: string): string {
  return `${isoDob}.${sign(isoDob)}`;
}

/** Returns the DOB if the cookie is genuine and the holder is old enough, else null. */
export function readAgeCookie(value: string | undefined): string | null {
  if (!value) return null;
  const [dob, sig] = value.split(".");
  if (!dob || !sig || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const expected = Buffer.from(sign(dob));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return ageOn(dob) >= config.minimumAge ? dob : null;
}

export const ageCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: config.ageCookieDays * 24 * 60 * 60,
};
