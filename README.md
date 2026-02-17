# OMW Landing Page

Single-page bilingual (FR/EN) landing for rideomw.com.

## Run locally
Open `index.html` (no build step). `<!doctype html>.html` is kept in sync as a legacy copy.

## Configure lead capture (Hostinger email)
Forms post to a lightweight PHP endpoint that sends via SMTP.

- Copy `api/mail-config.example.php` to `api/mail-config.php` and fill in the SMTP settings from the Hostinger panel (host, port, encryption, username, password).
- Keep `config.js` endpoints pointing to `/api/submit.php` (default).
- `fallbackEmail` is used only in the error message (no auto mailto).

If you want to use Formspree or another provider instead, set the endpoints in `config.js` accordingly.

## Deploy (Vercel)
- Import the repo
- Framework preset: `Other`
- Build command: none
- Output directory: `.`

`index.html` is the static entry for Vercel.

## Notes
- Forms include a honeypot field for basic spam protection.
- Success and error states are handled client-side.
