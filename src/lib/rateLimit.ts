// In-memory, per-instance IP limit. Good enough for v1; on Vercel each instance
// keeps its own count, so move this to Supabase or Upstash if abuse shows up.
import { config } from "@/config";

const hits = new Map<string, number[]>();

export function allow(ip: string, now = Date.now()): boolean {
  const { max, windowMs } = config.rateLimit;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(key);
  }
  return true;
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
