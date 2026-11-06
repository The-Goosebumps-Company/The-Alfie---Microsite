// All visible strings. Change wording here, not in components.
// If the opt-in or privacy wording changes, bump consentTextVersion in config.ts.
import { config } from "./config";

export const copy = {
  ageGate: {
    heading: "Before you warm up",
    body: "The Alfie is for guests aged 18 and over. Enter your date of birth.",
    day: "DD",
    month: "MM",
    year: "YYYY",
    dayLabel: "Day",
    monthLabel: "Month",
    yearLabel: "Year",
    button: "Take your seat",
    invalid: "Enter a real date of birth.",
    underage: "Sorry, you need to be 18 or older to visit this site.",
  },
  hero: {
    eyebrow: `MELROSE ARCH · HIGH STREET · ${config.openingMonth.toUpperCase()}`,
    headline: "Get on the bench.",
    subhead:
      "Opening night is coming. Join The Bench and you could get the call-up to take the field when The Alfie opens its doors.",
  },
  form: {
    firstName: "First name",
    surname: "Surname",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    mobile: "Mobile number (optional)",
    mobilePlaceholder: "082 123 4567",
    countryCode: "Country code",
    sports: "Sports you follow",
    sportsPlaceholder: "Search or add a sport",
    sportsAdd: (sport: string) => `Add “${sport}”`,
    sportsRemove: (sport: string) => `Remove ${sport}`,
    sportsFull: "That’s a full squad.",
    fanType: "What kind of fan are you? (optional)",
    emailOptIn: "Keep me in the game: email me Alfie news, invites and first access to bookings.",
    whatsappOptIn: "WhatsApp me updates too.",
    privacyBefore: "By joining you confirm you're 18+ and agree to our ",
    privacyLink: "Privacy Policy",
    privacyAnd: " and ",
    termsLink: "Terms",
    privacyAfter: ". Opt out any time.",
    button: "Join the bench",
    loading: "Warming up…",
  },
  // Titles from the brand deck's target audience page; lines rewritten for guests.
  fanSection: {
    heading: "The elevated sports fan",
  },
  fanTypes: {
    connoisseur: { title: "The Connoisseur", line: "A business dinner and a match night, equally.", ticket: "Connoisseur" },
    passionate: { title: "The Passionate Fan", line: "Knows every stat and every vintage.", ticket: "Passionate Fan" },
    social: { title: "The Social Architect", line: "Organises the group, arrival to last orders.", ticket: "Social Architect" },
    uninitiated: { title: "The Uninitiated Luxury Guest", line: "Here for the table. Staying for the energy.", ticket: "Luxury Guest" },
  },
  success: {
    heading: (firstName: string) => `You're on the bench, ${firstName}.`,
    body: "Stay warm. If you get the call-up for opening night, you'll hear from us first.",
    ticketAlt: (name: string, squad: string) =>
      `Your bench ticket: ${name}, Squad No. ${squad}, The Alfie opening night, ${config.openingMonth}.`,
    button: "Save my ticket",
    follow: `Follow ${config.socialHandle}`,
  },
  errors: {
    required: "We'll need this to put you on the bench.",
    email: "That email doesn't look right.",
    suggestion: (s: string) => `Did you mean ${s}?`,
    mobile: "Check your number, e.g. 082 123 4567.",
    name: "Use letters only, please.",
    already: "You're already on the bench. We'll be in touch.",
    server: "Something went wrong on our side. Please try again.",
    tooMany: "Too many tries from this connection. Give it a few minutes.",
  },
  footer: {
    partners: "In partnership with Heineken, Marble Hospitality and G&G The Goosebumps Company",
    responsible: "Enjoy Heineken Responsibly. Not for sale to persons under the age of 18.",
    privacy: "Privacy Policy",
    terms: "Terms",
  },
  ticket: {
    byline: "BY HEINEKEN", // sits beside The Alfie wordmark
    event: "Opening Night",
    eventDate: config.openingMonth.toUpperCase(),
    gate: "GATE",
    gateValue: "High Street",
    stand: "STAND",
    standValue: "The Bench",
    squad: "SQUAD No.",
    fan: "FAN",
    venue: "MELROSE ARCH · JOHANNESBURG",
    admit: "ADMIT ONE",
    reserve: "RESERVE",
    barcodeCaption: "THE BENCH",
    smallPrint: "Not a confirmed seat. Call-ups are made by The Alfie. 18+. Enjoy Heineken Responsibly.",
  },
  email: {
    subject: (firstName: string) => `You're on the bench, ${firstName}.`,
    preview: (squad: string) => `Squad No. ${squad}. Stay warm.`,
  },
} as const;
