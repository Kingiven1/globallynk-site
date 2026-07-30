import { useState } from 'react';
import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, bodyLg, body, buttonPrimary, container, section, space, font, card, radius } from '../styles/tokens';

const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate Event', 'Private Party', 'Club / Bar', 'Dance / Social', 'Other'];
const BUDGET_RANGES = ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+', 'Not sure yet'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  eventTime: '',
  eventType: '',
  venue: '',
  guestCount: '',
  budget: '',
  genres: '',
  details: '',
};

export default function BookDJ() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/book-dj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setMessage("Request sent! We'll be in touch soon to confirm details.");
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong sending your request — try again, or email us directly at thegloballynk@gmail.com.');
    }
  }

  if (status === 'success') {
    return (
      <div>
        <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xxxl}`, overflow: 'hidden' }}>
          <GradientOrb seed={71} size={420} style={{ position: 'absolute', top: '-120px', left: '-100px', zIndex: 0 }} />
          <div style={{ ...container, position: 'relative', zIndex: 1, maxWidth: '600px' }}>
            <div style={eyebrow}><span>Book a DJ</span></div>
            <h1 style={{ ...h1, fontSize: 'clamp(32px, 5vw, 48px)' }}>Request sent.</h1>
            <p style={{ ...bodyLg, marginTop: space.md }}>{message}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.lg}`, overflow: 'hidden' }}>
        <GradientOrb seed={71} size={420} style={{ position: 'absolute', top: '-120px', left: '-100px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          <div style={eyebrow}><span>Book a DJ</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 56px)', maxWidth: '700px' }}>
            Tell us about your event.
          </h1>
          <p style={{ ...bodyLg, maxWidth: '540px', marginTop: space.md }}>
            Fill this out once and we'll have everything we need to match you with
            the right DJ — no back-and-forth required.
          </p>
        </div>
      </section>

      <section style={{ ...section, paddingTop: 0 }}>
        <div style={{ ...container, maxWidth: '720px' }}>
          <form onSubmit={handleSubmit} style={{ ...card, padding: space.xl, display: 'flex', flexDirection: 'column', gap: space.md }}>
            <Row>
              <Field label="Full name" required>
                <input required style={inputStyle} value={form.name} onChange={(e) => update('name', e.target.value)} />
              </Field>
              <Field label="Email" required>
                <input required type="email" style={inputStyle} value={form.email} onChange={(e) => update('email', e.target.value)} />
              </Field>
            </Row>

            <Row>
              <Field label="Phone">
                <input style={inputStyle} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </Field>
              <Field label="Event type" required>
                <select required style={inputStyle} value={form.eventType} onChange={(e) => update('eventType', e.target.value)}>
                  <option value="">Select one</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </Row>

            <Row>
              <Field label="Event date" required>
                <input required type="date" style={inputStyle} value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} />
              </Field>
              <Field label="Event time">
                <input type="text" placeholder="e.g. 7PM - 11PM" style={inputStyle} value={form.eventTime} onChange={(e) => update('eventTime', e.target.value)} />
              </Field>
            </Row>

            <Field label="Venue / location" required>
              <input required placeholder="Venue name or city" style={inputStyle} value={form.venue} onChange={(e) => update('venue', e.target.value)} />
            </Field>

            <Row>
              <Field label="Estimated guest count">
                <input type="number" min="0" style={inputStyle} value={form.guestCount} onChange={(e) => update('guestCount', e.target.value)} />
              </Field>
              <Field label="Budget range">
                <select style={inputStyle} value={form.budget} onChange={(e) => update('budget', e.target.value)}>
                  <option value="">Select one</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </Row>

            <Field label="Genre / vibe preference">
              <input placeholder="e.g. Afrobeats, Amapiano, Hip-Hop, open format" style={inputStyle} value={form.genres} onChange={(e) => update('genres', e.target.value)} />
            </Field>

            <Field label="Additional details">
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: font.body }} value={form.details} onChange={(e) => update('details', e.target.value)} />
            </Field>

            {message && status === 'error' && (
              <p style={{ fontFamily: font.mono, fontSize: '12px', color: '#E05252' }}>{message}</p>
            )}

            <button type="submit" disabled={status === 'loading'} style={{ ...buttonPrimary, justifyContent: 'center', marginTop: space.xs }}>
              {status === 'loading' ? 'Sending…' : 'Send booking request'}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .lynk-book-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Row({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.md }} className="lynk-book-row">
      {children}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', color: color.mutedDim }}>
        {label}{required ? ' *' : ''}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bgRaised,
  border: `1px solid ${color.line}`,
  borderRadius: radius.sm,
  padding: '12px 14px',
  outline: 'none',
};