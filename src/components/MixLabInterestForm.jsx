import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { color, font, radius, space, buttonPrimary } from '../styles/tokens';

// Collects Mix Lab (Art Basel Miami) interest into the mix_lab_interest table.

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bgRaised,
  border: `1px solid ${color.line}`,
  borderRadius: radius.sm,
  padding: '13px 14px',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontFamily: font.mono,
  fontSize: '11px',
  letterSpacing: '0.04em',
  color: color.cyanDim,
  marginBottom: '6px',
  textAlign: 'left',
};

export default function MixLabInterestForm() {
  const [fullName, setFullName] = useState('');
  const [djName, setDjName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [trap, setTrap] = useState(''); // hidden spam trap — real people never fill this in
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // Bots tend to fill every field. Pretend it worked and save nothing.
    if (trap) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    setMessage('');

    const { error } = await supabase.from('mix_lab_interest').insert({
      full_name: fullName.trim(),
      dj_name: djName.trim() || null,
      city: city.trim(),
      email: email.trim().toLowerCase(),
    });

    if (error) {
      setStatus('error');
      setMessage(
        error.code === '23505'
          ? "You're already on the list. We'll be in touch!"
          : 'Something went wrong. Please try again.'
      );
      return;
    }

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: `${space.md} 0` }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', color: color.white, marginBottom: '8px' }}>
          You&apos;re on the list.
        </div>
        <p style={{ fontFamily: font.body, fontSize: '15px', color: color.muted, margin: 0 }}>
          We&apos;ll send the official Mix Lab details to your inbox as soon as they&apos;re ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label htmlFor="ml-name" style={labelStyle}>FULL NAME</label>
        <input id="ml-name" type="text" required autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label htmlFor="ml-dj" style={labelStyle}>DJ OR BRAND NAME (IF YOU HAVE ONE)</label>
        <input id="ml-dj" type="text" value={djName} onChange={(e) => setDjName(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label htmlFor="ml-city" style={labelStyle}>CITY</label>
        <input id="ml-city" type="text" required autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label htmlFor="ml-email" style={labelStyle}>EMAIL</label>
        <input id="ml-email" type="email" required autoComplete="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
      </div>

      {/* Spam trap: hidden from people, visible to bots */}
      <div style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="ml-website">Website</label>
        <input id="ml-website" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ ...buttonPrimary, justifyContent: 'center', width: '100%', cursor: status === 'loading' ? 'default' : 'pointer' }}
      >
        {status === 'loading' ? 'Joining…' : 'Keep me posted →'}
      </button>

      {message && (
        <p style={{ fontFamily: font.mono, fontSize: '12px', margin: 0, color: status === 'error' ? '#E05252' : color.cyan }}>
          {message}
        </p>
      )}

      <p style={{ fontFamily: font.body, fontSize: '12px', color: color.mutedDim, margin: 0 }}>
        We&apos;ll only email you about The Mix Lab.
      </p>
    </form>
  );
}