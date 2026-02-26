/**
 * Booking Notification Service
 * Sends email via Nodemailer + Gmail (Vercel serverless function).
 *
 * 100% FREE — no third-party services, no paid plans.
 * Uses your own Gmail account to send notification emails.
 *
 * ─── ONE-TIME SETUP (~2 minutes) ──────────────────────────
 *
 * 1. Go to https://myaccount.google.com/security
 * 2. Enable "2-Step Verification" if not already on
 * 3. Go to https://myaccount.google.com/apppasswords
 *    - Select app: "Mail"
 *    - Select device: "Other" → type "Nail-Toe-Tail"
 *    - Click Generate → copy the 16-character password
 * 4. In Vercel dashboard → Project Settings → Environment Variables, add:
 *      GMAIL_USER      = mming9368@gmail.com
 *      GMAIL_APP_PASS  = xxxx xxxx xxxx xxxx
 * 5. Redeploy the project. Done!
 *
 * ───────────────────────────────────────────────────────────
 */

// ── Service & Specialist maps (for readable names) ─────────
const SERVICES = {
  '1': 'Nail Design', '2': 'Basic Manicure', '3': 'Gel Manicure',
  '4': 'Pedicure', '5': 'Nail Art', '6': 'Nail Extensions',
  '7': 'Nail Care & Treatment', '8': 'Lash Extensions', '9': 'Foot Spa',
};

const SPECIALISTS = {
  '1': 'Rose – Senior Nail & Beauty Specialist',
  '2': 'Pangging – Beauty & Spa Specialist',
};

// ── Build a nice HTML email ────────────────────────────────
function buildEmailHtml(appointment) {
  const serviceName    = SERVICES[appointment.service] || appointment.service || 'N/A';
  const specialistName = SPECIALISTS[appointment.specialist] || appointment.specialist || 'N/A';
  const bookingType    = appointment.type === 'homeservice' ? 'Home Service' : 'Salon Visit';
  const total          = appointment.grandTotal ? `₱${appointment.grandTotal}` : 'N/A';

  const rows = [
    ['👤 Client',     appointment.name || 'N/A'],
    ['📧 Email',      appointment.email || 'N/A'],
    ['📱 Phone',      appointment.phone || 'N/A'],
    ['💅 Service',    serviceName],
    ['👩‍🎨 Specialist', specialistName],
    ['📅 Date',       appointment.date || 'N/A'],
    ['🕐 Time',       appointment.time || 'N/A'],
    ['📍 Type',       bookingType],
  ];

  if (bookingType === 'Home Service') {
    rows.push(['🏠 Address', appointment.address || 'N/A']);
  }
  if (total !== 'N/A') {
    rows.push(['💰 Total', total]);
  }
  if (appointment.notes) {
    rows.push(['📝 Notes', appointment.notes]);
  }

  // Home service sub-services
  if (appointment.hsServiceDetails) {
    try {
      const details = typeof appointment.hsServiceDetails === 'string'
        ? JSON.parse(appointment.hsServiceDetails)
        : appointment.hsServiceDetails;
      if (Array.isArray(details) && details.length) {
        const list = details.map(d => `${d.name} – ₱${d.price}`).join('<br/>');
        rows.push(['🛎️ Services', list]);
      }
    } catch (_) { /* ignore parse errors */ }
  }

  const tableRows = rows.map(([label, value]) =>
    `<tr>
      <td style="padding:10px 14px;font-weight:600;color:#b8647a;white-space:nowrap;border-bottom:1px solid #f5d5e3;">${label}</td>
      <td style="padding:10px 14px;color:#333;border-bottom:1px solid #f5d5e3;">${value}</td>
    </tr>`
  ).join('');

  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#d98ba4,#e8b3d3);padding:24px;border-radius:14px 14px 0 0;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;">🔔 New Booking Received</h1>
        <p style="margin:6px 0 0;color:#fff;opacity:0.9;font-size:14px;">${serviceName} • ${appointment.date || ''} at ${appointment.time || ''}</p>
      </div>
      <div style="background:#fff;padding:0;border:1px solid #f5d5e3;border-top:none;border-radius:0 0 14px 14px;">
        <table style="width:100%;border-collapse:collapse;">
          ${tableRows}
        </table>
      </div>
      <p style="text-align:center;color:#999;font-size:12px;margin-top:16px;">
        — Nail-Toe-Tail Booking System
      </p>
    </div>
  `;
}

// ── Send Email via Vercel Serverless Function ──────────────
async function sendEmailNotification(appointment) {
  const serviceName = SERVICES[appointment.service] || appointment.service || 'Booking';

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `🔔 New Booking – ${serviceName} on ${appointment.date || 'TBD'}`,
        body:    buildEmailHtml(appointment),
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('[Notification] Email API error:', errData);
      return { success: false, error: errData };
    }

    console.log('[Notification] Email sent successfully');
    return { success: true };
  } catch (err) {
    console.error('[Notification] Email failed:', err);
    return { success: false, error: err };
  }
}

// ── Main: Send Booking Notification ────────────────────────
export async function sendBookingNotifications(appointment) {
  const result = await sendEmailNotification(appointment);

  console.log('[Notification] Result:', result);
  return result;
}
