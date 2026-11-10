"use client";

// What the screens call to check age and register. Normally the server's API routes; in the
// static demo the same checks run in the browser instead and nothing is saved.
import { config } from "@/config";
import { ageOn, isFuture, toIsoDate, type DobParts } from "@/lib/dates";
import { isStaticDemo } from "@/lib/staticDemo";
import { validateForm, type Errors, type FormInput } from "@/lib/validate";
import { formatSquad } from "@/lib/squad";

export type AgeResult = { ok?: boolean; underage?: boolean; error?: string };

export type RegisterResult = {
  ok: boolean;
  existing?: boolean;
  reserve?: { number: string; firstName: string } | null;
  error?: string;
  errors?: Errors;
};

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json().catch(() => ({ ok: false, error: "server" }));
}

/** Where the static demo keeps its age pass (sessionStorage), shared with DemoBench. */
export const DEMO_AGE_KEY = "alfie_demo_age";

/** Starts the whole flow again from the age gate: forgets the age pass and reloads the page. */
export async function backToKickOff() {
  try {
    if (isStaticDemo) sessionStorage.removeItem(DEMO_AGE_KEY);
    else await fetch("/api/age", { method: "DELETE" });
  } finally {
    window.location.reload();
  }
}

export async function checkAge(dob: DobParts): Promise<AgeResult> {
  if (!isStaticDemo) return post("/api/age", dob);
  const iso = toIsoDate(dob);
  if (!iso || isFuture(iso) || ageOn(iso) > 120) return { ok: false, error: "invalid" };
  return ageOn(iso) < config.minimumAge ? { ok: false, underage: true } : { ok: true };
}

/** A stable made-up reserve number for the demo, so the same email always gets the same number. */
function demoSquad(email: string): number {
  let h = 0;
  for (const c of email) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 9500) + 500; // 500–9999, like the real list
}

export async function register(payload: FormInput & { src: string; box: string | null; website: string }): Promise<RegisterResult> {
  if (!isStaticDemo) return post("/api/register", payload);
  const { errors, data } = validateForm(payload);
  if (!data) return { ok: false, errors };
  return { ok: true, existing: false, reserve: { number: formatSquad(demoSquad(data.email)), firstName: data.firstName } };
}
