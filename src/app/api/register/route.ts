import { NextResponse, type NextRequest } from "next/server";
import { config } from "@/config";
import { AGE_COOKIE, readAgeCookie } from "@/lib/ageCookie";
import { allow, clientIp } from "@/lib/rateLimit";
import { cleanSource, cleanTag } from "@/lib/source";
import { formatSquad } from "@/lib/squad";
import { getStore, type Registration } from "@/lib/store";
import { validateForm } from "@/lib/validate";

const reserveOf = (r: Registration) => ({ number: formatSquad(r.squadNumber), firstName: r.firstName });

const same = (a: string, b: string) => a.localeCompare(b, "en", { sensitivity: "base" }) === 0;

export async function POST(req: NextRequest) {
  if (!allow(clientIp(req.headers))) {
    return NextResponse.json({ ok: false, error: "tooMany" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "server" }, { status: 400 });
  }

  // Honeypot: people never see this field, bots fill it in.
  if (body.website) return NextResponse.json({ ok: false, error: "server" }, { status: 400 });

  const dob = readAgeCookie(req.cookies.get(AGE_COOKIE)?.value);
  if (!dob) return NextResponse.json({ ok: false, error: "age" }, { status: 403 });

  const { errors, data } = validateForm(body);
  if (!data) return NextResponse.json({ ok: false, errors }, { status: 422 });

  try {
    const { registration, existing } = await getStore().create({
      ...data,
      dateOfBirth: dob,
      consentTextVersion: config.consentTextVersion,
      consentAt: new Date().toISOString(),
      source: cleanSource(body.src),
      box: cleanTag(body.box),
      userAgent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
    });

    if (existing) {
      // Only hand back the reserve number if the name matches, so typing someone
      // else's email doesn't reveal their name or number.
      const match = same(registration.firstName, data.firstName) && same(registration.surname, data.surname);
      return NextResponse.json({ ok: true, existing: true, reserve: match ? reserveOf(registration) : null });
    }
    return NextResponse.json({ ok: true, existing: false, reserve: reserveOf(registration) });
  } catch (err) {
    console.error("register failed", err);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
