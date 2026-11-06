// Sports from the picker: suggestions keep their canonical spelling, custom entries are tidied.
import { MAX_SPORT_LENGTH, SPORTS } from "@/config";

const ALLOWED = new RegExp(`^[\\p{L}\\p{N}][\\p{L}\\p{N} &'./\\-]{0,${MAX_SPORT_LENGTH - 1}}$`, "u");

/** "  kite   surfing " → "Kite surfing"; "f1" → "F1"; "WWE" stays "WWE"; junk → null. */
export function cleanSport(raw: string): string | null {
  const v = raw.trim().replace(/\s+/g, " ");
  if (!ALLOWED.test(v)) return null;
  const known = SPORTS.find((s) => s.toLowerCase() === v.toLowerCase());
  if (known) return known;
  return v.charAt(0).toUpperCase() + v.slice(1);
}

/** Cleans a list and drops duplicates, ignoring case. */
export function cleanSports(list: unknown[]): string[] {
  const out: string[] = [];
  for (const item of list) {
    if (typeof item !== "string") continue;
    const s = cleanSport(item);
    if (s && !out.some((o) => o.toLowerCase() === s.toLowerCase())) out.push(s);
  }
  return out;
}
