# OMW Landing Page

Single-page bilingual (FR/EN) landing for rideomw.com.

## Run locally
Open `index.html` (no build step). `<!doctype html>.html` is kept in sync as a legacy copy.

## Configure lead capture (Vercel serverless)
Forms post to a Vercel serverless function that sends via SMTP.

- Keep `config.js` endpoints pointing to `/api/submit` (default).
- Set these Environment Variables in Vercel:
  - `SMTP_HOST`
  - `SMTP_PORT` (e.g. `587`)
  - `SMTP_SECURE` (`true` for 465, `false` for 587/STARTTLS)
  - `SMTP_USER`
  - `SMTP_PASS`
  - `MAIL_TO` (defaults to `SMTP_USER` if omitted)
  - `MAIL_FROM` (defaults to `SMTP_USER` if omitted)
  - `MAIL_FROM_NAME` (optional, default `OMW`)
  - `ALLOWED_ORIGINS` (comma-separated list, optional)

If you want to use Hostinger PHP instead, point endpoints to `/api/submit.php` and configure `api/mail-config.php` on a PHP host.

## Deploy (Vercel)
- Import the repo
- Framework preset: `Other`
- Build command: none
- Output directory: `.`

`index.html` is the static entry for Vercel.

## Notes
- Forms include a honeypot field for basic spam protection.
- Success and error states are handled client-side.
