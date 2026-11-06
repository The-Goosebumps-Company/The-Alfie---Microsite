// Every setting that may change before launch lives here.
export const config = {
  openingMonth: "May 2027",
  socialHandle: "@thealfie", // TBC
  socialUrl: "https://instagram.com/thealfie", // TBC
  siteUrl: "https://thealfie.co.za",
  privacyUrl: "/privacy", // placeholder page
  termsUrl: "/terms", // placeholder page
  competitionTermsUrl: "/terms#call-ups", // placeholder; needed if The Bench becomes a draw
  // Bump this whenever the opt-in or privacy wording in copy.ts changes.
  consentTextVersion: "2026-11-06.v1",
  // Bump when the ticket design changes so browsers fetch the new image instead of a cached one.
  ticketVersion: 3,
  minimumAge: 18,
  ageCookieDays: 30,
  // Per IP. Street scans share mobile-network IPs, so keep this generous.
  rateLimit: { max: 30, windowMs: 10 * 60 * 1000 },
  defaultSource: "direct",
} as const;

// Suggestions in the sports picker, most-followed first. Guests can also add their own.
export const SPORTS = [
  "Rugby", "Football", "Cricket", "F1", "Golf", "Tennis", "Padel", "Boxing", "UFC / MMA", "Basketball",
  "NFL", "Athletics", "Cycling", "Horse racing", "MotoGP", "Netball", "Hockey", "Swimming", "Surfing",
  "Polo", "Sailing", "Squash", "Darts", "Snooker", "Esports", "Baseball", "Ice hockey", "Volleyball",
  "Triathlon", "Rowing",
];
export const MAX_SPORTS = 12;
export const MAX_SPORT_LENGTH = 30;

// The four audiences from Grid's brand deck ("The elevated sports fan").
export const FAN_TYPES = ["connoisseur", "passionate", "social", "uninitiated"] as const;
export type FanType = (typeof FAN_TYPES)[number];

export const COUNTRY_CODES = [
  { code: "+27", label: "ZA +27" },
  { code: "+264", label: "NA +264" },
  { code: "+267", label: "BW +267" },
  { code: "+263", label: "ZW +263" },
  { code: "+258", label: "MZ +258" },
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "US +1" },
  { code: "+61", label: "AU +61" },
  { code: "+971", label: "AE +971" },
] as const;
