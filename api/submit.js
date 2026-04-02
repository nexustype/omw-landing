const nodemailer = require('nodemailer');
const querystring = require('querystring');

// Replace these placeholder banner URLs with your hosted email-safe image URLs.
const ENGLISH_BANNER_URL = 'https://YOUR-DOMAIN.com/path/to/omw-banner-en.png';
const FRENCH_BANNER_URL = 'https://YOUR-DOMAIN.com/path/to/omw-banner-fr.png';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
    return;
  }

  const origin = req.headers.origin || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (allowedOrigins.length && origin && !allowedOrigins.includes(origin)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'Origin not allowed' }));
    return;
  }

  let payload = req.body;
  if (!payload || typeof payload === 'string' || Buffer.isBuffer(payload)) {
    const raw = await readBody(req);
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    if (contentType.includes('application/json')) {
      try {
        payload = JSON.parse(raw || '{}');
      } catch (err) {
        payload = {};
      }
    } else {
      payload = querystring.parse(raw);
    }
  }

  const honeypot = String(payload.company || '').trim();
  if (honeypot) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const formType = String(payload.form_type || '').trim();
  const senderEmail = String(payload.email || '').trim();

  let subject = 'OMW form submission';
  if (formType) subject += ' — ' + formType;

  const lines = [];
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'company') return;
    if (Array.isArray(value)) return;
    const cleanValue = String(value || '').trim();
    if (!cleanValue) return;
    const cleanKey = String(key).replace(/[^a-zA-Z0-9_\- ]+/g, '');
    lines.push(cleanKey + ': ' + cleanValue.replace(/[\r\n]+/g, ' '));
  });

  const body = lines.join('\n');

  const host = String(process.env.SMTP_HOST || '');
  const port = Number(process.env.SMTP_PORT || 0);
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
  const user = String(process.env.SMTP_USER || '');
  const pass = String(process.env.SMTP_PASS || '');
  const toEmail = String(process.env.MAIL_TO || user);
  const fromEmail = String(process.env.MAIL_FROM || user);
  const fromName = String(process.env.MAIL_FROM_NAME || 'OMW');

  if (!host || !port || !user || !pass) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'SMTP is not configured' }));
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  const replyTo = isValidEmail(senderEmail) ? senderEmail : fromEmail;
  const lang = resolveLocale(payload);
  const firstName = extractFirstName(String(payload.name || '').trim());
  const autoReply = isValidEmail(senderEmail)
    ? getAutoReplyEmail({ firstName, lang })
    : null;

  try {
    await transporter.sendMail({
      from: `${encodeName(fromName)} <${fromEmail}>`,
      to: toEmail,
      replyTo,
      subject,
      text: body
    });

    let autoReplySent = false;
    if (autoReply) {
      try {
        await transporter.sendMail({
          from: `${encodeName(fromName)} <${fromEmail}>`,
          to: senderEmail,
          replyTo: fromEmail,
          subject: autoReply.subject,
          text: autoReply.text,
          html: autoReply.html
        });
        autoReplySent = true;
      } catch (autoReplyError) {
        console.error('OMW auto-reply failed:', autoReplyError);
      }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: true, autoReplySent }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'Failed to send email' }));
  }
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function encodeName(name) {
  if (!name) return name;
  return '=?UTF-8?B?' + Buffer.from(name, 'utf8').toString('base64') + '?=';
}

function getAutoReplyEmail({ firstName, lang }) {
  const locale = lang === 'fr' ? 'fr' : 'en';
  const content = locale === 'fr'
    ? {
        subject: 'Merci pour votre contribution — OMW',
        bannerUrl: FRENCH_BANNER_URL,
        bannerAlt: 'OMW — Premier contributeur',
        headline: 'Merci d’être là dès le début',
        bodyLines: [
          'Votre contribution nous aide à construire OMW à partir de vrais besoins de mobilité, pas d’hypothèses.',
          'OMW est encore en phase de développement, et des retours comme le vôtre aident à préparer les premiers tests.'
        ],
        signoffLines: ['— Daniel', 'OMW']
      }
    : {
        subject: 'Thanks for your input — OMW',
        bannerUrl: ENGLISH_BANNER_URL,
        bannerAlt: 'OMW — Early contributor',
        headline: 'Thanks for being early',
        bodyLines: [
          'Your input helps us build OMW around real commuting needs, not assumptions.',
          'We’re still in early development, and responses like yours help shape the first pilots.'
        ],
        signoffLines: ['— Daniel', 'OMW']
      };

  const greeting = firstName
    ? (locale === 'fr' ? `Bonjour ${firstName},` : `Hi ${firstName},`)
    : '';

  const textLines = [];
  if (greeting) {
    textLines.push(greeting, '');
  }
  textLines.push(`${content.headline}.`, '', ...content.bodyLines, '', ...content.signoffLines);

  return {
    subject: content.subject,
    text: textLines.join('\n'),
    html: buildAutoReplyHtml({
      lang: locale,
      bannerUrl: content.bannerUrl,
      bannerAlt: content.bannerAlt,
      greeting,
      headline: content.headline,
      bodyLines: content.bodyLines,
      signoffLines: content.signoffLines
    })
  };
}

function resolveLocale(payload) {
  const localeCandidate = String(payload.locale || payload.lang || payload.language || '')
    .trim()
    .toLowerCase();

  if (localeCandidate.startsWith('fr')) return 'fr';
  if (localeCandidate.startsWith('en')) return 'en';

  const formType = String(payload.form_type || '').toLowerCase();
  if (formType.includes('(fr)') || /\bfr\b/.test(formType)) return 'fr';

  return 'en';
}

function extractFirstName(name) {
  const normalized = name.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';

  const firstChunk = normalized.split(' ')[0];
  return firstChunk.replace(/^[^A-Za-zÀ-ÖØ-öø-ÿ0-9'-]+|[^A-Za-zÀ-ÖØ-öø-ÿ0-9'-]+$/g, '');
}

function buildAutoReplyHtml({ lang, bannerUrl, bannerAlt, greeting, headline, bodyLines, signoffLines }) {
  const greetingHtml = greeting
    ? `<p style="margin: 0 0 18px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #24405f;">${escapeHtml(greeting)}</p>`
    : '';
  const bodyHtml = bodyLines
    .map((line) => `<p style="margin: 0 0 12px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 26px; color: #4d637b;">${escapeHtml(line)}</p>`)
    .join('');
  const signoffHtml = signoffLines.map((line) => escapeHtml(line)).join('<br />');

  return [
    '<!doctype html>',
    `<html lang="${escapeHtml(lang)}">`,
    '<head>',
    '  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>OMW</title>',
    '</head>',
    '<body style="margin: 0; padding: 0; background-color: #f3f7fb;">',
    '  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; background-color: #f3f7fb;">',
    '    <tr>',
    '      <td align="center" style="padding: 24px 12px;">',
    '        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 600px; border-collapse: separate;">',
    '          <tr>',
    '            <td style="background-color: #ffffff; border: 1px solid #e4edf6; border-radius: 24px; overflow: hidden;">',
    '              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: separate;">',
    '                <tr>',
    '                  <td style="background-color: #eef5fb; padding: 0;">',
    `                    <img src="${escapeHtml(bannerUrl)}" alt="${escapeHtml(bannerAlt)}" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0; background-color: #eef5fb; font-family: Arial, Helvetica, sans-serif; font-size: 18px; line-height: 26px; color: #24405f;" />`,
    '                  </td>',
    '                </tr>',
    '                <tr>',
    '                  <td style="padding: 36px 40px 40px;">',
    `                    ${greetingHtml}`,
    `                    <h1 style="margin: 0 0 18px; font-family: Arial, Helvetica, sans-serif; font-size: 30px; line-height: 36px; font-weight: 700; color: #1f3554;">${escapeHtml(headline)}</h1>`,
    `                    ${bodyHtml}`,
    `                    <p style="margin: 24px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #24405f;">${signoffHtml}</p>`,
    '                  </td>',
    '                </tr>',
    '              </table>',
    '            </td>',
    '          </tr>',
    '        </table>',
    '      </td>',
    '    </tr>',
    '  </table>',
    '</body>',
    '</html>'
  ].join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
