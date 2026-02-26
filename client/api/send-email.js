/**
 * Vercel Serverless Function — Send Email via Nodemailer + Gmail
 *
 * 100% FREE — uses your own Gmail account. No third-party service needed.
 *
 * ─── SETUP (one-time, ~2 minutes) ─────────────────────────
 *
 * 1. Go to https://myaccount.google.com/security
 * 2. Enable "2-Step Verification" if not already on
 * 3. Go to https://myaccount.google.com/apppasswords
 * 4. Create an App Password:
 *    - Select app: "Mail"
 *    - Select device: "Other" → type "Nail-Toe-Tail"
 *    - Click Generate → copy the 16-character password
 * 5. In Vercel dashboard → Project Settings → Environment Variables, add:
 *      GMAIL_USER      = mming9368@gmail.com
 *      GMAIL_APP_PASS  = xxxx xxxx xxxx xxxx  (the 16-char app password)
 * 6. Redeploy. Done!
 *
 * ───────────────────────────────────────────────────────────
 */

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { GMAIL_USER, GMAIL_APP_PASS } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASS) {
    return res.status(500).json({
      error: 'Gmail not configured',
      message: 'Set GMAIL_USER and GMAIL_APP_PASS in Vercel environment variables.',
    });
  }

  const { subject, body, to } = req.body;

  if (!subject || !body) {
    return res.status(400).json({ error: 'Missing "subject" or "body" in request' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nail-Toe-Tail Bookings" <${GMAIL_USER}>`,
      to: to || GMAIL_USER,
      subject,
      html: body,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
};
