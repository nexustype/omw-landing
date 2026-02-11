# OMW Landing Page

Single-page bilingual (FR/EN) landing for rideomw.com.

## Run locally
Open `index.html` (no build step). `<!doctype html>.html` is kept in sync as a legacy copy.

## Configure lead capture
Forms are wired through a simple config file:

- Edit `config.js`
- Set `riderFormEndpoint` and `driverFormEndpoint` to your Formspree (or equivalent) endpoints
- Optional: update `fallbackEmail`

If endpoints are empty, submissions fall back to a mailto draft.

## Deploy (Vercel)
- Import the repo
- Framework preset: `Other`
- Build command: none
- Output directory: `.`

`index.html` is the static entry for Vercel.

## Notes
- Forms include a honeypot field for basic spam protection.
- Success and error states are handled client-side.
