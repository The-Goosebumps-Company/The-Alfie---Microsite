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
    sportsHint: "Pick as many as you like.",
    sportsOther: "Other",
    sportsOtherLabel: "Which other sports?",
    sportsOtherPlaceholder: "e.g. Padel, Boxing",
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
    connoisseur: { title: "The Connoisseur", line: "A business dinner and a match night, equally." },
    passionate: { title: "The Passionate Fan", line: "Knows every stat and every vintage." },
    social: { title: "The Social Architect", line: "Organises the group, arrival to last orders." },
    uninitiated: { title: "The Uninitiated Luxury Guest", line: "Here for the table. Staying for the energy." },
  },
  // The Bench is a waitlist: nothing here may read as a ticket or a promise of entry.
  success: {
    heading: (firstName: string) => `You're on the bench, ${firstName}.`,
    body: "Stay warm. If you get the call-up for opening night, you'll hear from us first.",
    reserveLabel: "RESERVE No.",
    nextHeading: "What happens next",
    steps: [
      { title: "You’re on the bench", line: "Your place on the reserves list is saved. There’s nothing else you need to do." },
      {
        title: "Wait for the call-up",
        line: "Call-ups for opening night are made by The Alfie. If you’re selected, we’ll email you a personal invitation.",
      },
      { title: "Bring your invitation", line: "That email is your way in on the night. This page isn’t a ticket." },
    ],
    disclaimer: "Joining The Bench doesn’t guarantee entry to opening night.",
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
  email: {
    subject: (firstName: string) => `You're on the bench, ${firstName}.`,
    preview: (reserve: string) => `Reserve No. ${reserve}. Stay warm.`,
  },
} as const;
