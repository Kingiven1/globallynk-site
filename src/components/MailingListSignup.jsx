import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { color, font, radius, space } from '../styles/tokens';

export default function MailingListSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const { error } = await supabase.from('mailing_list_subscribers').insert({ email });

    if (error) {
      setStatus('error');
      setMessage(error.code === '23505' ? "You're already on the list!" : 'Something went wrong — try again.');
      return;
    }

    setStatus('success');
    setMessage("You're in. Watch your inbox for monthly events and tips.");
    setEmail('');
  }

  return (
    <div>
      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', color: color.white, marginBottom: '6px' }}>
        Stay in the Lynk
      </h3>
      <p style={{ fontFamily: font.body, fontSize: '14px', color: color.muted, marginBottom: space.sm }}>
        Monthly events and tips, straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: '1 1 200px',
            fontFamily: font.body,
            fontSize: '14px',
            color: color.white,
            background: color.bgRaised,
            border: `1px solid ${color.line}`,
            borderRadius: radius.sm,
            padding: '12px 14px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            fontFamily: font.mono,
            fontSize: '13px',
            color: color.bg,
            background: color.cyan,
            border: 'none',
            borderRadius: radius.sm,
            padding: '12px 20px',
            cursor: 'pointer',
          }}
        >
          {status === 'loading' ? 'Joining…' : 'Join'}
        </button>
      </form>
      {message && (
        <p style={{ fontFamily: font.mono, fontSize: '12px', marginTop: '8px', color: status === 'error' ? '#E05252' : color.cyan }}>
          {message}
        </p>
      )}
    </div>
  );
}