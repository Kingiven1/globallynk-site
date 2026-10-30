// Shared helpers for The Mix Lab Community Partnership API. (Files starting with _ are not public routes.)
import { Resend } from 'resend';

export const TEAM_EMAIL = process.env.MIXLAB_TEAM_EMAIL || 'connect@indabooth.com';
export const FROM = 'The Mix Lab <noreply@globallynk.club>';

export const CATEGORIES = {
  health_wellness: 'Health & Wellness',
  ai_tech_creative: 'AI, Technology & Creative Futures',
  business_financial: 'Business Development & Financial Growth',
  community_social: 'Community & Social Capital',
};

export const PACKAGES = {
  standard: { label: 'Standard', price: 500, capacity: 3 },
  featured: { label: 'Featured', price: 1000, capacity: 1 },
};

export const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const money = (n) => `$${Number(n).toLocaleString('en-US')}`;

// Sends one email. Never throws: returns { ok, error } so a mail problem can't lose an application.
export async function sendEmail({ to, subject, text, html, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('MIXLAB EMAIL NOT SENT: RESEND_API_KEY is not set in Vercel.');
    return { ok: false, error: 'RESEND_API_KEY missing' };
  }
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({ from: FROM, to, subject, text, html, ...(replyTo ? { reply_to: replyTo } : {}) });
    if (error) {
      console.error('MIXLAB EMAIL ERROR:', error);
      return { ok: false, error: error.message || String(error) };
    }
    return { ok: true };
  } catch (err) {
    console.error('MIXLAB EMAIL EXCEPTION:', err);
    return { ok: false, error: String(err?.message || err) };
  }
}

// Wraps simple HTML content in the email shell.
export function emailShell(inner) {
  return `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1B1B3A;line-height:1.5">${inner}
    <p style="font-size:12px;color:#666;margin-top:28px">The Mix Lab is presented by GlobalLYNK, AmpSpot &amp; NFNTE Capital.</p></div>`;
}