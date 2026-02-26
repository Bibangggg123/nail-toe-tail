/**
 * Vercel Serverless Function — Send SMS via Twilio
 *
 * Environment variables required in Vercel dashboard:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_PHONE_NUMBER   (your Twilio number, e.g. +1234567890)
 *   ADMIN_PHONE_NUMBER    (your personal number, e.g. +639543906942)
 */

const twilio = require('twilio');

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, ADMIN_PHONE_NUMBER } = process.env;

  // Check if Twilio is configured
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !ADMIN_PHONE_NUMBER) {
    return res.status(500).json({
      error: 'Twilio not configured',
      message: 'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, and ADMIN_PHONE_NUMBER in Vercel environment variables.',
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" in request body' });
  }

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const sms = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to:   ADMIN_PHONE_NUMBER,
    });

    return res.status(200).json({ success: true, sid: sms.sid });
  } catch (err) {
    console.error('Twilio error:', err);
    return res.status(500).json({ error: 'Failed to send SMS', details: err.message });
  }
};
