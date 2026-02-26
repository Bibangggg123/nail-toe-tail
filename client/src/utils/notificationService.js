/**
 * Booking Notification Service
 * Sends email (EmailJS) and SMS (Twilio via Vercel API) on new bookings.
 *
 * ─── SETUP INSTRUCTIONS ───────────────────────────────────
 *
 * 1) EMAIL — EmailJS (free, client-side)
 *    a. Sign up at https://www.emailjs.com  (free tier = 200 emails/month)
 *    b. Dashboard → Email Services → Add Service → choose Gmail →
 *       connect your Gmail (mming9368@gmail.com) and note the **Service ID**.
 *    c. Dashboard → Email Templates → Create New →
 *       Set the template body, e.g.:
 *
 *         Subject: 🔔 New Booking – {{service}} on {{date}}
 *         Body:
 *           Hi Admin,
 *
 *           A new booking has been made:
 *
 *           Client: {{client_name}}
 *           Email: {{client_email}}
 *           Phone: {{client_phone}}
 *           Service: {{service}}
 *           Specialist: {{specialist}}
 *           Date: {{date}}
 *           Time: {{time}}
 *           Type: {{booking_type}}
 *           Notes: {{notes}}
 *
 *           — Nail-Toe-Tail Booking System
 *
 *       Note the **Template ID**.
 *    d. Dashboard → Account → Public Key → copy it.
 *    e. Paste the three values below in EMAILJS_CONFIG.
 *
 * 2) SMS — Twilio (via Vercel serverless function)
 *    a. Sign up at https://www.twilio.com  (free trial gives credits)
 *    b. Get your Account SID, Auth Token, and a Twilio phone number.
 *    c. In your Vercel dashboard → Project Settings → Environment Variables, add:
 *         TWILIO_ACCOUNT_SID  = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *         TWILIO_AUTH_TOKEN   = your_auth_token
 *         TWILIO_PHONE_NUMBER = +1xxxxxxxxxx  (your Twilio number)
 *         ADMIN_PHONE_NUMBER  = +639543906942  (your personal number)
 *    d. Redeploy. The /api/send-sms endpoint will use these.
 *
 * ───────────────────────────────────────────────────────────
 */

import emailjs from '@emailjs/browser';

// ── EmailJS Configuration ──────────────────────────────────
// Replace these with your real values from emailjs.com dashboard
const EMAILJS_CONFIG = {
  serviceId:  'YOUR_EMAILJS_SERVICE_ID',   // e.g. 'service_abc123'
  templateId: 'YOUR_EMAILJS_TEMPLATE_ID',  // e.g. 'template_xyz789'
  publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',    // e.g. 'abcDEF123456'
};

// Admin email to receive notifications
const ADMIN_EMAIL = 'mming9368@gmail.com';

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

// ── Format booking data for notifications ──────────────────
function formatBookingPayload(appointment) {
  const serviceName = SERVICES[appointment.service] || appointment.service || 'N/A';
  const specialistName = SPECIALISTS[appointment.specialist] || appointment.specialist || 'N/A';
  const bookingType = appointment.type === 'homeservice' ? 'Home Service' : 'Salon Visit';

  return {
    client_name:  appointment.name || 'N/A',
    client_email: appointment.email || 'N/A',
    client_phone: appointment.phone || 'N/A',
    service:      serviceName,
    specialist:   specialistName,
    date:         appointment.date || 'N/A',
    time:         appointment.time || 'N/A',
    notes:        appointment.notes || 'None',
    booking_type: bookingType,
    admin_email:  ADMIN_EMAIL,
    address:      appointment.address || 'N/A',
    grand_total:  appointment.grandTotal ? `₱${appointment.grandTotal}` : 'N/A',
  };
}

// ── Send Email Notification via EmailJS ────────────────────
async function sendEmailNotification(appointment) {
  // Skip if not configured
  if (EMAILJS_CONFIG.serviceId.startsWith('YOUR_')) {
    console.warn('[Notification] EmailJS not configured — skipping email.');
    return { success: false, reason: 'not_configured' };
  }

  try {
    const payload = formatBookingPayload(appointment);
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      payload,
      EMAILJS_CONFIG.publicKey,
    );
    console.log('[Notification] Email sent:', result.status);
    return { success: true };
  } catch (err) {
    console.error('[Notification] Email failed:', err);
    return { success: false, error: err };
  }
}

// ── Send SMS Notification via Vercel API ───────────────────
async function sendSmsNotification(appointment) {
  try {
    const payload = formatBookingPayload(appointment);
    const smsBody = [
      `🔔 New Booking!`,
      `Client: ${payload.client_name}`,
      `Service: ${payload.service}`,
      `Date: ${payload.date} at ${payload.time}`,
      `Type: ${payload.booking_type}`,
      payload.booking_type === 'Home Service' ? `Address: ${payload.address}` : '',
      payload.grand_total !== 'N/A' ? `Total: ${payload.grand_total}` : '',
      `Phone: ${payload.client_phone}`,
    ].filter(Boolean).join('\n');

    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: smsBody }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('[Notification] SMS API error:', errData);
      return { success: false, error: errData };
    }

    console.log('[Notification] SMS sent successfully');
    return { success: true };
  } catch (err) {
    console.error('[Notification] SMS failed:', err);
    return { success: false, error: err };
  }
}

// ── Main: Send All Notifications ───────────────────────────
export async function sendBookingNotifications(appointment) {
  // Fire both in parallel — don't block the booking flow
  const [emailResult, smsResult] = await Promise.allSettled([
    sendEmailNotification(appointment),
    sendSmsNotification(appointment),
  ]);

  console.log('[Notification] Results:', {
    email: emailResult.status === 'fulfilled' ? emailResult.value : emailResult.reason,
    sms:   smsResult.status === 'fulfilled'   ? smsResult.value   : smsResult.reason,
  });
}
