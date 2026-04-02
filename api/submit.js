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
  const autoReply = buildAutoReply(payload, senderEmail);

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
          to: autoReply.to,
          replyTo: fromEmail,
          subject: autoReply.subject,
          text: autoReply.text
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

function buildAutoReply(payload, senderEmail) {
  if (!isValidEmail(senderEmail)) return null;

  const locale = resolveLocale(payload);
  const firstName = extractFirstName(String(payload.name || '').trim());
  const greeting = firstName
    ? (locale === 'fr' ? `Bonjour ${firstName},` : `Hi ${firstName},`)
    : (locale === 'fr' ? 'Bonjour,' : 'Hi,');

  if (locale === 'fr') {
    return {
      to: senderEmail,
      subject: 'Merci — ton retour aide à façonner OMW',
      text: [
        greeting,
        '',
        "Merci d'avoir partagé tes informations.",
        '',
        "OMW en est encore à ses débuts, et c'est précisément pour ça que ton retour compte. On ne lance pas une application publique parfaitement aboutie demain : on construit avec soin autour de vrais problèmes de mobilité, une étape après l'autre.",
        '',
        "Des réponses comme la tienne nous aident à comprendre où le besoin est le plus fort, ce que les gens attendent vraiment d'un service comme celui-ci, et comment préparer un premier pilote vraiment utile.",
        '',
        "Tu auras peut-être de nos nouvelles plus tard pour une mise à jour pertinente, une courte demande de feedback, ou un accès anticipé aux premiers tests quand nous serons prêts. D'ici là, merci de faire partie du tout début.",
        '',
        '— Daniel',
        'Fondateur, OMW'
      ].join('\n')
    };
  }

  return {
    to: senderEmail,
    subject: 'Thanks — your input helps shape OMW',
    text: [
      greeting,
      '',
      'Thanks for sharing your details.',
      '',
      "OMW is still in an early stage, and that's exactly why your input matters. We're not launching a polished public app tomorrow — we're building carefully around real-world mobility problems, one step at a time.",
      '',
      'Responses like yours help us understand where the strongest need is, what people actually expect from a service like this, and how to prepare the first meaningful pilot.',
      '',
      "You may hear from us later for a relevant update, a quick feedback request, or early testing access when we're ready. Until then, thanks for being part of the very beginning.",
      '',
      '— Daniel',
      'Founder, OMW'
    ].join('\n')
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
