const nodemailer = require('nodemailer');
const querystring = require('querystring');

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

  try {
    await transporter.sendMail({
      from: `${encodeName(fromName)} <${fromEmail}>`,
      to: toEmail,
      replyTo,
      subject,
      text: body
    });

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: true }));
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
