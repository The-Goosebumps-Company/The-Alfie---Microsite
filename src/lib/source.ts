import { config } from "@/config";

/** Cleans ?src= / ?box= values from the QR so only short slugs are stored. */
export function cleanTag(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9_-]{0,39}$/.test(v) ? v : null;
}

export function cleanSource(value: unknown): string {
  return cleanTag(value) ?? config.defaultSource;
}
