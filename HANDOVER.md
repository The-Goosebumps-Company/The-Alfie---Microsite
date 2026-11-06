# The Alfie: "The Bench" registration microsite
Handover for Claude Code · v1 · 6 Nov 2026 · owner: Kelvin Urwin (G&G)

## 1. What we're building

A mobile-first landing page that the QR code on The Alfie's hoarding at Melrose Arch, Johannesburg, opens.

Visitors fill in one short form to **join The Bench**: the reserves list for The Alfie's opening night. The football and rugby idea: you're named on the bench, warming up, hoping for the call-up onto the pitch on opening night.

The whole thing must be **quick, simple and effective**, about 30 seconds from scan to done.

The Alfie by Heineken is a luxury sporting house (premium sports bar) opening May 2027. It's a partnership between G&G, Marble Hospitality and Heineken. Line: "The best seat in the house." Tagline: "Where the game meets the good life."

## 2. Scope

**v1 (build now)**
- Age gate (date of birth).
- Landing and form on one page.
- Server-side validation and storage.
- Success screen showing the digital "bench ticket".
- Source tracking from the QR (`?src=`).

**v2 (later, after the site is built)**
- Automated success email with the ticket banner. Spec in §9 so the ticket component is built to be reused.
- WhatsApp messaging, admin export and analytics pixels.

## 3. Screens and flow

1. **Age gate.** Date of birth. Under 18 → a polite block screen. 18+ → the form. Remember a pass for 30 days (a cookie) and carry the DOB into the submission so it isn't asked twice.
2. **Landing and form.** A short hero at the top and the form directly under it. No extra pages and no carousels.
3. **Submit.** Show a loading state, validate on the server, save, then go to the success screen.
4. **Success.** "You're on the bench" plus the personalised bench ticket (§9), with a "Save ticket" button that downloads a PNG.
5. **Errors.** Inline under each field. Never clear the form on an error.

## 4. Copy (use exactly; keep all strings in one `copy.ts` so they're easy to change)

### Age gate
- Eyebrow: `THE ALFIE · BY HEINEKEN`
- Heading: `Before you warm up`
- Body: `The Alfie is for guests aged 18 and over. Enter your date of birth.`
- Fields: `DD` `MM` `YYYY` (three numeric inputs; auto-advance on each)
- Button: `Enter`
- Under-18 screen: `Sorry, you need to be 18 or older to visit this site.`

### Hero
- Eyebrow: `MELROSE ARCH · HIGH STREET · MAY 2027`
- Headline: `Get on the bench.`
- Subhead: `Opening night is coming. Join The Bench and you could get the call-up to take the field when The Alfie opens its doors.`
- Small line under it: `Takes 30 seconds. Free to join.`

### Form
| Field | Label | Placeholder / options | Required |
|---|---|---|---|
| First name | `First name` | | Yes |
| Surname | `Surname` | | Yes |
| Email | `Email address` | `you@email.com` | Yes |
| Mobile | `Mobile number (optional)` | `082 123 4567`, with +27 pre-selected | No |
| Sports | `Sports you follow` | Multi-select chips: `Rugby` `Football` `F1` `Cricket` `Golf` `Tennis` `Padel` | No |
| Fan type | `What kind of fan are you? (optional)` | Single-select cards (below) | No |
| Email opt-in | checkbox | `Keep me in the game: email me Alfie news, invites and first access to bookings.` | Must answer the form; box unticked by default |
| WhatsApp opt-in | checkbox, only shown once a mobile is entered | `WhatsApp me updates too.` | No; unticked by default |

Fan type cards (title + exactly four words):
- **The Analyst** · `Every stat, every play.`
- **The Superfan** · `Lives and breathes matchday.`
- **The Host** · `Brings the whole crew.`
- **The Guest** · `Here for the vibe.`

(Internal mapping to Grid's brand-deck audiences; store it, never show it: Analyst = Connoisseur, Superfan = Passionate Fan, Host = Social Architect, Guest = Uninitiated Guest.)

- Privacy line above the button: `By joining you confirm you're 18+ and agree to our Privacy Policy and Terms. Opt out any time.` (Links are placeholders for now.)
- Button: `Join the bench`
- Loading: `Warming up…`

### Success screen
- Heading: `You're on the bench, {firstName}.`
- Body: `Stay warm. If you get the call-up for opening night, you'll hear from us first.`
- Ticket: see §9.
- Button: `Save my ticket`
- Footer link: `Follow @thealfie` (handle TBC; keep it in config).

### Errors
- Required field: `We'll need this to put you on the bench.`
- Bad email: `That email doesn't look right.`
- Likely typo (gmial.com, gmal.com, yaho.com, outlook.co, etc.): `Did you mean {suggestion}?` (tap to accept)
- Bad mobile: `Check your number, e.g. 082 123 4567.`
- Already registered (same email): `You're already on the bench. We'll be in touch.` Then show the success screen with their existing ticket number.
- Server error: `Something went wrong on our side. Please try again.`

### Footer (every screen)
`Enjoy Heineken Responsibly. Not for sale to persons under the age of 18.` · Privacy Policy · Terms

## 5. Data model

`registrations`
- `id` (uuid)
- `squad_number` (sequential int, starts at 1, displayed zero-padded as 0001)
- `first_name`, `surname`, `email` (unique, lowercased), `mobile` (nullable, stored E.164, e.g. +27821234567)
- `date_of_birth` (date)
- `sports` (text[])
- `fan_type` (enum: analyst | superfan | host | guest, nullable)
- `email_opt_in` (bool), `whatsapp_opt_in` (bool)
- `consent_text_version` (string; the exact wording shown, versioned)
- `consent_at` (timestamptz)
- `source` (from `?src=`, default `direct`; expected values hoarding, window, peephole-01…06, instagram, film), `box` (from `?box=`, nullable)
- `user_agent`, `created_at`

Rules:
- Validate on the server (re-check age ≥ 18 there too).
- Rate-limit by IP.
- Add a honeypot field instead of a captcha.
- No analytics or third-party scripts in v1.

## 6. Design direction

The look carries on from the hoarding (a top-down rugby pitch in Heineken green with gold markings). The page should feel like the touchline: you're standing at the side of the pitch, at the bench.

- **Colours:**
  - deep green `#072a21`
  - pitch greens `#0a3328` and `#0c3a2d` (alternating mow stripes)
  - gold/brass `#C9A45C`
  - cream text `#F0E8D4`
  - muted text `#C8C8BE`
  - Alfie red star `#D7262E` (accent only, sparingly)
- **Type:** headings in Cormorant Garamond 500 (stand-in for Grid's Romie Serif); labels, numbers and buttons in Oswald 500/600; body in Jost 400/500 (stand-in for Europa Sans). Use Google Fonts for now and keep the font family names in one place so they can be swapped for Grid's files.
- **Motif:**
  - Faint vertical mow stripes in the background.
  - A thin gold touchline framing the page.
  - The hero can show the halfway line with "22 / 10 / 50" markings.
  - The form panel sits like a dugout/bench along the touchline.
  - Subtle, never busy. No stock photos, no people, no beer imagery.
- **Feel:** premium hospitality box, not a loud sports bar. Generous spacing and big tap targets (min 48px).
- **Night readability:** the QR is scanned on the street, so ensure WCAG AA contrast on the dark green.
- **Motion:** one small moment only: the ticket slides up on success. Respect `prefers-reduced-motion`.
- **Performance:** loads in under 2s on mobile data.

**Assets in this folder**
- `assets/alfie-lockup-white.png`: The Alfie logo with the red star (a draft cut-out; Grid's final logo will replace it).
- `assets/sport-icons-row.png`: the sport icons used on the hoarding.
- `reference/hoarding-rugby-master.png` and `reference/hoarding-rugby-shopfront.png`: the hoarding the QR lives on, for the look and feel.

## 7. Compliance must-haves (alcohol brand + POPIA)

- Age gate before any content; 18+ only; re-check on the server.
- The responsible-drinking footer on every screen.
- Opt-in boxes always unticked by default. Store the consent wording version and timestamp.
- Collect only the fields above.
- No imagery of people; no drinking linked to driving or the F1 car.
- Don't promise a guaranteed opening-night spot. The copy says "could get the call-up". If The Bench becomes a draw or selection for opening night, it needs competition terms (link placeholder for now).
- Privacy Policy and Terms are placeholder pages. Who owns the list (Marble, G&G or Heineken) is still TBC.

## 8. Tech suggestion (Claude Code may propose better)

- Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel.
- Supabase (Postgres) for `registrations`. Put every write behind a server action/API route, never the client.
- Ticket PNG: render the ticket component to an image (e.g. `@vercel/og` / Satori) at `/api/ticket/[id]`. The same image is used for "Save my ticket" now and in the email later.
- v2 email: Resend + React Email.
- Config file: opening month, social handle, policy URLs, consent text version.

## 9. The bench ticket (build now as a component; reused in the v2 email)

It looks like a local South African match ticket: the paper ticket you'd keep from a Saturday at Ellis Park or the Wanderers, done in Alfie style. Inspired by that feel; don't copy any real ticketing brand, stadium or team marks.

- **Format:** landscape, 600 × 240 for the email banner (2× asset), a perforated stub on the right separated by a dashed gold line with half-circle notches top and bottom.
- **Paper:** cream `#F0E8D4` with a fine green guilloche/security-line pattern and a faint pitch outline watermark. Green `#072a21` print, gold accents, the red star as the only red.
- **Main section:**
  - `THE ALFIE · BY HEINEKEN` (small caps, spaced)
  - `OPENING NIGHT · MAY 2027`
  - Large: `{FIRST NAME} {SURNAME}`
  - A row of ticket fields: `GATE High Street` · `STAND The Bench` · `SQUAD No. {0427}` · `FAN {The Analyst}` (fan type only if chosen)
  - `MELROSE ARCH · JOHANNESBURG`
- **Stub:** `ADMIT ONE · RESERVE`, the squad number repeated, and a decorative barcode (not scannable, clearly decorative).
- **Small print along the bottom:** `Not a confirmed seat. Call-ups are made by The Alfie. 18+. Enjoy Heineken Responsibly.`
- **Email (v2):**
  - Subject: `You're on the bench, {firstName}.`
  - Preview: `Squad No. {0427}. Stay warm.`
  - Ticket banner at the top, then 3 short lines repeating the success copy, then the footer, unsubscribe and privacy link.

## 10. Placeholders / open items (don't block the build)

- The final logo, Grid's fonts and the QR destination URL (assume `thealfie.co.za/bench`; also serve `/register` as a redirect).
- The social handle, the Privacy Policy, Terms and competition terms.
- The data owner and the email sending domain.
- Opening month (May 2027; keep it in config).

## 11. First prompt to paste into Claude Code

> Read HANDOVER.md in this folder. Build v1 of The Alfie "Bench" registration microsite as specified: age gate, a one-page landing + form, server-side validation and storage, and a success screen with the bench ticket (also rendered to PNG). Use the assets in /assets and match the look of /reference. Keep all copy in copy.ts and all settings in config.ts. Start by proposing the file structure and a short plan, then build it, run it locally, and show me the mobile view.
