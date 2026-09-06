import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientEmail, recipientName, senderName, messageBody, context } = req.body || {};

  if (!recipientEmail || !senderName || !messageBody) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isClassChat = context === 'class_chat';

  try {
    await resend.emails.send({
      from: 'GlobalLYNK <noreply@globallynk.club>',
      to: recipientEmail,
      subject: isClassChat
        ? `${senderName} posted in Class Chat on GlobalLYNK`
        : `New message from ${senderName} on GlobalLYNK`,
      text: [
        `Hey ${recipientName || 'there'},`,
        '',
        isClassChat
          ? `${senderName} posted in Class Chat:`
          : `${senderName} sent you a message on GlobalLYNK:`,
        '',
        `"${messageBody}"`,
        '',
        'Reply at globallynk.club/portal',
      ].join('\n'),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend notify error:', error);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
}