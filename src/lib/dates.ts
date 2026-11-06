// Date-of-birth helpers shared by the browser and the server.

export type DobParts = { day: string; month: string; year: string };

/** Returns an ISO date (YYYY-MM-DD) if the parts form a real date, else null. */
export function toIsoDate({ day, month, year }: DobParts): string | null {
  if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year)) return null;
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (y < 1900 || m < 1 || m > 12 || d < 1) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Today's date in Johannesburg as YYYY-MM-DD. */
export function todayInJoburg(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg" }).format(now);
}

export function ageOn(isoDob: string, isoToday = todayInJoburg()): number {
  const [by, bm, bd] = isoDob.split("-").map(Number);
  const [ty, tm, td] = isoToday.split("-").map(Number);
  let age = ty - by;
  if (tm < bm || (tm === bm && td < bd)) age -= 1;
  return age;
}

export function isFuture(isoDob: string): boolean {
  return isoDob > todayInJoburg();
}
