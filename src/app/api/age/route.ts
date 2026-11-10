import { NextResponse, type NextRequest } from "next/server";
import { config } from "@/config";
import { AGE_COOKIE, BLOCK_COOKIE, ageCookieOptions, makeAgeCookie } from "@/lib/ageCookie";
import { ageOn, isFuture, toIsoDate } from "@/lib/dates";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const dob = toIsoDate({
    day: String(body.day ?? ""),
    month: String(body.month ?? ""),
    year: String(body.year ?? ""),
  });
  if (!dob || isFuture(dob) || ageOn(dob) > 120) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (ageOn(dob) < config.minimumAge) {
    const res = NextResponse.json({ ok: false, underage: true });
    // Keeps the block screen up for a day instead of letting someone retry another year.
    res.cookies.set(BLOCK_COOKIE, "1", { ...ageCookieOptions, maxAge: 24 * 60 * 60 });
    return res;
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AGE_COOKIE, makeAgeCookie(dob), ageCookieOptions);
  return res;
}

/** "Back to kick-off": forget the age pass so the guest starts again from the age gate. */
export function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(AGE_COOKIE);
  return res;
}
