import emailjs from '@emailjs/browser';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID_BOOKING = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_BOOKING;

/**
 * Send booking notification email via EmailJS.
 * @param {Object} bookingData - Booking details
 * @param {string} bookingData.museName - Name of the muse booked
 * @param {string} bookingData.durationLabel - Duration (e.g. "2 hours")
 * @param {string} bookingData.date - Desired date
 * @param {string} bookingData.time - Desired time
 * @param {string|number} bookingData.price - Price in EUR
 * @param {string} bookingData.firstName - Client first name
 * @param {string} bookingData.lastName - Client last name
 * @param {string} bookingData.email - Client email
 * @param {string} bookingData.phone - Client phone (optional)
 * @param {string} bookingData.preferredContact - 'email' or 'phone'
 * @returns {Promise<void>}
 */
export async function sendBookingEmail(bookingData) {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID_BOOKING) {
    console.warn('[EmailJS] Environment variables not configured. Skipping email.');
    return;
  }

  const templateParams = {
    muse_name: bookingData.museName || '',
    duration: bookingData.durationLabel || '',
    date: bookingData.date || '',
    time: bookingData.time || '',
    price: bookingData.price ? `${bookingData.price} €` : 'TBD',
    first_name: bookingData.firstName || '',
    last_name: bookingData.lastName || '',
    email: bookingData.email || '',
    phone: bookingData.phone || '—',
    preferred_contact: bookingData.preferredContact || 'email',
    submitted_at: new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
    }),
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID_BOOKING, templateParams, {
      publicKey: PUBLIC_KEY,
    });
  } catch (err) {
    console.error('[EmailJS] Failed to send booking email:', err);
  }
}
