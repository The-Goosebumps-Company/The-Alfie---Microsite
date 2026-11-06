# The Alfie · The Bench

Registration microsite behind the QR on The Alfie's Melrose Arch hoarding. Spec: [HANDOVER.md](HANDOVER.md).

Age gate → one-page hero + form → success screen with a personalised bench ticket (also a PNG).

## Run it locally

Needs Node 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000/bench?src=hoarding. Without Supabase keys, sign-ups save to `.data/registrations.json` (git-ignored).

## Where things live

| What | Where |
|---|---|
| All wording | `src/copy.ts` |
| Settings (opening month, handle, policy URLs, consent version, rate limit) | `src/config.ts` |
| Fonts (Google stand-ins for Grid's) | `src/fonts/index.ts`, files in `src/fonts/web` and `src/fonts/ticket` |
| Bench ticket (page + PNG, reused for the v2 email) | `src/ticket/` → `/api/ticket/[id]` (`?download=1` to save) |
| Server rules (age re-check, validation, honeypot, rate limit) | `src/app/api/register/route.ts` |
| Database schema | `supabase/migrations/0001_registrations.sql` |

Routes: `/bench` (the QR target), `/` and `/register` redirect there keeping `?src=` and `?box=`; `/privacy` and `/terms` are placeholders.

## Going live (Vercel + Supabase)

1. Create a Supabase project and run `supabase/migrations/0001_registrations.sql` in its SQL editor.
2. Import the repo into Vercel and set the env vars from `.env.example`:
   `AGE_COOKIE_SECRET` (long random string), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Point `thealfie.co.za` at Vercel. The QR should open `https://thealfie.co.za/bench?src=hoarding`.

On Vercel the site refuses to save without Supabase, so sign-ups can't silently go nowhere.

## Notes

- If the opt-in or privacy wording changes, bump `consentTextVersion` in `config.ts`.
- Someone re-entering an existing email only gets their ticket back if the name matches too; otherwise they see "You're already on the bench", so nobody can look up another person's details.
- The rate limit is in memory, per server instance, and generous (30 per IP per 10 min) because phones on the street share mobile-network IPs.
