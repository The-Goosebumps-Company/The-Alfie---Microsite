// Suggests a fix for likely email-domain typos (gmial.com → gmail.com).
const DOMAINS = [
  "gmail.com", "yahoo.com", "yahoo.co.za", "outlook.com", "hotmail.com", "hotmail.co.za",
  "icloud.com", "live.com", "live.co.za", "me.com", "mweb.co.za", "telkomsa.net",
  "webmail.co.za", "vodamail.co.za", "afrihost.co.za", "iafrica.com", "protonmail.com",
];

// Optimal string alignment distance: an adjacent swap (gmial) counts as one edit.
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (domain.length < 4 || DOMAINS.includes(domain)) return null;
  let best: string | null = null;
  let bestDist = 3;
  for (const candidate of DOMAINS) {
    const dist = distance(domain, candidate);
    if (dist < bestDist) {
      best = candidate;
      bestDist = dist;
    }
  }
  return best ? `${local}@${best}` : null;
}
