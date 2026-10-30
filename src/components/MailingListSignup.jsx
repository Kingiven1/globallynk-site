import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { color, font, radius, space } from '../styles/tokens';

const CITY_CHOICES = ['Charlotte', 'Washington, DC'];
const OTHER = '__other';

// Optional props (all default to the original behavior, so existing uses don't change):
//   heading        - title above the form. Pass null to hide it.
//   subtext        - line under the title. Pass null to hide it.
//   successMessage - what people see after joining.
//   askCity        - show a "which city" picker (Charlotte / Washington, DC / Other).
//   cityRequired   - make the city picker required (use for waitlists).
//   buttonLabel    - text on the submit button.
export default function MailingListSignup({
  heading = 'Stay in the Lynk',
  subtext = 'Monthly events and tips, straight to your inbox.',
  successMessage = "You're in. Watch your inbox for monthly events and tips.",
  askCity = false,
  cityRequired = false,
  buttonLabel = 'Join',
}) {
  const [email, setEmail] = useState('');
  const [cityChoice, setCityChoice] = useState('');
  const [otherCity, setOtherCity] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const fieldStyle = {
    fontFamily: font.body,
    fontSize: '14px',
    color: color.white,
    background: color.bgRaised,
    border: `1px solid ${color.line}`,
    borderRadius: radius.sm,
    padding: '12px 14px',
    outline: 'none',
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    let city = null;
    if (askCity) {
      city = cityChoice === OTHER ? otherCity.trim() : cityChoice;
      if (cityRequired && !city) {
        setStatus('error');
        setMessage(cityChoice === OTHER ? 'Tell us which city you are in.' : 'Pick your city so we know where to reach you.');
        return;
      }
    }

    setStatus('loading');
    const row = { email };
    if (city) row.city = city.slice(0, 80);

    const { error } = await supabase.from('mailing_list_subscribers').insert(row);

    if (error) {
      setStatus('error');
      setMessage(error.code === '23505' ? "You're already on the list!" : 'Something went wrong — try again.');
      return;
    }

    setStatus('success');
    setMessage(successMessage);
    setEmail('');
    setCityChoice('');
    setOtherCity('');
  }

  return (
    <div>
      {heading && (
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', color: color.white, marginBottom: '6px' }}>
          {heading}
        </h3>
      )}
      {subtext && (
        <p style={{ fontFamily: font.body, fontSize: '14px', color: color.muted, marginBottom: space.sm }}>
          {subtext}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          placeholder="you@email.com"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...fieldStyle, flex: '1 1 200px' }}
        />
        {askCity && (
          <select
            aria-label="Your city"
            value={cityChoice}
            onChange={(e) => setCityChoice(e.target.value)}
            style={{ ...fieldStyle, flex: '1 1 160px' }}
          >
            <option value="">{cityRequired ? 'Your city' : 'Your city (optional)'}</option>
            {CITY_CHOICES.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value={OTHER}>Another city…</option>
          </select>
        )}
        {askCity && cityChoice === OTHER && (
          <input
            type="text"
            placeholder="Which city?"
            aria-label="Which city"
            maxLength={80}
            value={otherCity}
            onChange={(e) => setOtherCity(e.target.value)}
            style={{ ...fieldStyle, flex: '1 1 160px' }}
          />
        )}
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
          {status === 'loading' ? 'Joining…' : buttonLabel}
        </button>
      </form>
      {message && (
        <p role="status" style={{ fontFamily: font.mono, fontSize: '12px', marginTop: '8px', color: status === 'error' ? '#E05252' : color.cyan }}>
          {message}
        </p>
      )}
      <p style={{ fontFamily: font.body, fontSize: '12px', color: color.mutedDim, marginTop: '8px' }}>
        We only email about GlobalLYNK. Unsubscribe any time. <Link to="/privacy" style={{ color: color.muted }}>Privacy policy</Link>
      </p>
    </div>
  );
}