import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    eventDate,
    eventTime,
    eventType,
    venue,
    guestCount,
    budget,
    genres,
    details,
  } = req.body || {};

  if (!name || !email || !eventDate || !eventType || !venue) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'GlobalLYNK Bookings <bookings@globallynk.club>',
      to: 'thegloballynk@gmail.com',
      replyTo: email,
      subject: `New DJ Booking Request — ${name} (${eventDate})`,
      text: [
        'New DJ booking request from globallynk.club:',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Event Date: ${eventDate}`,
        `Event Time: ${eventTime || 'Not provided'}`,
        `Event Type: ${eventType}`,
        `Venue / Location: ${venue}`,
        `Estimated Guests: ${guestCount || 'Not provided'}`,
        `Budget Range: ${budget || 'Not provided'}`,
        `Genre / Vibe: ${genres || 'Not provided'}`,
        '',
        'Additional details:',
        details || 'None provided.',
      ].join('\n'),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
