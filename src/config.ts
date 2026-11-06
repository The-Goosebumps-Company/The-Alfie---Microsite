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
  minimumAge: 18,
  ageCookieDays: 30,
  // Per IP. Street scans share mobile-network IPs, so keep this generous.
  rateLimit: { max: 30, windowMs: 10 * 60 * 1000 },
  defaultSource: "direct",
} as const;

export const SPORTS = ["Rugby", "Football", "F1", "Cricket", "Golf", "Tennis", "Padel"] as const;
export type Sport = (typeof SPORTS)[number];

export const FAN_TYPES = ["analyst", "superfan", "host", "guest"] as const;
export type FanType = (typeof FAN_TYPES)[number];

// Internal mapping to Grid's brand-deck audiences. Stored, never shown.
export const FAN_AUDIENCE: Record<FanType, string> = {
  analyst: "Connoisseur",
  superfan: "Passionate Fan",
  host: "Social Architect",
  guest: "Uninitiated Guest",
};

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
